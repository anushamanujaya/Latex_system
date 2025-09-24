const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// Setup instance of OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route: Parse purchase command from speech text
router.post("/parsePurchase", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" }, // <- guarantees valid JSON
      messages: [
        {
          role: "system",
          content: `You are a strict purchase info parser.
          Extract ONLY JSON in this exact schema:
          {
            "sellerName": string (seller's name),
            "liters": number (liters purchased),
            "density": number (from 50-150, integer),
            "rate": number (rupees per kg),
            "status": "Paid" or "Not Paid"
          }

          Defaults:
          - status = "Not Paid" if unclear
          - sellerName = "Unknown Seller" if missing
          - liters, density, rate must always be numeric (no units/words).`,
        },
        { role: "user", content: text },
      ],
    });

    const parsed = completion.choices[0].message.content;

    let data;
    try {
      data = JSON.parse(parsed);
    } catch (err) {
      console.error("❌ JSON parsing failed:", parsed);
      return res.status(500).json({ error: "AI returned invalid JSON" });
    }

    console.log("✅ AI parsed:", data);
    res.json(data);

  } catch (error) {
    console.error("AI Parse Error:", error);
    res.status(500).json({ error: "AI parse failed" });
  }
});

module.exports = router;