const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const protect = require('../middleware/auth');


// Summary report
router.get('/summary', protect, async (req, res) => {
  try {
    const { date, start, end } = req.query;
    let s, e;

    if (date) {
      s = new Date(date);
      e = new Date(date);
      e.setDate(e.getDate() + 1);
    } else {
      s = start ? new Date(start) : new Date('1970-01-01');
      e = end ? new Date(end) : new Date();
      e.setDate(e.getDate() + 1);
    }

    const agg = await Transaction.aggregate([
      { $match: { createdAt: { $gte: s, $lt: e } } },
      {
        $group: {
          _id: null,
          totalLiters: { $sum: "$liters" },
          totalKilograms: { $sum: "$kilograms" },
          totalMoneyPaid: {
            $sum: { $cond: [{ $eq: ["$status", "Paid"] }, "$totalAmount", 0] }
          },
          totalAmountAll: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(
      agg[0] || { totalLiters: 0, totalKilograms: 0, totalMoneyPaid: 0, totalAmountAll: 0, count: 0 }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
