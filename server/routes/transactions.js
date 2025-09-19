const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const densityMap = require('../data/densityMap');
const PDFDocument = require('pdfkit');
const protect = require('../middleware/auth');

// Create transaction
router.post('/', protect, async (req, res) => {
  try {
    const { sellerName, liters, density, rate, status } = req.body;
    if (!sellerName || !liters || !density || !rate) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const densityDecimal = densityMap[density];
    if (densityDecimal === undefined) {
      return res.status(400).json({ error: 'Invalid density' });
    }

    const kilograms = Number(liters) * Number(densityDecimal);
    const totalAmount = kilograms * Number(rate);

    const tx = new Transaction({
      sellerName,
      liters,
      density,
      densityDecimal,
      kilograms,
      rate,
      totalAmount,
      status: status || 'Not Paid'
    });

    await tx.save();
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List with optional date range
router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query;
    let filter = {};
    if (start || end) {
      const s = start ? new Date(start) : new Date('1970-01-01');
      const e = end ? new Date(end) : new Date();
      e.setDate(e.getDate() + 1);
      filter.createdAt = { $gte: s, $lt: e };
    }
    const items = await Transaction.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single transaction
router.get('/:id', async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) return res.status(404).json({ error: 'Not found' });
  res.json(tx);
});

// PDF bill download
router.get('/:id/pdf', async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).send('Not found');

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=bill_${tx._id}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('Suneth Latex', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date(tx.createdAt).toLocaleString()}`);
    doc.text(`Seller: ${tx.sellerName}`);
    doc.text(`Liters: ${tx.liters}`);
    doc.text(`Density: ${tx.density} (decimal: ${tx.densityDecimal})`);
    doc.text(`Kilograms: ${tx.kilograms.toFixed(2)}`);
    doc.moveDown();
    doc.text(`${tx.liters} × ${tx.densityDecimal} = ${tx.kilograms.toFixed(2)} kg`);
    doc.text(`${tx.kilograms.toFixed(2)} × Rs.${tx.rate} = Rs.${tx.totalAmount.toFixed(2)}`);
    doc.moveDown();
    doc.text(`Status: ${tx.status}`);
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// ✅ Update transaction status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Paid', 'Not Paid'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const tx = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(tx);
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
