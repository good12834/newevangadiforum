const { GoogleGenAI } = require("@google/genai");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || "").trim();
const GEMINI_MODEL = (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();

async function test() {
  console.log(`Testing Gemini with model: ${GEMINI_MODEL}`);
  console.log(`API Key configured: ${!!GEMINI_API_KEY}`);
  console.log(`Key prefix: ${GEMINI_API_KEY.substring(0, 15)}...`);

  if (!GEMINI_API_KEY) {
    console.error("ERROR: No GEMINI_API_KEY found in .env");
    process.exit(1);
  }

  const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  try {
    const result = await Promise.race([
      client.models.generateContent({
        model: GEMINI_MODEL,
        contents: "How does AI work?",
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API request timed out after 120s")), 120000)
      ),
    ]);

    const outputText = result.text;

    console.log("\n=== TEST SUCCESSFUL ===");
    console.log("output_text:", outputText);
    console.log("\n✅ Gemini API is working with the new SDK!");
  } catch (error) {
    console.error("\n=== TEST FAILED ===");
    console.error("Error:", error.message);
    if (error.details) console.error("Details:", JSON.stringify(error.details, null, 2));
  }
}

test();