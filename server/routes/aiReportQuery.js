const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const Transaction = require("../models/Transaction");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/query", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No query text provided" });

    const today = new Date();
    const currentYear = today.getFullYear();

    // Ask OpenAI for what metric + which relative period (not raw dates!)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a query parser for a latex reporting system.
          Output STRICT JSON with:
          {
            "metric": "totalLiters" | "totalKilograms" | "totalMoneyPaid" | "profit" | "averageRate",
            "period": "lastMonth" | "thisMonth" | "thisYear" | "lastYear" | "custom",
            "startDate": "YYYY-MM-DD" | null,
            "endDate": "YYYY-MM-DD" | null,
            "sellerName": string | null
          }
          - Use "period" for relative ranges.
          - If user gave explicit dates, set period = "custom" and fill startDate/endDate.
          - DO NOT guess wrong years — leave period hints only.`,
        },
        { role: "user", content: text },
      ],
    });

    let parsed = {};
    try {
      parsed = JSON.parse(completion.choices[0].message.content || "{}");
    } catch (err) {
      console.error("❌ AI returned non-JSON:", completion.choices[0].message.content);
      return res.status(500).json({ error: "AI returned invalid JSON" });
    }

    console.log("🔍 Parsed query:", parsed);

    let { metric, period, startDate, endDate, sellerName } = parsed;

    // Compute correct dates based on period
    const now = new Date();
    if (period === "lastMonth") {
      const firstDayPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayPrev = new Date(now.getFullYear(), now.getMonth(), 0);
      startDate = firstDayPrev.toISOString().split("T")[0];
      endDate = lastDayPrev.toISOString().split("T")[0];
    } else if (period === "thisMonth") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      startDate = firstDay.toISOString().split("T")[0];
      endDate = lastDay.toISOString().split("T")[0];
    } else if (period === "thisYear") {
      startDate = `${currentYear}-01-01`;
      endDate = `${currentYear}-12-31`;
    } else if (period === "lastYear") {
      startDate = `${currentYear - 1}-01-01`;
      endDate = `${currentYear - 1}-12-31`;
    } else if (period !== "custom") {
      // fallback default (last 30 days)
      const tmpEnd = new Date();
      const tmpStart = new Date();
      tmpStart.setDate(tmpEnd.getDate() - 30);
      startDate = tmpStart.toISOString().split("T")[0];
      endDate = tmpEnd.toISOString().split("T")[0];
    }

    // Query MongoDB
    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (sellerName) {
      filter.sellerName = new RegExp(sellerName, "i");
    }

    const tx = await Transaction.find(filter);

    // Compute result
    let result;
    switch (metric) {
      case "totalLiters":
        result = tx.reduce((s, t) => s + t.liters, 0);
        break;
      case "totalKilograms":
        result = tx.reduce((s, t) => s + t.kilograms, 0);
        break;
      case "totalMoneyPaid":
        result = tx.filter((t) => t.status === "Paid").reduce((s, t) => s + t.totalAmount, 0);
        break;
      case "profit": {
        const totalAmountAll = tx.reduce((s, t) => s + t.totalAmount, 0);
        const moneyPaid = tx.filter((t) => t.status === "Paid").reduce((s, t) => s + t.totalAmount, 0);
        result = totalAmountAll - moneyPaid;
        break;
      }
      case "averageRate":
        result = tx.length ? tx.reduce((s, t) => s + t.rate, 0) / tx.length : 0;
        break;
      default:
        result = "Unknown metric";
    }

    res.json({
      query: text,
      metric,
      period,
      range: { startDate, endDate },
      sellerName,
      answer: result,
    });
  } catch (error) {
    console.error("❌ AI Report Error:", error);
    res.status(500).json({ error: "AI report query failed" });
  }
});

module.exports = router;