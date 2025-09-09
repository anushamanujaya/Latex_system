const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const protect = require('../middleware/auth');


const CashSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  broughtFromBank: { type: Number, required: true },
  paidToSellers: { type: Number, required: true },
  moneyLeft: { type: Number, required: true },
  borrowed: { type: Number, required: true }
});
const Cash = mongoose.model('Cash', CashSchema);

// Save cash record
router.post('/', protect, async (req, res) => {
  try {
    const { date, broughtFromBank, paidToSellers } = req.body;
    if (!date || broughtFromBank === undefined || paidToSellers === undefined) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const moneyLeft = broughtFromBank - paidToSellers;
    const borrowed = moneyLeft < 0 ? Math.abs(moneyLeft) : 0;

    const record = new Cash({
      date,
      broughtFromBank,
      paidToSellers,
      moneyLeft: moneyLeft >= 0 ? moneyLeft : 0,
      borrowed
    });

    await record.save();
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
