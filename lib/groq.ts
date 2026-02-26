import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface MatchRequest {
  mood: string;
  duration: number;
  language: string;
  history?: string[];
  blacklist?: string[];
  isSurprise?: boolean;
}

export interface MatchResponse {
  queries: string[];
  maxDuration: number;
  reason: string;
}

export async function getYouTubeQueries(
  req: MatchRequest
): Promise<MatchResponse> {
  const historyText =
    req.history?.length ? req.history.slice(0, 10).join(", ") : "none";

  const languageHint =
    req.language === "fr"
      ? "French (prioritize French-language content)"
      : req.language === "en"
      ? "English"
      : "any language";

  const systemPrompt = req.isSurprise
    ? `You are a YouTube content discovery expert. Generate 2-3 YouTube search queries for a genuinely surprising, niche, high-quality video that someone would not think to search for but would enjoy right now. Think: unusual documentaries, obscure crafts, fascinating science, weird history, unique stories. Return ONLY valid JSON.`
    : `You are a YouTube search query expert. Given a user's watch context, generate 2-3 optimized YouTube search queries for highly relevant content. The queries should be specific enough to find quality content but not too restrictive. Return ONLY valid JSON.`;

  const userPrompt = req.isSurprise
    ? `Generate a surprising YouTube recommendation for someone watching for ${req.duration} minutes.
Language: ${languageHint}
Recently watched IDs (avoid): ${historyText}

Return this exact JSON:
{
  "queries": ["specific search query 1", "specific search query 2"],
  "maxDuration": ${req.duration * 70},
  "reason": "Why this is surprising and interesting in one short sentence"
}`
    : `Context:
- Mood/vibe: ${req.mood}
- Available time: ${req.duration} minutes
- Language: ${languageHint}
- Recently watched IDs (avoid): ${historyText}

Return this exact JSON:
{
  "queries": ["specific search query 1", "specific search query 2", "specific search query 3"],
  "maxDuration": ${req.duration * 70},
  "reason": "Brief explanation of what you picked in one short sentence"
}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: req.isSurprise ? 0.9 : 0.5,
    max_tokens: 350,
  });

  const content = response.choices[0].message.content || "";

  // Extract JSON from response (handle potential extra text)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("L'IA n'a pas retourné de réponse valide");
  }

  const parsed = JSON.parse(jsonMatch[0]) as MatchResponse;

  // Ensure maxDuration has a minimum
  if (!parsed.maxDuration || parsed.maxDuration < 60) {
    parsed.maxDuration = req.duration * 60;
  }

  return parsed;
}
