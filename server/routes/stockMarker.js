const express = require('express');
const router = express.Router();
const StockMarker = require('../models/StockMarker');
const Transaction = require('../models/Transaction');
const protect = require('../middleware/auth');

// Create a new marker (mark current stock)
router.post('/', protect, async (req, res) => {
  const last = await Transaction.findOne().sort({ createdAt: -1 });
  if (!last) return res.status(400).json({ error: 'No transactions yet' });

  const marker = new StockMarker({ transactionId: last._id });
  await marker.save();
  res.json(marker);
});

// Get profit since last marker OR all if no marker yet
router.get('/profit', protect, async (req, res) => {
  let tx;

  const marker = await StockMarker.findOne().sort({ createdAt: -1 });

  if (!marker) {
    // ✅ No marker → include ALL transactions
    tx = await Transaction.find({});
  } else {
    // ✅ Marker exists → include only NEW ones after marker
    const markerTx = await Transaction.findById(marker.transactionId);
    tx = await Transaction.find({ createdAt: { $gt: markerTx?.createdAt || new Date(0) } });
  }

  // Calculate totals
  const totalLiters = tx.reduce((s, t) => s + t.liters, 0);
  const totalKilos = tx.reduce((s, t) => s + t.kilograms, 0);
  const totalAmount = tx.reduce((s, t) => s + t.totalAmount, 0);

  res.json({ totalLiters, totalKilos, totalAmount });
});

module.exports = router;