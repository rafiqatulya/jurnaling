// ============================================================================
// SMART OFFLINE JOURNAL ENGINE
// Layer 1: On-Device Neural Language Model (Qwen2.5-0.5B-Instruct via Web Worker)
// Layer 2: Context-Aware Indonesian Discourse Synthesizer (Zero Word-Chopping)
// ============================================================================

let workerInstance = null;
let modelReady = false;
let modelLoading = false;
let pendingRequests = new Map();
let reqCounter = 1;
let statusListeners = new Set();

function notifyStatus(statusObj) {
  statusListeners.forEach((cb) => {
    try {
      cb(statusObj);
    } catch {}
  });
}

export function subscribeEngineStatus(cb) {
  statusListeners.add(cb);
  return () => statusListeners.delete(cb);
}

export function isLocalNeuralModelReady() {
  return modelReady;
}

export function initLocalNeuralModel() {
  if (modelReady) {
    notifyStatus({ state: 'ready', progress: 100 });
    return;
  }
  if (modelLoading) return;
  modelLoading = true;
  notifyStatus({ state: 'loading', progress: 5 });

  try {
    if (!workerInstance) {
      workerInstance = new Worker(new URL('./aiWorker.js', import.meta.url), {
        type: 'module'
      });

      workerInstance.addEventListener('message', (e) => {
        const msg = e.data || {};
        if (msg.type === 'progress') {
          notifyStatus({ state: 'loading', progress: msg.progress || 10 });
        } else if (msg.type === 'ready') {
          modelReady = true;
          modelLoading = false;
          try {
            localStorage.setItem('dfm_local_model_cached', '1');
          } catch {}
          notifyStatus({ state: 'ready', progress: 100 });
        } else if (msg.type === 'error') {
          modelLoading = false;
          notifyStatus({ state: 'error', progress: 0, message: msg.message });
        } else if (msg.type === 'result') {
          const resolver = pendingRequests.get(msg.id);
          if (resolver) {
            pendingRequests.delete(msg.id);
            resolver(msg);
          }
        }
      });
    }
    workerInstance.postMessage({ type: 'load' });
  } catch (err) {
    modelLoading = false;
    notifyStatus({ state: 'error', progress: 0, message: err?.message });
  }
}

function callWorker(type, payload, timeoutMs = 45000) {
  return new Promise((resolve) => {
    if (!workerInstance || !modelReady) {
      resolve({ ok: false });
      return;
    }
    const id = reqCounter++;
    const timer = setTimeout(() => {
      pendingRequests.delete(id);
      resolve({ ok: false });
    }, timeoutMs);

    pendingRequests.set(id, (msg) => {
      clearTimeout(timer);
      resolve(msg);
    });

    workerInstance.postMessage({ type, id, payload });
  });
}

// ============================================================================
// CONTEXT-AWARE INDONESIAN DISCOURSE PARSER (ZERO AWKWARD CHOPPING)
// ============================================================================

// Memecah paragraf menjadi kalimat utuh sambil melindungi tanda kutip ("oh bagus.")
function splitSentencesSmart(text) {
  if (!text) return [];
  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return [];

  const sentences = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    if (ch === '"') inQuotes = !inQuotes;
    current += ch;

    const isEndPunct = ch === '.' || ch === '!' || ch === '?';
    const nextCh = normalized[i + 1] || '';

    if (isEndPunct && !inQuotes) {
      // Jangan pecah jika bagian dari angka desimal atau singkatan umum
      const prevWord = current.slice(-5).toLowerCase();
      if (!/\d\.$/.test(prevWord) && (nextCh === ' ' || nextCh === '' || nextCh === '\n')) {
        const trimmed = current.trim();
        if (trimmed.length > 2) sentences.push(trimmed);
        current = '';
      }
    }
  }
  if (current.trim().length > 2) {
    sentences.push(current.trim());
  }

  return sentences.filter((s) => {
    const bare = s.replace(/["'.,!?()\s]/g, '').toLowerCase();
    // Buang kalimat sisa basa-basi tanpa makna mandiri seperti "Begitu.", "Gitu aja."
    if (!bare || bare.length < 4) return false;
    if (/^(begitu|gitu|gituaja|gitusih|udah|sekian|yaudah|iya|oke|heh|haha)$/.test(bare)) {
      return false;
    }
    return true;
  });
}

// Memperbaiki ejaan santai / typo umum agar hasil ringkasan lebih enak dibaca
function polishIndonesianText(text) {
  if (!text) return '';
  return text
    .replace(/\bdna\b/gi, 'dan')
    .replace(/\bdesign\b/gi, 'desain')
    .replace(/\bcopy\s+writing\b/gi, 'copywriting')
    .replace(/\bkedepan\b/gi, 'ke depan')
    .replace(/\bdiatas\b/gi, 'di atas')
    .replace(/\bga\b/gi, 'tidak')
    .replace(/\bgak\b/gi, 'tidak')
    .replace(/\bngga\b/gi, 'tidak')
    .replace(/\bnggak\b/gi, 'tidak')
    .replace(/\budah\b/gi, 'sudah')
    .replace(/\btau\b/gi, 'tahu')
    .replace(/\baja\b/gi, 'saja')
    .replace(/\bsih\b/gi, '')
    .replace(/\bkayanya\b/gi, '')
    .replace(/\bkayaknya\b/gi, '')
    .replace(/\bku\b/gi, '')
    .replace(/(\w+)\s+nya\b/gi, '$1nya')
    .replace(/\s+,/g, ',')
    .replace(/\s+\./g, '.')
    .replace(/\s+/g, ' ')
    .trim();
}

// Membuang awalan pembuka percakapan secara presisi tanpa memotong isi utamanya
function stripConversationalOpeners(sentence) {
  let s = (sentence || '').trim();
  const patterns = [
    /^(hari ini\s+)?(aku|saya|gue)\s+merasa\s+/i,
    /^hal\s+(yang\s+)?paling\s+menyenangkan(\s+hari\s+ini)?\s*(kayanya|kayaknya|sepertinya|adalah)?\s*(ketika|saat|waktu|pas)?\s*/i,
    /^hal\s+(yang\s+)?(sedikit\s+)?mengganggu(\s+pikiranku|\s+hari\s+ini)?\s*(adalah|yaitu|ketika|saat)?\s*/i,
    /^(satu\s+)?hal\s+yang\s+(aku|saya)\s+syukuri(\s+hari\s+ini)?\s*(adalah|yaitu)?\s*/i,
    /^(aku|saya)\s+(sangat\s+)?bersyukur(\s+karena|\s+bahwa)?\s+/i,
    /^dari\s+apa\s+yang\s+(aku|ku|saya)\s+tangkap,?\s*/i,
    /^(dia|beliau|mentor\s*\w*)\s+(juga\s+)?(ingin|berpikir|bilang|mengatakan|menyarankan)\s+(akan\s+lebih\s+baik\s+kalau\s+)?(aku|kami|kita)?,?\s*(sebagai\s+[\w\s]+nya,?\s*)?(anak\s+muda,?\s*)?/i,
    /^hari\s+ini\s+(juga\s+)?(aku|saya)\s+/i,
    /^(aku|saya)\s+(sangat\s+|banget\s+)?(ingin|pengen|mau|berencana|berharap|mencoba\s+buat|mencoba\s+untuk|mencoba)\s+/i,
    /^(besok\s+)?(aku|saya)\s+(ingin|mau|akan|rencananya)\s+/i,
    /^mencoba\s+(buat|untuk)\s+/i,
    /^terlalu\s+/i
  ];

  // Jalankan maksimal 2 pass untuk kalimat bertingkat seperti "Dari apa yang ku tangkap, dia ingin aku..."
  for (let pass = 0; pass < 2; pass++) {
    for (const pat of patterns) {
      if (pat.test(s) && s.replace(pat, '').trim().length >= 8) {
        // Jangan hapus "terlalu" jika konteksnya deskripsi sifat
        if (pat.source === '^terlalu\\s+') continue;
        s = s.replace(pat, '').trim();
      }
    }
  }

  s = polishIndonesianText(s).replace(/^[,;:\-\s]+|[,;:\-\s.]+$/g, '').trim();
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Mengecek apakah sebuah kalimat hanyalah pengantar meta/dialog tanpa informasi utama
function isLowValueMetaSentence(sentence) {
  const low = sentence.toLowerCase();
  if (/^(beliau|dia)\s+bilang/.test(low) && low.length < 70) return true;
  if (/memberitahukan\s+pengalaman\s*nya\s+hari\s+ini/.test(low)) return true;
  if (/cerita\s+tentang\s+pengalaman\s*nya/.test(low) && low.length < 65) return true;
  if (/tidak\s+ada\s+hal\s+berarti/.test(low)) return false;
  return false;
}

// Mengekstrak nama topik / minat yang bersih (kata benda/frasa pendek, bukan kalimat mentah)
const CLEAN_INTEREST_PATTERNS = [
  { regex: /\bgitar\s+listrik\b/i, label: 'Gitar Listrik' },
  { regex: /\bgitar\s+akustik\b/i, label: 'Gitar Akustik' },
  { regex: /\b(main\s+)?gitar\b/i, label: 'Bermain Gitar' },
  { regex: /\b(piano|keyboard|vokal|nyanyi|musik|lagu)\b/i, label: 'Musik' },
  { regex: /\b(desain\s+website|design\s+website|web\s+design|ui\/?ux|figma)\b/i, label: 'Desain Website & UI/UX' },
  { regex: /\bcopy\s*writing\b/i, label: 'Copywriting' },
  { regex: /\b(coding|koding|programming|react|github|aplikasi|software)\b/i, label: 'Coding & Aplikasi' },
  { regex: /\b(investasi|saham|reksadana|finansial|keuangan)\b/i, label: 'Investasi & Finansial' },
  { regex: /\b(bisnis\s+sendiri|wirausaha|bisnis|business|entrepreneur)\b/i, label: 'Bisnis & Wirausaha' },
  { regex: /\b(pilates|yoga|gym|workout|olahraga|lari|jogging)\b/i, label: 'Olahraga & Kebugaran' },
  { regex: /\b(jurnal|journaling|diary|menulis\s+buku|menulis\s+cerita)\b/i, label: 'Menulis & Jurnal' },
  { regex: /\b(travel|traveling|jalan-jalan|liburan)\b/i, label: 'Traveling' },
  { regex: /\b(fotografi|kamera|foto)\b/i, label: 'Fotografi' },
  { regex: /\b(baca\s+buku|membaca|novel)\b/i, label: 'Membaca' },
  { regex: /\b(masak|memasak|baking|kopi|matcha)\b/i, label: 'Kuliner & Kopi' },
  { regex: /\b(melukis|menggambar|merajut|ilustrasi)\b/i, label: 'Seni & Ilustrasi' }
];

function extractCleanTagFromHobbyText(rawText) {
  if (!rawText) return [];
  const parts = rawText
    .split(/[,;\n]|(?:\s+dan\s+)|(?:\s+serta\s+)|(?:\s+atau\s+)/i)
    .map((p) => p.trim())
    .filter(Boolean);

  const tags = [];
  parts.forEach((p) => {
    let clean = p
      .replace(/^(aku|saya)\s+(sangat\s+|banget\s+)?(ingin|pengen|mau|coba|mulai|tertarik|suka)\s+/i, '')
      .replace(/^(untuk\s+|jadikan\s+hobi\s+|rutin\s+)/i, '')
      .replace(/[.!?]+$/, '')
      .trim();
    clean = polishIndonesianText(clean);
    if (clean.length >= 3) {
      // Kapitalisasi rapi
      const formatted = clean.charAt(0).toUpperCase() + clean.slice(1);
      if (!tags.some((t) => t.toLowerCase() === formatted.toLowerCase())) {
        tags.push(formatted);
      }
    }
  });
  return tags;
}

// ============================================================================
// FUNGSI UTAMA SINTESIS KONTEKSTUAL (INSTAN & ZERO CHOPPING)
// ============================================================================
export function synthesizeJournalContextually(guidedInput, freeTextInput, moodObj, allJournalsHistory = {}) {
  const moodName = moodObj?.name || 'Neutral';
  const q1 = (guidedInput?.q1 || '').trim();
  const q2 = (guidedInput?.q2 || '').trim();
  const q3 = (guidedInput?.q3 || '').trim();
  const q4 = (guidedInput?.q4 || '').trim();
  const q5 = (guidedInput?.q5 || '').trim();
  const q6 = (guidedInput?.q6 || '').trim();
  const q7 = (guidedInput?.q7 || '').trim();
  const q8 = (guidedInput?.q8 || '').trim();
  const free = (freeTextInput || '').trim();

  const hasInput = Boolean(q1 || q2 || q3 || q4 || q5 || q6 || q7 || q8 || free);
  if (!hasInput) {
    return {
      self_reflection: {
        summary: `Suasana hati ${moodName} tercatat hari ini. Tulis ceritamu untuk melihat rangkuman lengkapnya.`,
        strengths: ['Meluangkan waktu sejenak untuk memeriksa perasaan hari ini'],
        areas_to_improve: ['Belum ada catatan cerita yang ditulis']
      },
      interests_and_hobbies: {
        interests: ['Refleksi Diri'],
        potential_hobbies: ['Menulis catatan singkat harian']
      },
      future_aspirations: {
        dreams: ['Mengenali diri dan tujuan hidup lebih jelas'],
        career_goals: [],
        life_goals: []
      },
      personal_growth: {
        lessons_learned: ['Setiap perasaan berhak diakui tanpa terburu-buru'],
        recommended_actions: ['Tuliskan satu momen paling berkesan hari ini']
      }
    };
  }

  const freeSentences = splitSentencesSmart(free);
  const allText = [q1, q2, q3, q4, q5, q6, q7, q8, free].filter(Boolean).join('. ');

  // Klasifikasi kalimat dari Free Writing (cerita panjang dalam 1 kotak)
  const freePositives = [];
  const freeFrictions = [];
  const freeLessons = [];
  const freeDreams = [];
  const freeHobbies = [];
  const freeActions = [];
  const freeFeelings = [];

  freeSentences.forEach((sent) => {
    if (isLowValueMetaSentence(sent)) return;
    const low = sent.toLowerCase();
    const cleaned = stripConversationalOpeners(sent);
    if (!cleaned) return;

    if (/\b(merasa|perasaan|mood|hari ini terasa|biasa aja|biasa saja|senang banget|sedih|lelah|capek|stres|tenang|lega)\b/i.test(low)) {
      freeFeelings.push(cleaned);
    }
    if (/\b(memuji|dipuji|berhasil|selesai|tuntas|bersyukur|syukur|alhamdulillah|menyenangkan|bangga|senang|lancar|untung|tidak ada kejadian buruk)\b/i.test(low)) {
      freePositives.push(cleaned);
    }
    if (/\b(bossy|ngegas|kasar|mengganggu|kesal|marah|kecewa|bingung|menunda|malas|overthinking|cemas|khawatir|tidak bersemangat|ga terlalu bersemangat|kurang bersemangat|capek|lelah|berat|masalah)\b/i.test(low)) {
      freeFrictions.push(cleaned);
    }
    if (/\b(belajar|pelajaran|ternyata|sadar|lebih baik|pentingnya|nasihat|berinvestasi|investasi|uang tunai|cicilan|pengalaman)\b/i.test(low)) {
      freeLessons.push(cleaned);
    }
    if (/\b(impian|cita-cita|masa depan|s2|beasiswa|amsterdam|eropa|luar negeri|bisnis sendiri|umur 35|tahun kedepan|tahun ke depan|finansial|mandiri)\b/i.test(low)) {
      freeDreams.push(cleaned);
    }
    if (/\b(hobi|rutinitas|main gitar|gitar listrik|pilates|olahraga|latihan|ingin main|pengen main|ingin belajar|mulai rutin)\b/i.test(low)) {
      freeHobbies.push(cleaned);
    }
    if (/\b(besok|rencananya|target besok|mau menyelesaikan|mencoba buat menyelesaikan|akan mengerjakan|mulai besok)\b/i.test(low)) {
      freeActions.push(cleaned);
    }
  });

  // -------------------------------------------------------------------------
  // 1. SELF REFLECTION (Rangkuman Utuh + Hal Baik + Perlu Diperhatikan)
  // -------------------------------------------------------------------------
  const strengths = [];
  if (q2) {
    const sents = splitSentencesSmart(q2).filter((s) => !isLowValueMetaSentence(s));
    const best = sents[0] || q2;
    const cleaned = stripConversationalOpeners(best);
    if (cleaned) strengths.push(cleaned);
  }
  if (q4) {
    // Gabungkan rasa syukur Q4 jadi 1 kalimat utuh yang rapi
    const cleanedQ4 = stripConversationalOpeners(
      q4.replace(/,\s*dan\s+aku\s+bersyukur\s+/gi, ' serta ')
    );
    if (cleanedQ4) strengths.push(`Bersyukur ${cleanedQ4.charAt(0).toLowerCase() + cleanedQ4.slice(1)}`);
  }
  freePositives.forEach((p) => {
    if (strengths.length < 3 && !strengths.some((x) => x.toLowerCase() === p.toLowerCase())) {
      strengths.push(p);
    }
  });
  if (strengths.length === 0) {
    strengths.push('Meluangkan waktu untuk jujur merefleksikan isi hati hari ini');
  }

  const areas = [];
  if (q3) {
    const sents = splitSentencesSmart(q3).filter((s) => !isLowValueMetaSentence(s));
    sents.forEach((s) => {
      const cleaned = stripConversationalOpeners(s);
      if (cleaned && areas.length < 3) areas.push(cleaned);
    });
  }
  freeFrictions.forEach((f) => {
    if (areas.length < 3 && !areas.some((x) => x.toLowerCase() === f.toLowerCase())) {
      areas.push(f);
    }
  });
  if (areas.length === 0) {
    areas.push('Tidak ada gangguan besar; tetap jaga energi dan waktu istirahat');
  }

  // Rangkuman 1 kalimat utuh yang menyatukan konteks suasana hati & inti kejadian
  let summary = '';
  const q1Core = q1 ? stripConversationalOpeners(splitSentencesSmart(q1)[0] || q1) : '';
  if (q1Core && strengths.length > 0 && q2) {
    const stLower = strengths[0].charAt(0).toLowerCase() + strengths[0].slice(1);
    summary = `Meski suasana hati ${moodName} (${q1Core.toLowerCase()}), ada momen positif saat ${stLower}.`;
  } else if (q1Core) {
    summary = `Hari ini tercatat dengan suasana hati ${moodName}: ${q1Core.charAt(0).toLowerCase() + q1Core.slice(1)}.`;
  } else if (freeFeelings.length > 0) {
    summary = `Suasana hati ${moodName}: ${freeFeelings[0]}.`;
  } else if (freeSentences.length > 0) {
    summary = `Suasana hati ${moodName}: ${stripConversationalOpeners(freeSentences[0])}.`;
  } else {
    summary = `Suasana hati ${moodName} dengan fokus pada ${strengths[0].toLowerCase()}.`;
  }

  // -------------------------------------------------------------------------
  // 2. INTERESTS & HOBBIES (Tag Bersih + Potensi Rutinitas Utuh)
  // -------------------------------------------------------------------------
  const interests = [];
  const potentialHobbies = [];

  // A. Ambil langsung dari Q6 dengan membersihkan awalan ("Aku sangat ingin main gitar listrik" -> "Gitar Listrik")
  if (q6) {
    const q6Hobbies = extractCleanTagFromHobbyText(q6);
    q6Hobbies.forEach((h) => {
      const hobbyLabel = /^main\s+/i.test(h) ? `Ber${h.toLowerCase()}` : h;
      const prettyHobby = hobbyLabel.charAt(0).toUpperCase() + hobbyLabel.slice(1);
      if (!potentialHobbies.some((x) => x.toLowerCase() === prettyHobby.toLowerCase())) {
        potentialHobbies.push(prettyHobby);
      }
      const shortTag = h.replace(/^(bermain|main|latihan|belajar|mencoba)\s+/i, '').trim();
      const prettyTag = shortTag ? shortTag.charAt(0).toUpperCase() + shortTag.slice(1) : prettyHobby;
      if (!interests.some((x) => x.toLowerCase() === prettyTag.toLowerCase())) {
        interests.push(prettyTag);
      }
    });
  }

  // B. Deteksi minat nyata yang muncul di keseluruhan cerita (dengan pola presisi, tidak salah tangkap)
  CLEAN_INTEREST_PATTERNS.forEach((item) => {
    if (item.regex.test(allText)) {
      // Hindari duplikasi "Gitar Listrik" + "Bermain Gitar"
      if (item.label === 'Bermain Gitar' && interests.some((t) => /gitar/i.test(t))) return;
      if (!interests.some((t) => t.toLowerCase() === item.label.toLowerCase())) {
        interests.push(item.label);
      }
    }
  });

  // C. Tambahkan hobi dari Free Writing jika ada
  freeHobbies.forEach((h) => {
    const cleanH = h.replace(/^main\s+/i, 'Bermain ');
    if (potentialHobbies.length < 3 && !potentialHobbies.some((x) => x.toLowerCase() === cleanH.toLowerCase())) {
      potentialHobbies.push(cleanH);
    }
  });

  if (interests.length === 0) interests.push('Pengembangan Diri');
  if (potentialHobbies.length === 0) potentialHobbies.push(`Meluangkan waktu rutin untuk ${interests[0].toLowerCase()}`);

  // -------------------------------------------------------------------------
  // 3. DREAMS & FUTURE ASPIRATIONS (Dari Q7 + Wawasan Masa Depan di Q5 / Free)
  // -------------------------------------------------------------------------
  const dreams = [];
  const careerGoals = [];
  const lifeGoals = [];

  const pushUnique = (arr, val) => {
    if (!val || val.length < 4) return;
    if (!arr.some((x) => x.toLowerCase() === val.toLowerCase())) {
      arr.push(val);
    }
  };

  if (q7) {
    splitSentencesSmart(q7).forEach((s) => {
      const cleaned = stripConversationalOpeners(s);
      if (!cleaned) return;
      const low = cleaned.toLowerCase();
      if (/\b(karier|bisnis|kerja|perusahaan|usaha)\b/.test(low)) {
        pushUnique(careerGoals, cleaned);
      } else if (/\b(finansial|mandiri|hidup|tenang|sehat|keluarga)\b/.test(low)) {
        pushUnique(lifeGoals, cleaned);
      } else {
        pushUnique(dreams, cleaned);
      }
    });
  }

  // Cek apakah di Q5 atau Free Writing ada visi masa depan konkret (misal bisnis di umur 35, investasi)
  const combinedFutureScan = [q5, free].filter(Boolean).join('. ');
  splitSentencesSmart(combinedFutureScan).forEach((s) => {
    const low = s.toLowerCase();
    if (/\b(bisnis sendiri|usaha sendiri|tidak lagi menjadi pekerja)\b/.test(low)) {
      pushUnique(careerGoals, 'Membangun bisnis sendiri di masa depan (usia 35+)');
    } else if (/\b(s2|beasiswa|luar negeri|amsterdam|eropa)\b/.test(low) && !q7) {
      pushUnique(dreams, stripConversationalOpeners(s));
    } else if (/\b(berinvestasi|investasi)\b/.test(low)) {
      pushUnique(lifeGoals, 'Kemandirian finansial lewat investasi sejak dini');
    }
  });

  freeDreams.forEach((d) => {
    if (dreams.length + careerGoals.length + lifeGoals.length < 3) {
      pushUnique(dreams, d);
    }
  });

  if (dreams.length === 0 && careerGoals.length === 0 && lifeGoals.length === 0) {
    const histCounts = {};
    Object.values(allJournalsHistory).forEach((entry) => {
      (entry?.daily_insights?.future_aspirations?.dreams || []).forEach((d) => {
        const cleanD = d.replace(/\s*\(dari catatan sebelumnya\)/i, '').trim();
        histCounts[cleanD] = (histCounts[cleanD] || 0) + 1;
      });
    });
    const topHist = Object.entries(histCounts).sort((a, b) => b[1] - a[1])[0];
    if (topHist) {
      dreams.push(`${topHist[0]} (dari catatan sebelumnya)`);
    } else {
      dreams.push('Terus bertumbuh dan merancang masa depan dengan matang');
    }
  }

  // -------------------------------------------------------------------------
  // 4. PERSONAL GROWTH & NEXT STEPS (Inti Pelajaran Utuh + Langkah Konkret)
  // -------------------------------------------------------------------------
  const lessons = [];
  if (q5) {
    const q5Sents = splitSentencesSmart(q5).filter((s) => !isLowValueMetaSentence(s));
    // Gabungkan ide investasi & tunai/cicilan jika muncul berdekatan agar super ringkas & bernas
    const usedIdx = new Set();
    q5Sents.forEach((s, idx) => {
      if (usedIdx.has(idx)) return;
      const low = s.toLowerCase();
      const next = q5Sents[idx + 1] || '';
      const nextLow = next.toLowerCase();

      if (low.includes('investasi') && (nextLow.includes('tunai') || nextLow.includes('cicilan'))) {
        usedIdx.add(idx + 1);
        pushUnique(lessons, 'Mulai berinvestasi sejak dini dan utamakan pembelian tunai dibanding cicilan');
      } else if (low.includes('bisnis sendiri') && nextLow.includes('pekerja')) {
        usedIdx.add(idx + 1);
        pushUnique(lessons, 'Mempersiapkan diri membangun bisnis sendiri di usia matang dibanding terus menjadi pekerja');
      } else if (!low.includes('tidak lagi menjadi pekerja')) {
        pushUnique(lessons, stripConversationalOpeners(s));
      }
    });
  }
  freeLessons.forEach((l) => {
    if (lessons.length < 3) pushUnique(lessons, l);
  });
  if (lessons.length === 0) {
    if (q4) {
      lessons.push(`Menjaga rasa syukur membantu pikiran tetap tenang di tengah hari yang ${moodName.toLowerCase()}`);
    } else {
      lessons.push('Memahami pemicu emosi hari ini membantu mengambil keputusan lebih tenang besok');
    }
  }

  const recommendedActions = [];
  if (q8) {
    // Jangan memecah "tugas website ku dan copy writing untuk isi website" secara kasar!
    splitSentencesSmart(q8).forEach((s) => {
      const cleaned = stripConversationalOpeners(s);
      if (cleaned) pushUnique(recommendedActions, cleaned);
    });
  }
  freeActions.forEach((a) => {
    if (recommendedActions.length < 3) pushUnique(recommendedActions, a);
  });

  // Berikan rekomendasi pendamping kontekstual jika ada tantangan spesifik di Q3
  if (q3 && recommendedActions.length < 2) {
    const q3Low = q3.toLowerCase();
    if (/\b(bossy|ngegas|kasar)\b/.test(q3Low)) {
      pushUnique(recommendedActions, 'Tetap tenang dan jaga batasan profesional saat berinteraksi dengan rekan kerja');
    } else if (/\b(lelah|capek|tidur)\b/.test(q3Low)) {
      pushUnique(recommendedActions, 'Luangkan waktu istirahat berkualitas malam ini agar energi pulih');
    } else if (/\b(tunda|menunda|malas)\b/.test(q3Low)) {
      pushUnique(recommendedActions, 'Mulai dari 1 langkah terkecil selama 15 menit pertama esok hari');
    }
  }
  if (q6 && recommendedActions.length < 3) {
    const firstHobby = potentialHobbies[0];
    if (firstHobby) {
      pushUnique(recommendedActions, `Sisihkan waktu luang untuk mulai mencoba ${firstHobby.toLowerCase()}`);
    }
  }
  if (recommendedActions.length === 0) {
    pushUnique(recommendedActions, 'Pilih 1 prioritas utama untuk dituntaskan dengan tenang besok');
  }

  return {
    self_reflection: {
      summary,
      strengths: strengths.slice(0, 3),
      areas_to_improve: areas.slice(0, 3)
    },
    interests_and_hobbies: {
      interests: interests.slice(0, 6),
      potential_hobbies: potentialHobbies.slice(0, 3)
    },
    future_aspirations: {
      dreams: dreams.slice(0, 3),
      career_goals: careerGoals.slice(0, 2),
      life_goals: lifeGoals.slice(0, 2)
    },
    personal_growth: {
      lessons_learned: lessons.slice(0, 3),
      recommended_actions: recommendedActions.slice(0, 3)
    }
  };
}

// ============================================================================
// WRAPPER ASYNC: MENGGUNAKAN MODEL LOKAL NEURAL JIKA AKTIF, ATAU DISCOURSE ENGINE
// ============================================================================
export async function analyzeJournalSmart(guidedInput, freeTextInput, moodObj, allJournalsHistory = {}) {
  // 1. Selalu siapkan hasil instan yang utuh dan akurat
  const discourseResult = synthesizeJournalContextually(
    guidedInput,
    freeTextInput,
    moodObj,
    allJournalsHistory
  );

  // 2. Jika paket bahasa neural lokal sudah aktif di HP, jalankan inferensi generatif offline
  if (modelReady) {
    const textBlocks = [];
    const labels = [
      ['Perasaan hari ini', guidedInput?.q1],
      ['Hal menyenangkan', guidedInput?.q2],
      ['Hal yang mengganggu', guidedInput?.q3],
      ['Hal yang disyukuri', guidedInput?.q4],
      ['Hal baru yang dipelajari', guidedInput?.q5],
      ['Hobi/rutinitas yang ingin dicoba', guidedInput?.q6],
      ['Impian masa depan', guidedInput?.q7],
      ['Rencana besok', guidedInput?.q8],
      ['Cerita bebas', freeTextInput]
    ];
    labels.forEach(([lbl, val]) => {
      if (val && val.trim()) textBlocks.push(`${lbl}: ${val.trim()}`);
    });

    if (textBlocks.length > 0) {
      // Bangun ringkasan memori singkat dari catatan sebelumnya
      const prevEntries = Object.values(allJournalsHistory).slice(-5);
      const prevInterests = [
        ...new Set(prevEntries.flatMap((e) => e?.daily_insights?.interests_and_hobbies?.interests || []))
      ].slice(0, 5);
      const prevDreams = [
        ...new Set(prevEntries.flatMap((e) => e?.daily_insights?.future_aspirations?.dreams || []))
      ].slice(0, 3);
      const historyContext = [
        prevInterests.length ? `Minat sebelumnya: ${prevInterests.join(', ')}` : '',
        prevDreams.length ? `Impian sebelumnya: ${prevDreams.join(', ')}` : ''
      ]
        .filter(Boolean)
        .join('. ');

      const res = await callWorker('summarize_daily', {
        moodName: moodObj?.name || 'Neutral',
        journalText: textBlocks.join('\n'),
        historyContext
      });

      if (res?.ok && res.data?.self_reflection?.summary) {
        // Gabungkan struktur dengan jaminan array selalu aman
        const d = res.data;
        return {
          self_reflection: {
            summary: d.self_reflection.summary || discourseResult.self_reflection.summary,
            strengths:
              Array.isArray(d.self_reflection.strengths) && d.self_reflection.strengths.length > 0
                ? d.self_reflection.strengths.slice(0, 3)
                : discourseResult.self_reflection.strengths,
            areas_to_improve:
              Array.isArray(d.self_reflection.areas_to_improve) && d.self_reflection.areas_to_improve.length > 0
                ? d.self_reflection.areas_to_improve.slice(0, 3)
                : discourseResult.self_reflection.areas_to_improve
          },
          interests_and_hobbies: {
            interests:
              Array.isArray(d.interests_and_hobbies?.interests) && d.interests_and_hobbies.interests.length > 0
                ? d.interests_and_hobbies.interests.slice(0, 6)
                : discourseResult.interests_and_hobbies.interests,
            potential_hobbies:
              Array.isArray(d.interests_and_hobbies?.potential_hobbies) && d.interests_and_hobbies.potential_hobbies.length > 0
                ? d.interests_and_hobbies.potential_hobbies.slice(0, 3)
                : discourseResult.interests_and_hobbies.potential_hobbies
          },
          future_aspirations: {
            dreams:
              Array.isArray(d.future_aspirations?.dreams) && d.future_aspirations.dreams.length > 0
                ? d.future_aspirations.dreams.slice(0, 3)
                : discourseResult.future_aspirations.dreams,
            career_goals:
              Array.isArray(d.future_aspirations?.career_goals)
                ? d.future_aspirations.career_goals.slice(0, 2)
                : discourseResult.future_aspirations.career_goals,
            life_goals:
              Array.isArray(d.future_aspirations?.life_goals)
                ? d.future_aspirations.life_goals.slice(0, 2)
                : discourseResult.future_aspirations.life_goals
          },
          personal_growth: {
            lessons_learned:
              Array.isArray(d.personal_growth?.lessons_learned) && d.personal_growth.lessons_learned.length > 0
                ? d.personal_growth.lessons_learned.slice(0, 3)
                : discourseResult.personal_growth.lessons_learned,
            recommended_actions:
              Array.isArray(d.personal_growth?.recommended_actions) && d.personal_growth.recommended_actions.length > 0
                ? d.personal_growth.recommended_actions.slice(0, 3)
                : discourseResult.personal_growth.recommended_actions
          }
        };
      }
    }
  }

  return discourseResult;
}

// ============================================================================
// SINTESIS BULANAN, TAHUNAN & SELF-DISCOVERY (MESKI PERIODE BELUM BERAKHIR)
// ============================================================================
export function computePeriodSynthesis(entriesList, moodsList, periodLabel = 'Bulan Ini') {
  const sorted = [...entriesList].sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  const interestCounts = {};
  const dreamCounts = {};
  const areaCounts = {};
  const strengthList = [];
  const lessonList = [];
  const moodCounts = {};
  let totalEnergy = 0;

  sorted.forEach((entry) => {
    const m = moodsList.find((x) => x.id === entry.moodId) || moodsList[2];
    moodCounts[entry.moodId] = (moodCounts[entry.moodId] || 0) + 1;
    totalEnergy += m.energyScore;

    const ins = entry.daily_insights;
    if (!ins) return;

    (ins.interests_and_hobbies?.interests || []).forEach((item) => {
      const k = item.trim();
      if (k) interestCounts[k] = (interestCounts[k] || 0) + 1;
    });

    const allDreams = [
      ...(ins.future_aspirations?.dreams || []),
      ...(ins.future_aspirations?.career_goals || []),
      ...(ins.future_aspirations?.life_goals || [])
    ];
    allDreams.forEach((d) => {
      const cleanD = d.replace(/\s*\(dari catatan sebelumnya\)/i, '').trim();
      if (cleanD) dreamCounts[cleanD] = (dreamCounts[cleanD] || 0) + 1;
    });

    (ins.self_reflection?.areas_to_improve || []).forEach((a) => {
      const k = a.trim();
      if (k && !k.includes('Belum ada catatan') && !k.includes('Tidak ada gangguan besar')) {
        areaCounts[k] = (areaCounts[k] || 0) + 1;
      }
    });

    (ins.self_reflection?.strengths || []).forEach((s) => {
      if (s && !strengthList.includes(s)) strengthList.push(s);
    });

    (ins.personal_growth?.lessons_learned || []).forEach((l) => {
      if (l && !lessonList.includes(l)) lessonList.push(l);
    });
  });

  const sortedInterests = Object.entries(interestCounts)
    .map(([name, count]) => ({ name, count, status: count >= 2 ? 'Konsisten' : 'Baru 1x' }))
    .sort((a, b) => b.count - a.count);

  const sortedDreams = Object.entries(dreamCounts)
    .map(([name, count]) => ({ name, count, status: count >= 2 ? 'Cita-cita Konsisten' : 'Baru 1x' }))
    .sort((a, b) => b.count - a.count);

  const sortedPatterns = Object.entries(areaCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const sortedMoods = Object.entries(moodCounts)
    .map(([moodId, count]) => ({ mood: moodsList.find((m) => m.id === moodId) || moodsList[2], count }))
    .sort((a, b) => b.count - a.count);

  const avgEnergy = sorted.length > 0 ? Math.round(totalEnergy / sorted.length) : 0;
  const topMood = sortedMoods[0]?.mood;
  const topInterestsText = sortedInterests.slice(0, 3).map((i) => i.name).join(', ');
  const topDreamsText = sortedDreams.slice(0, 2).map((d) => d.name).join(' dan ');
  const topObstacleText = sortedPatterns[0]?.name;

  let narrativeSummary = '';
  if (sorted.length === 0) {
    narrativeSummary = `Belum ada catatan pada ${periodLabel}. Mulai tulis ceritamu kapan saja—ringkasan akan tersusun otomatis meski periode ini masih berjalan.`;
  } else {
    const latestEntry = sorted[sorted.length - 1];
    narrativeSummary = `Dari ${sorted.length} catatan hingga tanggal ${latestEntry.day} (${periodLabel} masih berjalan), nuansa perasaan paling dominan adalah ${topMood.name} dengan energi rata-rata ${avgEnergy}%. `;
    if (topInterestsText) {
      narrativeSummary += `Perhatian dan minatmu paling banyak tertuju pada ${topInterestsText}. `;
    }
    if (topDreamsText) {
      narrativeSummary += `Arah masa depan yang paling menguat adalah ${topDreamsText}. `;
    }
    if (topObstacleText) {
      const obsClean = topObstacleText.charAt(0).toLowerCase() + topObstacleText.slice(1);
      narrativeSummary += `Hal penting untuk dijaga ke depannya: ${obsClean}.`;
    }
  }

  return {
    totalEntries: sorted.length,
    avgEnergy,
    sortedInterests,
    sortedDreams,
    sortedPatterns,
    sortedMoods,
    moodCounts,
    strengthList: strengthList.slice(-4).reverse(),
    lessonList: lessonList.slice(-3).reverse(),
    narrativeSummary
  };
}
