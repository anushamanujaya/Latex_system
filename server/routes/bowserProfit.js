const express = require('express');
const router = express.Router();
const BowserProfit = require('../models/BowserProfit');
const StockMarker = require('../models/StockMarker');
const Transaction = require('../models/Transaction');
const protect = require('../middleware/auth');

// Create new bowser profit record
router.post('/', protect, async (req, res) => {
  try {
    const { amountReceived } = req.body;
    if (amountReceived === undefined) {
      return res.status(400).json({ error: 'Amount received is required' });
    }

    // Step 1: Find last stock marker
    const marker = await StockMarker.findOne().sort({ createdAt: -1 });

    // Step 2: Find transactions since last marker
    let tx;
    if (!marker) {
      tx = await Transaction.find({});
    } else {
      const markerTx = await Transaction.findById(marker.transactionId);
      tx = await Transaction.find({ createdAt: { $gt: markerTx?.createdAt || new Date(0) } });
    }

    if (tx.length === 0) {
      return res.status(400).json({ error: 'No new transactions since last bowser sale' });
    }

    // Step 3: Calculate totals
    const litersGiven = tx.reduce((s, t) => s + (t.liters || 0), 0);
    const kilosGiven = tx.reduce((s, t) => s + (t.kilograms || 0), 0);
    const amountGiven = tx.reduce((s, t) => s + (t.totalAmount || 0), 0);

    if (!Number.isFinite(amountGiven) || !Number.isFinite(litersGiven) || !Number.isFinite(kilosGiven)) {
      return res.status(400).json({ error: 'Invalid calculated totals' });
    }

    const profit = amountReceived - amountGiven;

    // Step 4: Save BowserProfit
    const record = new BowserProfit({
      litersGiven,
      kilosGiven,
      amountGiven,
      amountReceived,
      profit,
    });
    await record.save();

    // Step 5: Place a new marker at last transaction
    const lastTx = tx[tx.length - 1];
    const newMarker = new StockMarker({ transactionId: lastTx._id });
    await newMarker.save();

    res.json({ record, newMarker });
  } catch (err) {
    console.error("❌ Bowser profit error:", err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Fetch all BowserProfit history
router.get('/', protect, async (req, res) => {
  const data = await BowserProfit.find().sort({ date: 1 });
  res.json(data);
});

module.exports = router;