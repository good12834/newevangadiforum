const { GoogleGenAI } = require("@google/genai");
const axios = require("axios");
const path = require("path");
const dbConnection = require("../db/dbConfig");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

// Initialize AI provider
const GEMINI_MODEL = (process.env.GEMINI_MODEL || "gemini-3.1-pro-preview").trim();
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || "").trim();
const OPENROUTER_API_KEY = (process.env.OPENROUTER_API_KEY || "").trim();
const OPENROUTER_MODEL = (process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini").trim();
const aiMode = (process.env.AI_MODE || (OPENROUTER_API_KEY ? "live" : GEMINI_API_KEY ? "live" : "demo")).toLowerCase().trim();
const requestedProvider = (process.env.AI_PROVIDER || (OPENROUTER_API_KEY ? "openrouter" : "gemini")).toLowerCase().trim();
const provider = requestedProvider === "auto" ? (OPENROUTER_API_KEY ? "openrouter" : "gemini") : requestedProvider;

// Determine if we have any API keys configured at all
const hasGeminiKey = !!GEMINI_API_KEY;
const hasOpenRouterKey = !!OPENROUTER_API_KEY;
const hasAnyKey = hasGeminiKey || hasOpenRouterKey;

// useRealApi is now a function that checks if we have keys AND are not in cooldown
function isLiveModeAvailable() {
  if (aiMode === "demo") return false;
  if (!hasAnyKey) return false;
  // Check if at least one provider is not in cooldown
  if (hasGeminiKey && !isProviderInCooldown("gemini")) return true;
  if (hasOpenRouterKey && !isProviderInCooldown("openrouter")) return true;
  return false;
}

console.log(`AI provider: ${provider}`);
console.log(`AI Model: ${provider === "openrouter" ? OPENROUTER_MODEL : GEMINI_MODEL}`);
console.log(`AI mode: ${hasAnyKey ? "live" : aiMode}`);
console.log(`Gemini API key configured: ${hasGeminiKey}`);
console.log(`OpenRouter API key configured: ${hasOpenRouterKey}`);

function buildFallbackAnswer(title, questionDescription, tag) {
  const safeTitle = (title || "your question").substring(0, 120);
  const safeTag = tag || "programming";
  return `## AI-Generated Answer (Fallback Mode)\n\n**Question:** ${safeTitle}\n\nBased on the question about "${safeTag}", here are some helpful points:\n\n1. **Understand the Problem**: ${safeTitle}...\n2. **Common Approaches**: There are several ways to approach this problem depending on your specific use case.\n3. **Best Practices**: Consider following community best practices and documentation.\n4. **Further Reading**: Check official documentation and community resources for more details.\n\n> ⚠️ *This answer was generated in fallback mode because the live AI service is currently unavailable or rate-limited.*`;
}

// Configuration
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1000;
const QUOTA_COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours cooldown after quota exhaustion
const QUOTA_COOLDOWN_HOURS = 6;

// Fallback models for OpenRouter (tried when configured model fails)
const OPENROUTER_FALLBACK_MODELS = [
  "openai/gpt-4o-mini",
  "google/gemini-2.0-flash",
  "anthropic/claude-3.5-sonnet",
  "meta-llama/llama-3.1-80b-instruct"
];

// In-memory per-provider quota cooldown tracker (keyed by provider name)
const quotaCooldownUntil = { gemini: 0, openrouter: 0 };

// Ensure aiAnswers table exists
async function ensureAiAnswersTable() {
  try {
    await dbConnection.query(
      `CREATE TABLE IF NOT EXISTS aiAnswers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question_id INT NOT NULL,
        ai_answer TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (question_id) REFERENCES questionTable(question_id) ON DELETE CASCADE
      )`
    );
  } catch (err) {
    console.log("aiAnswers table check:", err.message);
  }
}

// Sleep helper for delays
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveFallbackAnswer(questionId, answer) {
  try {
    await dbConnection.query("DELETE FROM aiAnswers WHERE question_id = ?", [questionId]);
    await dbConnection.query("INSERT INTO aiAnswers (question_id, ai_answer) VALUES (?, ?)", [questionId, answer]);
  } catch (error) {
    console.log("Unable to cache fallback AI answer:", error.message);
  }
}

// Check if error is a rate limit / quota error
function isQuotaError(error) {
  const msg = error.message || "";
  return msg.includes("429") ||
    msg.includes("503") ||
    msg.includes("Too Many Requests") ||
    msg.includes("Service Unavailable") ||
    msg.includes("quota") ||
    msg.includes("Quota exceeded") ||
    msg.includes("rate_limit") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("high demand");
}

// Check if the quota error is PERMANENT (exhausted) vs TRANSIENT (rate limited)
function isPermanentQuotaExhaustion(error) {
  const msg = error.message || "";
  // "limit: 0" indicates the quota is completely exhausted, not just rate limited
  if (msg.includes("limit: 0")) return true;
  if (msg.includes("quota") && msg.includes("exceeded") && msg.includes("free_tier")) return true;
  // OpenRouter insufficient credits
  if (msg.includes("Insufficient credits") || msg.includes("never purchased credits")) return true;
  return false;
}

// Check if a specific provider is in a cooldown period after quota exhaustion
function isProviderInCooldown(p) {
  return Date.now() < (quotaCooldownUntil[p] || 0);
}

// Check if ALL available providers are in cooldown (i.e. nothing can be tried)
function isInQuotaCooldown() {
  const available = [];
  if (hasGeminiKey) available.push("gemini");
  if (hasOpenRouterKey) available.push("openrouter");
  if (available.length === 0) return false;
  return available.every((p) => isProviderInCooldown(p));
}

async function generateContentWithProvider(prompt, modelOverride = null, providerOverride = null) {
  const effectiveProvider = providerOverride || provider;

  if (effectiveProvider === "openrouter") {
    const modelToUse = modelOverride || OPENROUTER_MODEL;
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: modelToUse,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 800,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5500",
            "X-Title": "Evangadi Forum",
          },
          timeout: 120000,
        }
      );

      const content = response?.data?.choices?.[0]?.message?.content
        || response?.data?.choices?.[0]?.text
        || response?.data?.message?.content
        || response?.data?.output_text;

      if (!content) {
        throw new Error("OpenRouter returned an empty response");
      }

      return content;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        const details = data?.error?.message || data?.message || JSON.stringify(data);
        error.message = `OpenRouter API error (${status}): ${details}`;
      }
      throw error;
    }
  }

  // Gemini provider - using @google/genai v2.11.0+ API
  const geminiModel = modelOverride || GEMINI_MODEL;
  if (!hasGeminiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const geminiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  try {
    const interaction = await Promise.race([
      geminiClient.interactions.create({
        model: geminiModel,
        input: prompt,
        generation_config: {
          thinking_level: "low",
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API request timed out after 120s")), 120000)
      ),
    ]);

    return interaction.output_text;
  } catch (error) {
    if (error.message) {
      error.message = `Gemini API error: ${error.message}`;
    }
    throw error;
  }
}

// Generate content with intelligent retry and cross-provider fallback
async function generateContentWithRetry(prompt, retries = MAX_RETRIES) {
  // If every available provider is in cooldown, throw immediately without trying
  if (isInQuotaCooldown()) {
    const error = new Error(`AI service quota exhausted across all providers. Please try again later.`);
    error.isQuotaCooldown = true;
    throw error;
  }

  // Build an ordered list of { provider, model } attempts.
  const primaryIsOpenrouter = provider === "openrouter";
  const primaryModels = primaryIsOpenrouter
    ? [OPENROUTER_MODEL, ...OPENROUTER_FALLBACK_MODELS.filter((m) => m !== OPENROUTER_MODEL)]
    : [GEMINI_MODEL];
  const altProvider = primaryIsOpenrouter ? "gemini" : "openrouter";
  const altModels = primaryIsOpenrouter
    ? (hasGeminiKey ? [GEMINI_MODEL] : [])
    : (hasOpenRouterKey ? [OPENROUTER_MODEL, ...OPENROUTER_FALLBACK_MODELS.filter((m) => m !== OPENROUTER_MODEL)] : []);

  const attempts = [
    ...primaryModels.map((m) => ({ provider: provider, model: m })),
    ...altModels.map((m) => ({ provider: altProvider, model: m })),
  ];

  let lastError;

  for (let i = 0; i < attempts.length; i++) {
    const { provider: tryProvider, model: tryModel } = attempts[i];

    // Skip a provider that is in its own cooldown (unless it's the only option)
    if (isProviderInCooldown(tryProvider) && attempts.length > 1) {
      console.log(`Skipping ${tryProvider} (in quota cooldown)`);
      continue;
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
          console.log(`AI retry attempt ${attempt}/${retries} on ${tryProvider} after ${delay}ms delay...`);
          await sleep(delay);
        }

        return await generateContentWithProvider(prompt, tryModel, tryProvider);
      } catch (error) {
        lastError = error;

        if (error.response?.status === 400) {
          const details = error.response?.data?.error?.message || error.response?.data?.message || error.message;
          console.log(`AI model "${tryModel}" on ${tryProvider} failed with 400 Bad Request: ${details}`);
          break;
        }

        if (error.response?.status === 402 || error.response?.status === 403 || error.message?.includes("Insufficient credits") || error.message?.includes("payment") || error.message?.includes("credit") || error.message?.includes("never purchased credits")) {
          // This provider's account has no credits / is forbidden. Cool it down and
          // move on to the next provider instead of aborting the whole request.
          quotaCooldownUntil[tryProvider] = Date.now() + QUOTA_COOLDOWN_MS;
          console.log(`AI provider ${tryProvider} has no credits/access. Cooling down for ${QUOTA_COOLDOWN_HOURS}h and trying next provider.`);
          break;
        }

        // If it's a permanent quota exhaustion, set a per-provider cooldown.
        // If another provider is still available, move on to it instead of aborting.
        if (isPermanentQuotaExhaustion(error)) {
          quotaCooldownUntil[tryProvider] = Date.now() + QUOTA_COOLDOWN_MS;
          console.log(`AI quota permanently exhausted on ${tryProvider}. Cooling down for ${QUOTA_COOLDOWN_HOURS}h.`);
          if (i < attempts.length - 1) {
            break;
          }
          error.isQuotaExhausted = true;
          throw error;
        }

        // If it's a transient quota error and we have retries left, keep trying
        if (isQuotaError(error) && attempt < retries) {
          console.log(`AI rate limit hit on ${tryProvider}, will retry (attempt ${attempt + 1}/${retries})`);
          continue;
        }

        // For non-quota errors, or if out of retries, break to try next provider/model
        break;
      }
    }
  }

  // All providers/models failed, use fallback
  console.log(`All AI providers failed, returning fallback answer`);
  const fallbackError = new Error("All configured AI providers are unavailable");
  fallbackError.isQuotaExhausted = true;
  throw fallbackError;
}

// Generate AI answer for a question
async function generateAiAnswer(req, res) {
  const { question_id } = req.params;
  let title = "";
  let question_description = "";
  let tag = "";

  if (!question_id) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Question ID is required",
    });
  }

  try {
    // Ensure the aiAnswers table exists
    await ensureAiAnswersTable();

    // Check if AI answer already exists for this question
    const [existingAiAnswer] = await dbConnection.query(
      "SELECT * FROM aiAnswers WHERE question_id = ?",
      [question_id]
    );

    if (existingAiAnswer.length > 0) {
      const storedAnswer = existingAiAnswer[0].ai_answer || "";
      const isDemoAnswer = storedAnswer.includes("This is a demo AI answer") || storedAnswer.includes("Demo Mode");
      const isFallbackAnswer = storedAnswer.includes("AI Answer Temporarily Unavailable") || storedAnswer.includes("Fallback Mode");

      if ((!isDemoAnswer && !isFallbackAnswer) || (!isLiveModeAvailable() && !isDemoAnswer)) {
        return res.status(200).json({
          ai_answer: existingAiAnswer[0].ai_answer,
          cached: true,
          generated_at: existingAiAnswer[0].createdAt,
        });
      }

      await dbConnection.query("DELETE FROM aiAnswers WHERE question_id = ?", [question_id]);
    }

    // Fetch the question details
    const [question] = await dbConnection.query(
      `SELECT q.title, q.question_description, q.tag 
       FROM questionTable q 
       WHERE q.question_id = ?`,
      [question_id]
    );

    if (question.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "Question not found",
      });
    }

    ({ title, question_description, tag } = question[0]);

    // If the live AI API is unavailable, return a fallback response instead of failing.
    if (!isLiveModeAvailable()) {
      const simulatedAnswer = buildFallbackAnswer(title, question_description, tag);

      await dbConnection.query(
        "INSERT INTO aiAnswers (question_id, ai_answer) VALUES (?, ?)",
        [question_id, simulatedAnswer]
      );

      return res.status(200).json({
        ai_answer: simulatedAnswer,
        cached: false,
        generated_at: new Date().toISOString(),
      });
    }

    // Generate AI answer using Gemini with retry logic
    const prompt = `You are an expert developer answering questions on a programming forum. 
Provide a comprehensive, well-structured answer to the following question:

**Title:** ${title}
**Description:** ${question_description}
**Tag:** ${tag || 'general'}

Give a detailed, helpful answer with code examples where appropriate. Format your response in Markdown.`;

    const aiAnswer = await generateContentWithRetry(prompt);

    // Store the AI answer in the database
    await dbConnection.query(
      "INSERT INTO aiAnswers (question_id, ai_answer) VALUES (?, ?)",
      [question_id, aiAnswer]
    );

    return res.status(200).json({
      ai_answer: aiAnswer,
      cached: false,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.log("AI Generation Error:", error.message);

    const fallbackAnswer = buildFallbackAnswer(title, question_description, tag);
    await saveFallbackAnswer(question_id, fallbackAnswer);

    // Determine error type for frontend display
    let errorType = "fallback";
    let errorMessage = "The live AI service is temporarily unavailable, so a fallback answer is being shown instead.";
    
    if (error.isQuotaExhausted || error.isQuotaCooldown) {
      errorType = "quota_exhausted";
      errorMessage = error.message || "AI quota exceeded. Please try again later.";
    } else if (error.message?.includes("400") || error.message?.includes("Bad Request")) {
      errorType = "quota_exhausted";
      errorMessage = "AI service is currently unavailable. A fallback answer is being shown.";
    }

    return res.status(200).json({
      ai_answer: fallbackAnswer,
      cached: false,
      error: errorMessage,
      error_type: errorType,
      generated_at: new Date().toISOString(),
    });
  }
}

// Generate answer suggestions while user is typing
async function generateAnswerSuggestions(req, res) {
  const { question_id } = req.params;
  const { partial_answer } = req.body;

  if (!question_id || !partial_answer) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Question ID and partial answer are required",
    });
  }

  // If AI is not running live, return empty suggestions
  if (!isLiveModeAvailable()) {
    return res.status(200).json({
      suggestion: null,
      note: "Set up GEMINI_API_KEY for AI suggestions",
    });
  }

  // If in cooldown, skip suggestion generation
  if (isInQuotaCooldown()) {
    return res.status(200).json({
      suggestion: null,
      error: "AI suggestion service is temporarily unavailable due to quota limits.",
    });
  }

  try {
    const [question] = await dbConnection.query(
      `SELECT q.title, q.question_description, q.tag 
       FROM questionTable q 
       WHERE q.question_id = ?`,
      [question_id]
    );

    if (question.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    const { title, question_description, tag } = question[0];

    const prompt = `You are assisting a developer writing an answer on a forum. 
The question is:
**Title:** ${title}
**Description:** ${question_description}
**Tag:** ${tag || 'general'}

The user has started writing this answer:
"${partial_answer}"

Provide a helpful continuation or suggestion (max 2-3 sentences) that improves the answer. 
Focus on accuracy, completeness, and best practices. 
If the answer already seems complete, just say "Looks good, keep going!"`;

    const suggestion = await generateContentWithRetry(prompt);

    return res.status(200).json({
      suggestion,
    });
  } catch (error) {
    console.log("AI Suggestion Error:", error.message);

    let userMessage;
    if (error.isQuotaExhausted || error.isQuotaCooldown) {
      userMessage = "AI suggestion quota has been exhausted for today.";
    } else if (isQuotaError(error)) {
      userMessage = "AI suggestion service is temporarily unavailable due to high demand. Please try again shortly.";
    } else {
      userMessage = "Could not generate suggestion at this time.";
    }

    return res.status(200).json({
      suggestion: null,
      error: userMessage,
    });
  }
}

// Suggest tags for a question
async function suggestTags(req, res) {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Question title is required",
    });
  }

  // If AI is not running live, return common tags
  if (!isLiveModeAvailable()) {
    const commonTags = ["javascript", "react", "nodejs", "python", "html", "css", "database", "api"];
    return res.status(200).json({
      suggested_tags: commonTags.slice(0, 3),
      note: "Set up GEMINI_API_KEY for AI-powered tag suggestions",
    });
  }

  // If in cooldown, return default tags
  if (isInQuotaCooldown()) {
    return res.status(200).json({
      suggested_tags: ["javascript", "react", "nodejs"],
      note: "AI tag suggestion unavailable due to quota limits. Showing default tags.",
    });
  }

  try {
    const prompt = `Based on this programming question title and description, suggest 3 relevant tags (comma-separated):
Title: ${title}
Description: ${description || 'No description provided'}

Respond with only 3 tags, comma-separated, no other text.`;

    const tagsText = await generateContentWithRetry(prompt);
    const tags = tagsText.split(",").map(t => t.trim().toLowerCase()).slice(0, 3);

    return res.status(200).json({
      suggested_tags: tags,
    });
  } catch (error) {
    console.log("Tag Suggestion Error:", error.message);
    return res.status(200).json({
      suggested_tags: ["javascript", "react", "nodejs"],
      error: error.message
    });
  }
}

module.exports = { generateAiAnswer, generateAnswerSuggestions, suggestTags };