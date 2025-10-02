// server.js (ESM)
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Prefer GEMINI_API_KEY if present; otherwise use your existing GOOGLE_API_KEY
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error('Missing API key. Set GEMINI_API_KEY or GOOGLE_API_KEY in .env');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey }); // new SDK client
const MODEL = 'gemini-2.5-flash';       // or 'gemini-2.5-pro'


app.post('/chat', async (req, res) => {
  try {
    const userMessage = (req.body?.message ?? '').toString().trim();
    if (!userMessage) return res.status(400).json({ reply: 'Please provide a message.' });

    const r = await ai.models.generateContent({
      model: MODEL,                             // e.g., 'gemini-2.5-flash'
      contents: userMessage,                    // string is fine in @google/genai
      generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
    });

    const reply = r?.text ?? '';                // <-- key change
    if (!reply) {
      // Optional: inspect raw candidates if you still want debug info
      const cand = r?.candidates?.[0];
      console.warn('No text returned. Debug dump:', {
        finishReason: cand?.finishReason,
        safetyRatings: cand?.safetyRatings,
        groundingMetadata: cand?.groundingMetadata,
      });
      return res.json({
        reply:
          cand?.finishReason === 'SAFETY'
            ? 'Sorry — the model filtered this response for safety. Try rephrasing.'
            : 'Hmm, I did not get any text back. Please try a shorter, simpler prompt.',
      });
    }

    res.json({ reply });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ reply: 'Problem talking to Gemini. Check server logs.' });
  }
});

app.get('/_ping', async (_req, res) => {
  try {
    const r = await ai.models.generateContent({
      model: MODEL,
      contents: 'Say: pong',
    });
    res.json({ ok: true, text: r?.text ?? '' });  // <-- property, not function
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message });
  }
});




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
