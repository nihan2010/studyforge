# 📘 StudyForge  
A smart syllabus tracking app for Kerala SCERT students and customizable study workflows.

StudyForge helps students plan, track, and master their syllabus with chapter-level progress tracking, dynamic subjects, customizable tracking fields, and insightful analytics — all wrapped in a clean, responsive interface.

---

## 🚀 Live Demo  
*(Add your hosted link when deployed — e.g., Vercel or Netlify)*  
🔗 https://your-studyforge-deploy.link

---

## 🧠 What is StudyForge?

StudyForge is a productivity tool built for structured academic preparation.  
It solves the core problem most students face:

> **“I study — but I don’t know how much I’ve actually completed or where I’m weak.”**

StudyForge turns syllabus chaos into measurable progress.

Whether you follow the Kerala SCERT syllabus or want to create your own custom study plan, this app helps you stay organized and on track.

---

## 📌 Key Features

### ✔ Smart Onboarding
- Choose **Plus One / Plus Two** with stream and language
- Auto-generates SCERT syllabus subjects and chapters
- Includes English, Malayalam, and Arabic lesson names

### 🧾 Dynamic Subject System
- Subjects auto-generated from syllabus data
- Fully editable in **Custom Mode**
- Add, rename, or delete subjects

### 📊 Progress Tracking
- Track chapters with fields like:
  - Revised
  - PYQs Done
  - Exams Attended
  - Notes Completed
  - Custom user fields
- See progress percentage per chapter
- Subject completion analytics

### 🛠 Custom Column Controls
- Add new column types
- Rename columns
- **Remove unwanted fields** safely
- Columns apply to all chapters in a subject

### 📈 Analytics & Insights
- Weakest metric detector (e.g., “PYQs in Physics 28%”)
- Heat indicator for activity (Active / Recent / Cold)
- Overall syllabus progress dashboard

### 🧩 Custom Mode
- Skip SCERT onboarding
- Create your own class, subjects & chapters
- Ideal for any board or personal workflow

### 💾 Data Tools
- Export all data as JSON
- Import JSON backups
- Reset profile or subjects

### 🌙 UI + Branding
- Dark mode optimized UI
- Clean, responsive design
- Branded footer:  
  *Made From Kerala with love ❤️*  
  nihannajeeb.in

---

## 🛠 Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **State Persistence:** LocalStorage
- **Charts & Analytics:** (optional library you used)
- **Hosting:** Deployable as PWA

---

## 🧩 Installation / Setup (Local)

1. Clone the repo  
   ```bash
   git clone https://github.com/nihan2010/studyforge.git
Install dependencies

cd studyforge
npm install
Run the app

npm run dev
Your app will start at http://localhost:5173 by default.

🧭 Folder Structure
📦 studyforge
 ┣ 📂 public
 ┃ ┣ logo.png
 ┃ ┣ favicon.ico
 ┣ 📂 src
 ┃ ┣ 📂 components
 ┃ ┣ 📂 hooks
 ┃ ┣ 📂 pages
 ┃ ┣ 📂 styles
 ┃ ┣ syllabusData.js
 ┃ ┣ App.jsx
 ┃ ┣ main.jsx

