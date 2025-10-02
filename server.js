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

// Your personal data set
const personalData = {
  "name": "Tharindu Nuwantha",
  "title": "Undergraduate student",
  "profile_info": "Passionate IT undergraduate specializing in full-stack development and mobile applications. Skilled in MERN stack, PHP, Flutter, and DevOps practices. Experienced in delivering real-world projects with focus on scalability, usability, and performance. Seeking an internship to contribute technical expertise and grow in software engineering.",
  "contact": {
    "phone": "+94 71 589 3934",
    "email": "tharindunuwantha77@gmail.com",
    "address": "106/2 Bothale Pahalagama Sudukanda Ambepussa",
    "linkedin": "https://www.linkedin.com/in/tharindu-nuwantha/",
    "github": "https://github.com/TharinduNuwantha",
    "website": "https://pictarea.com/"
  },
  "skills": {
    "languages": ["JavaScript", "Java", "PHP", "Kotlin", "Dart", "C", "C++", "HTML/CSS"],
    "frameworks_tools": ["React.js", "Node.js", "Express", "Spring Boot", "WordPress", "Git", "Postman", "Figma", "GitHub Actions"],
    "databases": ["MongoDB", "MySQL", "Firebase"],
    "mobile_development": ["Flutter", "Native Android (Kotlin)"],
    "other": ["SEO", "CI/CD basics"],
    "languages_proficiency": ["Sinhala (Native)", "English (Proficient)"]
  },
  "education": [
    {
      "period": "2022 - 2026",
      "degree": "BSc (Hons) in Information Technology (Specialising in IT)",
      "institution": "Sri Lanka Institute of Information Technology (SLIIT)"
    },
    {
      "period": "2022",
      "degree": "Front-End Web Development with React",
      "institution": "The Hong Kong University of Science and Technology"
    },
    {
      "period": "2019 - 2021",
      "degree": "Advanced Level (Technology stream)",
      "institution": ""
    },
    {
      "period": "2022",
      "degree": "Front-End Web UI Frameworks and Tools: Bootstrap 4",
      "institution": "The Hong Kong University of Science and Technology"
    }
  ],
  "projects": [
    {
      "period": "2022 - 2025",
      "projects": [
        "Blood Donation App (Flutter, Firebase) – Real-time donor requests & notifications",
        "E-commerce Platform (MERN) – Integrated cart, checkout, authentication, and payments",
        "Food Delivery App (Flutter) – Stylish UI with real-time order tracking & maps",
        "To-Do App (Kotlin) – Offline tasks with alarms & local storage",
        "Inventory Management System (PHP/MySQL) – Admin panel for stock, suppliers, and alerts",
        "Photo Sharing Platform (Spring Boot) – Upload, like, and comment features",
        "Online Help Desk (Java) – Ticket system with admin/user views",
        "Buy & Sell Website (MERN) – Online marketplace with authentication, search, and payment gateway integration"
      ]
    },
    {
      "period": "2022 - LIVE",
      "project": "Pictarea.com (PHP/MySQL) – Multimedia platform for browsing, downloading, and printing coloring pages, PNGs, wallpapers, and emojis with search, categorization, and dynamic content management"
    }
  ],
  "certifications_links": [
    "https://coursera.org/share/55afb53b2f09db82ab0ee729521c1985",
    "https://www.coursera.org/learn/bootstrap-4",
    "https://coursera.org/share/a08153008739d19a4a8fb3240431dd2a"
  ]
};

// Convert your data to a string format suitable for the prompt
const personalDataString = JSON.stringify(personalData, null, 2);

app.post('/chat', async (req, res) => {
  try {
    const userMessage = (req.body?.message ?? '').toString().trim();
    if (!userMessage) return res.status(400).json({ reply: 'Please provide a message.' });

    // Craft a detailed prompt including your data and instructions for the AI
    const prompt = `
      You are a personal assistant whose purpose is to answer questions about Tharindu Nuwantha.
      Below is a JSON object containing Tharindu Nuwantha's personal and professional data.
      Use only the information provided in this data to answer questions.
      If a question cannot be answered from the provided data, state that you don't have that information.
      Do not invent information. Act as if you are Tharindu Nuwantha, or speaking on their behalf, in a professional and informative manner.

      Tharindu Nuwantha's Data:
      ${personalDataString}

      User's Question: "${userMessage}"
      
      Your Answer:
    `;

    const r = await ai.models.generateContent({
      model: MODEL,
      contents: prompt, // Use the crafted prompt
      generationConfig: { maxOutputTokens: 512, temperature: 0.2 }, // Lower temperature for more factual answers
    });

    const reply = r?.text ?? '';
    if (!reply) {
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
    res.json({ ok: true, text: r?.text ?? '' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});