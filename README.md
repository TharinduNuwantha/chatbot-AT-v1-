# 🤖 Tharindu's Personal Assistant Chatbot

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Framework-black?logo=express)
![Gemini](https://img.shields.io/badge/Google-Gemini-blue?logo=google)
![Deployment](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

> A **personal AI-powered chatbot** that acts as **Tharindu Nuwantha’s interactive interview assistant**.  
Deployed live here 👉 [**Chatbot on Vercel**](https://chatbot-at-v1-csv9io31e-tharindunuwanthas-projects.vercel.app/)

---

## 🌟 Overview

This project is designed to help **recruiters, interviewers, and collaborators** learn about Tharindu in a **Q&A format**.  
It answers professionally using a **structured CV dataset** combined with **Google Gemini AI models**, making it feel like you are chatting with a real human interview assistant.

### ✨ Key Highlights
- 🧑‍💼 Introduces itself as **“Tharindu’s Personal Assistant”**
- 📚 Knows about **education, projects, skills, experience**  
- 🏢 Acts like an **interview assistant** (professional tone)  
- 🔍 Uses **RAG (Retrieval-Augmented Generation)** with embeddings for accuracy  
- 🚀 Deployed on **Vercel** for global availability  

---

## 📸 Screenshots

> Replace these with real screenshots from your project.

| Landing Page | Example Chat |
|--------------|--------------|
| ![Landing Screenshot](https://github.com/TharinduNuwantha/chatbot-AT-v1-/blob/main/public/screenshot/Screenshot%202025-10-02%20193651.png) | ![Chat Screenshot](https://github.com/TharinduNuwantha/chatbot-AT-v1-/blob/main/public/screenshot/Screenshot%202025-10-02%20193651.png) |

---

## 🏗️ Architecture

```mermaid
graph TD
    A[User Browser] -->|HTTP Request| B[Frontend (HTML/CSS/JS)]
    B -->|API Call| C[Express Server (Node.js)]
    C -->|RAG: JSON Dataset| D[Profile Data (CV)]
    C -->|Generate Answer| E[Google Gemini API]
    E --> C
    C --> B
