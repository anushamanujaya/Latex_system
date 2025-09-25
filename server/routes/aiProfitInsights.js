const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const BowserProfit = require("../models/BowserProfit");
const protect = require("../middleware/auth");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate insights from BowserProfit history
router.get("/insights", protect, async (req, res) => {
  try {
    // Load last 10 bowser profit records
    const records = await BowserProfit.find({})
      .sort({ date: -1 })
      .limit(10);

    if (!records.length) {
      return res.json({ insights: ["No profit records found yet."] });
    }

    // Prepare summary data for AI
    const inputData = records.map(r => ({
      date: r.date,
      liters: r.litersGiven,
      kilos: r.kilosGiven,
      cost: r.amountGiven,
      received: r.amountReceived,
      profit: r.profit
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a business data analyst. I will give you latex bowser sale history (in JSON).
          Summarize with clear insights, trends, best/worst trips. Focus on profit, average liters, trends.
          Limit to 5 short bullet points.`
        },
        {
          role: "user",
          content: JSON.stringify(inputData, null, 2),
        },
      ],
    });

    const message = completion.choices[0].message.content;
    res.json({ insights: message });
  } catch (error) {
    console.error("AI Profit Insights Error:", error);
    res.status(500).json({ error: "AI insights generation failed" });
  }
});

module.exports = router;