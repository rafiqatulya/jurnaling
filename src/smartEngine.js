// ============================================================================
// DEARLY JOURNAL ENGINE — SINGLE-CALL TOKEN-EFFICIENT ARCHITECTURE
// Tidak ada API Key di dalam kode. Kunci diambil 100% dari penyimpanan lokal HP.
// ============================================================================

function extractSafeJson(rawText) {
  if (!rawText) return null;
  try {
    return JSON.parse(rawText);
  } catch {
    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      return JSON.parse(rawText.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

/**
 * Memanggil Gemini API TEPAT 1 KALI saat tombol Simpan ditekan.
 * Menghasilkan:
 * 1) daily_insights (4 kesimpulan harian yang paham konteks utuh)
 * 2) monthly_summary (pembaruan ringkasan bulan berjalan, super hemat token)
 * 3) yearly_summary (pembaruan ringkasan tahun berjalan, super hemat token)
 */
export async function generateDearlyAnalysis({
  apiKey,
  modelName = 'gemini-2.5-flash',
  userName = 'Lya',
  dateLabel,
  monthLabel,
  yearLabel,
  moodName,
  guidedInput,
  freeTextInput,
  prevMonthlySummary = '',
  prevYearlySummary = '',
  topHistoricalContext = ''
}) {
  const cleanKey = (apiKey || '').trim();
  if (!cleanKey) {
    throw new Error('NO_API_KEY');
  }

  const parts = [];
  const questionLabels = [
    ['Perasaan hari ini', guidedInput?.q1],
    ['Hal paling menyenangkan', guidedInput?.q2],
    ['Hal yang mengganggu pikiran', guidedInput?.q3],
    ['Hal yang disyukuri', guidedInput?.q4],
    ['Hal baru yang dipikirkan/dipelajari', guidedInput?.q5],
    ['Hobi/rutinitas yang ingin dicoba', guidedInput?.q6],
    ['Impian & masa depan', guidedInput?.q7],
    ['Rencana besok', guidedInput?.q8],
    ['Cerita bebas (Free Writing)', freeTextInput]
  ];

  questionLabels.forEach(([label, val]) => {
    if (val && val.trim()) {
      parts.push(`- ${label}: ${val.trim()}`);
    }
  });

  if (parts.length === 0) {
    throw new Error('EMPTY_JOURNAL');
  }

  const systemInstruction =
    `Kamu adalah sahabat refleksi jurnal pribadi untuk ${userName} di aplikasi Dearly. ` +
    `Pahami seluruh konteks cerita, emosi tersirat, dialog, dan gaya bahasa Indonesia santai penulis secara utuh. ` +
    `JANGAN pernah memotong kalimat di tengah jalan, jangan mengarang kejadian yang tidak tertulis, dan rapikan salah ketik ringan. ` +
    `Gunakan bahasa Indonesia yang hangat, natural, jelas, dan ringkas. ` +
    `Keluarkan HANYA objek JSON valid dengan struktur persis seperti berikut:\n` +
    `{\n` +
    `  "daily_insights": {\n` +
    `    "self_reflection": {\n` +
    `      "summary": "1-2 kalimat utuh yang merangkum suasana hati dan inti kejadian hari ini",\n` +
    `      "strengths": ["maks 3 poin kalimat utuh tentang hal baik/pencapaian/syukur hari ini"],\n` +
    `      "areas_to_improve": ["maks 3 poin kalimat utuh tentang hal mengganggu/pola yang perlu dijaga"]\n` +
    `    },\n` +
    `    "interests_and_hobbies": {\n` +
    `      "interests": ["maks 5 tag minat/topik bersih 1-3 kata, misal: Gitar Listrik, Desain Website, Investasi"],\n` +
    `      "potential_hobbies": ["maks 3 poin singkat aktivitas/rutinitas yang ingin dicoba"]\n` +
    `    },\n` +
    `    "future_aspirations": {\n` +
    `      "dreams": ["maks 3 impian utama yang disebut hari ini"],\n` +
    `      "career_goals": ["maks 2 target karier/bisnis jika tersirat atau disebut, boleh kosong []"],\n` +
    `      "life_goals": ["maks 2 tujuan hidup/finansial jika tersirat atau disebut, boleh kosong []"]\n` +
    `    },\n` +
    `    "personal_growth": {\n` +
    `      "lessons_learned": ["maks 3 inti pelajaran hidup/wawasan dalam kalimat utuh yang bernas"],\n` +
    `      "recommended_actions": ["maks 3 langkah kecil konkret & realistis untuk besok sesuai cerita hari ini"]\n` +
    `    }\n` +
    `  },\n` +
    `  "monthly_summary": "2-3 kalimat utuh yang memperbarui ringkasan perjalanan ${monthLabel} (sedang berjalan) dengan menggabungkan ringkasan bulan sebelumnya dan catatan hari ini.",\n` +
    `  "yearly_summary": "2-3 kalimat utuh yang memperbarui refleksi besar perjalanan tahun ${yearLabel} (sedang berjalan) dengan menggabungkan ringkasan tahun sebelumnya dan perkembangan terbaru hari ini."\n` +
    `}`;

  const userPrompt = [
    `Tanggal: ${dateLabel}`,
    `Mood dipilih: ${moodName}`,
    topHistoricalContext ? `Pola catatan sebelumnya: ${topHistoricalContext}` : '',
    prevMonthlySummary ? `Ringkasan ${monthLabel} sebelumnya: ${prevMonthlySummary}` : `Ringkasan ${monthLabel} sebelumnya: (Belum ada, ini catatan awal bulan)`,
    prevYearlySummary ? `Ringkasan tahun ${yearLabel} sebelumnya: ${prevYearlySummary}` : `Ringkasan tahun ${yearLabel} sebelumnya: (Belum ada, ini catatan awal tahun)`,
    `\nIsi Jurnal Hari Ini:\n${parts.join('\n')}`
  ]
    .filter(Boolean)
    .join('\n');

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    modelName
  )}:generateContent?key=${encodeURIComponent(cleanKey)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.35,
        responseMimeType: 'application/json',
        maxOutputTokens: 1200
      }
    })
  });

  if (!response.ok) {
    let errText = '';
    try {
      const errJson = await response.json();
      errText = errJson?.error?.message || '';
    } catch {}
    if (response.status === 400 || response.status === 403) {
      throw new Error('INVALID_KEY');
    }
    if (response.status === 429) {
      throw new Error('RATE_LIMIT');
    }
    throw new Error(errText || `HTTP_${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const parsed = extractSafeJson(rawText);

  if (!parsed || !parsed.daily_insights || !parsed.daily_insights.self_reflection) {
    throw new Error('PARSE_FAILED');
  }

  const d = parsed.daily_insights;
  const ensureArray = (val, fallback = []) =>
    Array.isArray(val) ? val.filter((x) => typeof x === 'string' && x.trim().length > 0) : fallback;

  return {
    daily_insights: {
      self_reflection: {
        summary: d.self_reflection?.summary || `Catatan hari ini dengan suasana hati ${moodName}.`,
        strengths: ensureArray(d.self_reflection?.strengths, ['Meluangkan waktu untuk merefleksikan hari ini']).slice(0, 3),
        areas_to_improve: ensureArray(d.self_reflection?.areas_to_improve, ['Tetap jaga energi dan waktu istirahat']).slice(0, 3)
      },
      interests_and_hobbies: {
        interests: ensureArray(d.interests_and_hobbies?.interests, ['Refleksi Diri']).slice(0, 6),
        potential_hobbies: ensureArray(d.interests_and_hobbies?.potential_hobbies, ['Menulis jurnal harian']).slice(0, 3)
      },
      future_aspirations: {
        dreams: ensureArray(d.future_aspirations?.dreams, []).slice(0, 3),
        career_goals: ensureArray(d.future_aspirations?.career_goals, []).slice(0, 2),
        life_goals: ensureArray(d.future_aspirations?.life_goals, []).slice(0, 2)
      },
      personal_growth: {
        lessons_learned: ensureArray(d.personal_growth?.lessons_learned, ['Setiap hari membawa pelajaran berharga']).slice(0, 3),
        recommended_actions: ensureArray(d.personal_growth?.recommended_actions, ['Fokus pada satu langkah kecil yang paling penting besok']).slice(0, 3)
      }
    },
    monthly_summary: typeof parsed.monthly_summary === 'string' ? parsed.monthly_summary.trim() : '',
    yearly_summary: typeof parsed.yearly_summary === 'string' ? parsed.yearly_summary.trim() : ''
  };
}

/**
 * Agregasi statistik lokal (0 token) untuk grafik mood, minat konsisten, impian, dan pola diri.
 */
export function computeLocalStats(entriesList, moodsList) {
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
      const k = d.trim();
      if (k) dreamCounts[k] = (dreamCounts[k] || 0) + 1;
    });

    (ins.self_reflection?.areas_to_improve || []).forEach((a) => {
      const k = a.trim();
      if (k) areaCounts[k] = (areaCounts[k] || 0) + 1;
    });

    (ins.self_reflection?.strengths || []).forEach((s) => {
      if (s && !strengthList.includes(s)) strengthList.push(s);
    });

    (ins.personal_growth?.lessons_learned || []).forEach((l) => {
      if (l && !lessonList.includes(l)) lessonList.push(l);
    });
  });

  const sortedInterests = Object.entries(interestCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const sortedDreams = Object.entries(dreamCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const sortedPatterns = Object.entries(areaCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const sortedMoods = Object.entries(moodCounts)
    .map(([moodId, count]) => ({ mood: moodsList.find((m) => m.id === moodId) || moodsList[2], count }))
    .sort((a, b) => b.count - a.count);

  const avgEnergy = sorted.length > 0 ? Math.round(totalEnergy / sorted.length) : 0;

  return {
    totalEntries: sorted.length,
    avgEnergy,
    sortedInterests,
    sortedDreams,
    sortedPatterns,
    sortedMoods,
    strengthList: strengthList.slice(-4).reverse(),
    lessonList: lessonList.slice(-4).reverse()
  };
}
