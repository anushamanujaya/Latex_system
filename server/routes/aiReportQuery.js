const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const Transaction = require("../models/Transaction");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Parse query and return report
router.post("/query", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No query text provided" });
    }

    // Step 1: Use OpenAI to interpret user query
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a query parser for a latex purchase system.
          Take a user's natural language question and ALWAYS return JSON:
          {
            "metric": "totalLiters" | "totalKilograms" | "totalMoneyPaid" | "profit" | "averageRate",
            "startDate": "YYYY-MM-DD" | null,
            "endDate": "YYYY-MM-DD" | null,
            "sellerName": string | null
          }
          - Default: last 30 days if no date provided.
          - Profit = totalAmountAll - totalMoneyPaid.
          - averageRate = average Rs per Kg across selected range.
          Example: "How much latex last month?" -> { "metric":"totalLiters", "startDate":"2025-01-01", "endDate":"2025-01-31", "sellerName":null }`
        },
        { role: "user", content: text }
      ]
    });

    const parsed = JSON.parse(completion.choices[0].message.content || "{}");
    console.log("🔍 Parsed query:", parsed);

    const { metric, startDate, endDate, sellerName } = parsed;

    // Step 2: Build query filter
    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (sellerName) {
      filter.sellerName = new RegExp(sellerName, "i"); // case-insensitive match
    }

    // Step 3: Query MongoDB
    const tx = await Transaction.find(filter);

    let result = null;
    switch (metric) {
      case "totalLiters":
        result = tx.reduce((s, t) => s + t.liters, 0);
        break;
      case "totalKilograms":
        result = tx.reduce((s, t) => s + t.kilograms, 0);
        break;
      case "totalMoneyPaid":
        result = tx.filter(t => t.status === "Paid").reduce((s, t) => s + t.totalAmount, 0);
        break;
      case "profit":
        const totalAmountAll = tx.reduce((s, t) => s + t.totalAmount, 0);
        const moneyPaid = tx.filter(t => t.status === "Paid").reduce((s, t) => s + t.totalAmount, 0);
        result = totalAmountAll - moneyPaid;
        break;
      case "averageRate":
        result = tx.length ? (tx.reduce((s, t) => s + t.rate, 0) / tx.length) : 0;
        break;
      default:
        result = "Unknown metric";
    }

    res.json({
      query: text,
      metric,
      range: { startDate, endDate },
      sellerName,
      answer: result
    });

  } catch (error) {
    console.error("❌ AI Report Error:", error);
    res.status(500).json({ error: "AI report query failed" });
  }
});

module.exports = router;