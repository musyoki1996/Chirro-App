# Kutana — Africa Social Network & Action Layer

> "Share what matters. Find your people. Turn ideas into action."

Kutana is an original, production-grade social networking web application designed to connect conversations, communities, and real-world opportunities across Africa.

---

## Key Features

- **The Action Layer**: Every post can remain an ordinary discussion or become a structured real-world action item:
  - Discussions & Community Updates
  - Knowledge Questions
  - Community Polls with real-time voting
  - Projects with collaborator recruitment & status tracking
  - Opportunities & Gigs with response proposals
  - Events & Meetups with attendee RSVPs
  - Grassroots Community Requests
- **Pulse Discovery Engine**: Transparent ranking of emerging regional topics across Kenya, Nigeria, Rwanda, Ghana, and South Africa.
- **Circles (Communities)**: Specialized hubs for software engineering, agtech, clean energy, creative arts, and entrepreneurship.
- **Warm Earth Visual Identity**: Warm espresso, golden amber, terracotta, and savannah ochre palette.
- **Bilingual Interface**: Seamless switching between English and Kiswahili.
- **Guided 5-Step Onboarding**: Profile setup, focus areas selection, circle discovery, and first action publication.
- **Trust & Moderation**: Built-in reporting system and administrative dashboard.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Build System**: Vite
- **Database & Auth**: Cloud Firestore, Firebase Authentication (Google Sign-In)

---

## Getting Started (Standalone Run)

### 1. Prerequisites
- Node.js 18+
- npm or pnpm

### 2. Installation
```bash
# Clone your repository
git clone <your-repo-url>
cd kutana-africa

# Install dependencies
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your Firebase credentials in `.env`:
```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
VITE_FIRESTORE_DATABASE_ID="(default)"
```

### 4. Running the App
```bash
# Start local development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Deploying to Production

### Deploying on Vercel
1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New Project** and select this repository.
3. Framework preset: **Vite**
4. Add your `VITE_FIREBASE_*` environment variables in Vercel settings.
5. Click **Deploy**.

### Deploying on Netlify
1. Connect your repository in [Netlify](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set your environment variables in Site settings.

---

## License
Apache-2.0
