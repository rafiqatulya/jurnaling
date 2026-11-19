import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;
if (env.backends?.onnx?.wasm) {
  env.backends.onnx.wasm.numThreads = 1;
}

const MODEL_ID = 'onnx-community/Qwen2.5-0.5B-Instruct';
let generator = null;
let isLoading = false;

async function ensureModelLoaded() {
  if (generator) return generator;
  if (isLoading) return null;
  isLoading = true;
  try {
    generator = await pipeline('text-generation', MODEL_ID, {
      dtype: 'q4',
      device: 'wasm',
      progress_callback: (info) => {
        if (info && typeof info.progress === 'number') {
          self.postMessage({
            type: 'progress',
            progress: Math.round(info.progress),
            status: info.status || 'downloading'
          });
        }
      }
    });
    self.postMessage({ type: 'ready' });
    return generator;
  } catch (err) {
    self.postMessage({
      type: 'error',
      message: err?.message || 'Gagal memuat paket bahasa lokal'
    });
    return null;
  } finally {
    isLoading = false;
  }
}

function extractJsonObject(rawText) {
  if (!rawText) return null;
  const start = rawText.indexOf('{');
  const end = rawText.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  const candidate = rawText.slice(start, end + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

self.addEventListener('message', async (event) => {
  const { type, id, payload } = event.data || {};

  if (type === 'load') {
    await ensureModelLoaded();
    return;
  }

  if (type === 'summarize_daily') {
    try {
      const pipe = await ensureModelLoaded();
      if (!pipe) {
        self.postMessage({ type: 'result', id, ok: false });
        return;
      }

      const { moodName, journalText, historyContext } = payload;
      const messages = [
        {
          role: 'system',
          content:
            'Kamu asisten refleksi jurnal berbahasa Indonesia yang empatik, cerdas, dan ringkas. ' +
            'Pahami seluruh konteks cerita pengguna (jangan pernah memotong kalimat di tengah jalan). ' +
            'Balas HANYA dengan JSON valid persis mengikuti skema berikut tanpa teks tambahan:\n' +
            '{"self_reflection":{"summary":"1 kalimat utuh rangkuman perasaan & inti hari ini","strengths":["poin hal baik/syukur utuh"],"areas_to_improve":["poin kendala/hal perlu diperhatikan utuh"]},"interests_and_hobbies":{"interests":["Nama Minat Singkat"],"potential_hobbies":["Aktivitas/hobi singkat"]},"future_aspirations":{"dreams":["Impian utama"],"career_goals":["Target karier/bisnis jika ada"],"life_goals":["Tujuan hidup jika ada"]},"personal_growth":{"lessons_learned":["Inti pelajaran hidup dalam kalimat utuh"],"recommended_actions":["Langkah konkret besok dalam kalimat utuh"]}}'
        },
        {
          role: 'user',
          content:
            `Mood hari ini: ${moodName}\n` +
            (historyContext ? `Konteks catatan sebelumnya: ${historyContext}\n` : '') +
            `Catatan jurnal hari ini:\n${journalText}\n\n` +
            `Buat ringkasan JSON berbahasa Indonesia yang natural, utuh, dan benar-benar menangkap maksud penulis.`
        }
      ];

      const output = await pipe(messages, {
        max_new_tokens: 340,
        temperature: 0.25,
        do_sample: true,
        return_full_text: false
      });

      const generated = Array.isArray(output)
        ? output[0]?.generated_text
        : output?.generated_text;

      const textOut =
        typeof generated === 'string'
          ? generated
          : Array.isArray(generated)
            ? generated[generated.length - 1]?.content || ''
            : '';

      const parsed = extractJsonObject(textOut);
      if (parsed && parsed.self_reflection) {
        self.postMessage({ type: 'result', id, ok: true, data: parsed });
      } else {
        self.postMessage({ type: 'result', id, ok: false });
      }
    } catch {
      self.postMessage({ type: 'result', id, ok: false });
    }
  }

  if (type === 'summarize_period') {
    try {
      const pipe = await ensureModelLoaded();
      if (!pipe) {
        self.postMessage({ type: 'result', id, ok: false });
        return;
      }

      const { periodLabel, entriesDigest } = payload;
      const messages = [
        {
          role: 'system',
          content:
            'Kamu adalah sahabat refleksi diri berbahasa Indonesia. Rangkum perjalanan jurnal pengguna dalam 2 sampai 3 kalimat hangat, mengalir, dan utuh berdasarkan data yang diberikan. Jangan mengarang fakta di luar catatan.'
        },
        {
          role: 'user',
          content: `Periode: ${periodLabel}\nRingkasan catatan:\n${entriesDigest}\n\nTulis refleksi singkat (maksimal 3 kalimat) yang menyimpulkan suasana hati, perkembangan, dan hal yang perlu dijaga.`
        }
      ];

      const output = await pipe(messages, {
        max_new_tokens: 150,
        temperature: 0.35,
        do_sample: true,
        return_full_text: false
      });

      const generated = Array.isArray(output)
        ? output[0]?.generated_text
        : output?.generated_text;

      const textOut =
        typeof generated === 'string'
          ? generated.trim()
          : Array.isArray(generated)
            ? (generated[generated.length - 1]?.content || '').trim()
            : '';

      if (textOut && textOut.length > 20) {
        self.postMessage({ type: 'result', id, ok: true, data: textOut });
      } else {
        self.postMessage({ type: 'result', id, ok: false });
      }
    } catch {
      self.postMessage({ type: 'result', id, ok: false });
    }
  }
});
