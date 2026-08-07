# 🤖 AI Technical Interview Agent

> An AI-powered technical interview platform that conducts interactive interviews, evaluates candidate responses, provides real-time feedback, and generates personalized interview reports.

![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express-000000?style=for-the-badge&logo=express&logoColor=white)

---

## 🚀 Overview

**AI Technical Interview Agent** is an interactive platform designed to simulate a technical interview using AI.

Instead of simply presenting a list of questions, the application creates an interview-style conversation where candidates:

1. Start an interview
2. Answer technical questions
3. Receive AI-generated feedback
4. Continue through multiple interview questions
5. Receive skill-based scoring
6. View strengths and improvement areas
7. Get a final interview recommendation

The goal is to make technical interview preparation more realistic, interactive, and useful.

---

## ✨ Key Features

### 🎯 AI-Powered Technical Interviews

The platform conducts a structured technical interview with multiple questions covering areas such as:

- AI Engineering
- Retrieval-Augmented Generation (RAG)
- Problem Solving
- Technical Knowledge
- Communication

The interview difficulty progresses from:

**Easy → Medium → Hard**

---

### 💬 Interactive Interview Experience

Candidates interact with the AI through a chat-based interface.

The interview experience includes:

- AI interviewer messages
- Candidate responses
- Loading / AI thinking states
- Interview progress
- Question numbering
- Difficulty indicators
- Candidate information

---

### 🧠 Answer Evaluation

Each candidate response is sent to the backend for processing.

The system can return:

- Feedback
- Next interview question
- Technical score
- Communication score
- Problem-solving score
- Strengths
- Skill gaps
- Final recommendation

---

### 📊 Interview Report

After completing the interview, candidates receive a structured report containing their performance.

The report can include:

- Overall performance
- Technical skills
- Communication
- Problem-solving ability
- Strengths
- Areas for improvement
- Recommendation

---

### 👤 Candidate Dashboard

The application also provides candidate-focused views for reviewing interview information and results.

---

### 🎨 Modern UI

The frontend is built with a responsive modern interface using:

- React
- Vite
- Tailwind CSS
- Lucide Icons
- React Router

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │      Candidate       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Frontend       │
                         │   React + Vite       │
                         │                      │
                         │  Landing             │
                         │  Candidate           │
                         │  Interview           │
                         │  Report              │
                         │  Dashboard           │
                         └──────────┬───────────┘
                                    │
                              HTTP API Requests
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Backend        │
                         │   Node + Express     │
                         │                      │
                         │ Interview API        │
                         │ Answer Processing    │
                         │ Evaluation           │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     AI / Logic       │
                         │                      │
                         │ Evaluation           │
                         │ Feedback             │
                         │ Question Generation  │
                         │ Scoring              │
                         └──────────────────────┘