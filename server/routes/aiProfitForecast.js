const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const BowserProfit = require("../models/BowserProfit");
const protect = require("../middleware/auth");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Forecast profit scenarios
router.post("/forecast", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No query text provided" });
    }

    // Step 1: Use AI to parse scenario from natural language
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a profit projection parser for bowser latex sales.
          Output JSON format:
          {
            "liters": number | null,
            "density": number | null,
            "rate": number | null,
            "expectedAmountReceived": number | null
          }
          Example: "If I sell 1000 liters at Rs.340/kg" → {"liters":1000,"density":100,"rate":340,"expectedAmountReceived":null}`
        },
        { role: "user", content: text }
      ]
    });

    const parsed = JSON.parse(completion.choices[0].message.content || "{}");
    const { liters, density, rate, expectedAmountReceived } = parsed;

    // Step 2: Load recent avg cost/kg from past bowser sales
    const last10Profits = await BowserProfit.find({}).sort({ date: -1 }).limit(10);

    let avgCostPerKg = 90; // fallback assumption (Rs.90/kg)
    if (last10Profits.length) {
      avgCostPerKg =
        last10Profits.reduce((s, p) => s + (p.amountGiven / p.kilosGiven), 0) /
        last10Profits.length;
    }

    // Step 3: Compute estimation
    let forecast = {};
    if (liters && density && rate) {
      // ❗ simplify density decimal: density 100 ~ 0.20, density 120 ~ 0.34 ... 
      // For now you had (density / 1000) * 2; we can refine later with densityMap
      const densityDecimal = density ? (density / 1000) * 2.0 : 0.30;
      const kilos = liters * densityDecimal;

      const cost = kilos * avgCostPerKg || 0;
      const revenue = kilos * rate;
      const profit = revenue - cost;

      forecast = {
        liters,
        kilos,
        density,
        rate,
        avgCostPerKg: avgCostPerKg.toFixed(2),
        revenue,
        cost,
        profit,
      };
    } else if (expectedAmountReceived) {
      forecast = {
        expectedAmountReceived,
        avgCostPerKg: avgCostPerKg.toFixed(2),
        note: "Only direct payment provided. Cost estimated from past averages."
      };
    }

    res.json({ query: text, parsed, forecast });

  } catch (error) {
    console.error("AI Profit Forecast Error:", error);
    res.status(500).json({ error: "Forecast failed", details: error.message });
  }
});

module.exports = router;