const express = require('express');
const router = express.Router();
const BowserProfit = require('../models/BowserProfit');
const protect = require('../middleware/auth');

// Create new record
router.post('/', protect, async (req, res) => {
  try {
    const { litersGiven, kilosGiven, amountGiven, amountReceived } = req.body;
    const profit = amountReceived - amountGiven;

    const record = new BowserProfit({
      litersGiven,
      kilosGiven,
      amountGiven,
      amountReceived,
      profit
    });

    await record.save();
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all records
router.get('/', protect, async (req, res) => {
  const data = await BowserProfit.find().sort({ date: 1 });
  res.json(data);
});

module.exports = router;
