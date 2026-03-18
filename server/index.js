require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Serve React build in production
app.use(express.static(path.join(__dirname, "../client/build")));

// Small helper to safely parse model JSON
function extractJson(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  }
}

// ── Job Search Endpoint ──────────────────────────────────────────────────────
app.post("/api/find-jobs", async (req, res) => {
  const { profile } = req.body;

  if (!profile) {
    return res.status(400).json({ error: "Profile is required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    sendEvent({
      type: "searching",
      message: "Searching job boards with OpenAI web search...",
    });

    const systemPrompt = `You are an expert AI job recruiter and career advisor.

Your task is to find real, currently available job listings that match a candidate's profile.

Use web search to find current listings from platforms such as LinkedIn, Indeed, RemoteOK, We Work Remotely, Glassdoor, Wellfound, company career pages, and other relevant job boards.

Search broadly across multiple angles:
- role titles
- skill combinations
- remote options
- country/authorization constraints
- visa sponsorship where relevant

Return ONLY valid JSON in exactly this format:
{
  "jobs": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country or Remote",
      "platform": "LinkedIn|Indeed|RemoteOK|WeWorkRemotely|Glassdoor|Wellfound|Company Site|Other",
      "url": "https://direct-apply-link.com",
      "salary": "$X,000 - $Y,000 / year or Not Listed",
      "type": "Full-time|Part-time|Contract|Freelance",
      "remote": true,
      "matchScore": 85,
      "matchReasons": ["reason1", "reason2", "reason3"],
      "requirements": ["req1", "req2"],
      "postedDate": "X days ago or date",
      "visaSponsorship": true
    }
  ],
  "searchSummary": "Brief summary of what you searched and found",
  "totalFound": 10,
  "tips": ["tip1", "tip2", "tip3"]
}

Rules:
- Return at least 8 jobs if possible
- Sort jobs by matchScore descending
- Use direct job links when available
- visaSponsorship should be true, false, or null
- Do not include markdown fences
- Output JSON only`;

    const userPrompt = `Find job listings matching this candidate profile:

${JSON.stringify(profile, null, 2)}

Important priorities:
- Skills: ${profile.skills || "Not specified"}
- Country: ${profile.country || "Not specified"}
- Work preference: ${profile.workPreference || "Not specified"}
- Job title: ${profile.jobTitle || "Not specified"}
- Experience: ${profile.experience || "Not specified"}

Focus on:
- remote-friendly jobs when requested
- jobs accessible from the candidate's country
- jobs with visa sponsorship if relevant
- real current listings

Return only the JSON object.`;

    const response = await client.responses.create({
      model: "gpt-5",
      tools: [{ type: "web_search" }],
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userPrompt }],
        },
      ],
    });

    const text = response.output_text || "";
    sendEvent({ type: "text_chunk", text });

    const parsed = extractJson(text);

    if (!parsed) {
      sendEvent({
        type: "error",
        message: "Could not parse job results. Please try again.",
      });
      sendEvent({ type: "done" });
      return res.end();
    }

    sendEvent({ type: "result", data: parsed });
    sendEvent({ type: "done" });
    res.end();
  } catch (err) {
    console.error("API Error:", err);
    sendEvent({ type: "error", message: err.message || "Something went wrong" });
    sendEvent({ type: "done" });
    res.end();
  }
});

// ── Profile Analysis Endpoint ────────────────────────────────────────────────
app.post("/api/analyze-profile", async (req, res) => {
  const { profile } = req.body;

  try {
    const prompt = `Analyze this job seeker profile and give a brief, encouraging assessment.

Profile:
${JSON.stringify(profile, null, 2)}

Respond ONLY with valid JSON:
{
  "strength": "one sentence about their strongest asset",
  "marketability": 75,
  "suggestedTitles": ["Title 1", "Title 2", "Title 3"],
  "improvementTip": "one actionable tip"
}`;

    const response = await client.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    const text = response.output_text || "";
    const json = extractJson(text);

    if (!json) {
      return res.status(500).json({ error: "Could not parse profile analysis" });
    }

    res.json(json);
  } catch (err) {
    console.error("Profile analysis error:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 AI Job Finder server running on port ${PORT}`);
});