# TalentScout AI — Job Finder

AI-powered job finder that scans LinkedIn, Indeed, RemoteOK, WeWorkRemotely, Glassdoor, Wellfound and more to match jobs to your profile.

## Tech Stack
- **Frontend**: React (dark industrial UI)
- **Backend**: Node.js + Express
- **AI**: Claude claude-sonnet-4-20250514 with web search
- **Hosting**: Render

---

## 🚀 Deploy to Render

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-job-finder.git
git push -u origin main
```

### Step 2 — Create Render Web Service
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

### Step 3 — Add Environment Variables
In Render dashboard → Environment:
```
ANTHROPIC_API_KEY = sk-ant-your-key-here
NODE_ENV = production
```

Get your API key at: https://console.anthropic.com

### Step 4 — Deploy!
Render will build and deploy automatically. Your app will be live at:
`https://ai-job-finder.onrender.com`

---

## 🏃 Run Locally

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Create .env file
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run development (both server + client)
npm run dev
```

Server runs on http://localhost:3001
Client runs on http://localhost:3000

---

## How It Works

1. User fills out profile (skills, country, work preference, etc.)
2. Backend sends profile to Claude claude-sonnet-4-20250514 with web search enabled
3. Claude searches job boards multiple times with different queries
4. Results are streamed back in real-time via SSE
5. Jobs are displayed with match scores, reasons, and direct apply links

---

## Project Structure

```
ai-job-finder/
├── server/
│   └── index.js          # Express API + Claude integration
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js         # Main app + routing
│       ├── App.css        # All styles
│       └── components/
│           ├── ProfileForm.js   # User profile input
│           └── JobResults.js    # Job cards + filtering
├── package.json           # Root (server deps)
├── render.yaml            # Render deployment config
└── .env.example           # Environment variable template
```
