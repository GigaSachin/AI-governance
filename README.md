CIVIC AI

AI-Powered Digital Public Infrastructure & Governance Platform

CIVIC AI is a multilingual, AI-powered civic grievance platform that
converts citizen-reported infrastructure problems into structured,
actionable governance insights.

Citizens can submit civic complaints using text, voice, location, and
optional images. Google Gemini AI analyzes the complaint, while Firebase
and BigQuery support storage and analytics. Location-aware data helps
identify geographic complaint hotspots.

🚀 Live Demo

Frontend: https://aidigitalgovernance0028-weld.vercel.app

Backend API: https://ai-governance-odgx.onrender.com

The backend uses a free Render instance, so the first request after
inactivity may take longer while the service wakes up.

🎯 Problem

Citizens frequently face problems such as broken street lights, damaged
roads, sanitation issues, water supply problems, and other public
infrastructure failures.

Traditional complaint systems often produce fragmented information that
is difficult to classify, prioritize, and analyze geographically.

CIVIC AI creates a structured pipeline:

Citizen Complaint → AI Analysis → Data Storage → Geographic Insight →
Governance Action

💡 Solution

CIVIC AI provides a platform where:

Citizens report a civic issue.

Location can be captured through browser geolocation.

Users can provide text, voice input, and an optional image.

Google Gemini AI analyzes the complaint.

The complaint is classified into category and sub-category.

Priority and sentiment are identified.

A structured summary is generated.

The complaint is securely stored.

Data is synchronized with BigQuery for analytics.

Geographic complaint data can be used to identify hotspots.

✨ Key Features

📝 Citizen Reporting

Text-based complaint submission

Voice-based complaint input

Optional image attachment

Location-aware reporting

🤖 AI Analysis

Google Gemini AI generates structured information including: -
Category - Sub-category - Issue - Priority - Sentiment - Summary

📍 Location Intelligence

Complaint coordinates can be used to visualize geographic patterns and
identify areas with concentrated civic issues.

🔥 Priority Detection

Complaints are prioritized so urgent or high-impact issues can be
surfaced for faster intervention.

☁️ Data Storage & Analytics

Firebase for application data synchronization

Google BigQuery for structured analytics

🌐 Multilingual Experience

The platform is designed with multilingual citizen interaction in mind,
supporting more accessible civic reporting across regional languages.

🏛️ Governance Intelligence

Structured complaint data helps administrators understand: - What
problems are being reported - Where problems are concentrated - Which
issues require higher priority - Where intervention may be needed

🧠 AI Processing Pipeline

Citizen Complaint
       ↓
Text / Voice / Image
       ↓
Location Capture
       ↓
Google Gemini AI
       ↓
Classification + Priority + Sentiment
       ↓
Structured Complaint Record
       ↓
Firebase
       ↓
BigQuery
       ↓
Geographic Hotspot Analysis
       ↓
Governance Intervention

🛠️ Technology Stack

Frontend

React

TypeScript

Vite

Tailwind CSS

Backend

Python

FastAPI

Uvicorn

AI

Google Gemini API

Database & Analytics

Firebase

Google BigQuery

Deployment

Vercel --- Frontend

Render --- Backend

GitHub --- Source Control

📁 Project Structure

AI-governance/
│
├── app/
│   ├── ai/
│   │   └── gemini.py
│   ├── bigquery.py
│   ├── config.py
│   ├── firebase.py
│   └── main.py
│
├── civic-ai/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── pages/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── requirements.txt
├── .env
└── README.md

⚙️ Backend Setup

Create a virtual environment:

python -m venv venv

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Start the backend:

uvicorn app.main:app --reload

Local API:

http://127.0.0.1:8000

🎨 Frontend Setup

Move into the frontend:

cd civic-ai

Install dependencies:

npm install

Start development server:

npm run dev

Production build:

npm run build

🔐 Environment Variables

Never commit API keys, Firebase credentials, or other secrets to GitHub.

Example:

VITE_API_URL=https://ai-governance-odgx.onrender.com

Backend:

GEMINI_API_KEY=your_gemini_api_key

Firebase and Google Cloud credentials should be supplied securely
through deployment secrets.

🔌 API

Example complaint retrieval endpoint:

GET /api/complaints

Production:

https://ai-governance-odgx.onrender.com/api/complaints

The complaint analysis flow uses information such as: - Complaint text -
Latitude - Longitude - Optional image

The backend processes the complaint and returns structured AI analysis.

🗺️ Geographic Hotspot Intelligence

CIVIC AI treats complaints as location-aware data rather than isolated
records.

Individual Reports
       ↓
Location Coordinates
       ↓
Complaint Clustering
       ↓
Geographic Hotspots
       ↓
Priority Intervention Areas

This helps governance teams move from simply receiving complaints to
understanding where recurring infrastructure problems are concentrated.

🔒 Security

Use environment variables for API keys.

Use deployment secret storage for service credentials.

Never commit Firebase service-account JSON files.

Never expose private API keys in frontend source code.

Configure CORS for trusted frontend origins in production.

🚀 Deployment

Frontend --- Vercel

Recommended settings for the civic-ai directory:

Root Directory: civic-ai
Install Command: npm install
Build Command: npm run build
Output Directory: dist

Environment variable:

VITE_API_URL=https://ai-governance-odgx.onrender.com

Backend --- Render

Typical settings:

Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT

Configure the root directory according to the repository structure.

📊 Example AI Output

A successfully analyzed complaint can produce:

Complaint ID: Generated ID

Priority: High

Category: Public Infrastructure

Sub-category: Street Lighting

Issue: Non-functional street light

Sentiment: Negative

Location: Captured

Summary:
A citizen reported that the local street light
has not been working for the past three months.

Firebase: Synced
BigQuery: Synced

🌍 Impact

CIVIC AI aims to improve the connection between citizens and public
administration by making civic complaints:

Easier to submit

Easier to understand

Easier to prioritize

Easier to visualize

Easier to analyze at scale

The goal is to enable data-driven, citizen-centric governance using
AI and digital public infrastructure.

🔮 Future Scope

More regional language support

Automated complaint deduplication

Advanced hotspot clustering

Predictive infrastructure failure detection

Government department routing

Complaint status tracking

Automated notifications

SLA monitoring

Municipality-level analytics

Advanced governance dashboards

Offline/low-connectivity reporting support

👥 Project

Project: CIVIC AI
Category: Digital Public Good (DPG)
Focus: AI for Digital Public Infrastructure & Governance

Built to demonstrate how AI can transform unstructured citizen
grievances into structured, location-aware governance intelligence.
