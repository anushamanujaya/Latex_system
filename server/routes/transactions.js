const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const densityMap = require('../data/densityMap');
const PDFDocument = require('pdfkit');
const protect = require('../middleware/auth');

// ===================== Create transaction =====================
router.post('/', protect, async (req, res) => {
  try {
    let { sellerName, liters, density, rate, status } = req.body;

    console.log("📥 Incoming transaction body:", req.body);

    // Defaults
    sellerName = sellerName ? String(sellerName).trim() : "Unknown Seller";
    status = status && status.toLowerCase() === "paid" ? "Paid" : "Not Paid";

    // Numeric conversions
    const litersNum = Number(liters);
    const densityNum = Number(density);
    const rateNum = Number(rate);

    if (!Number.isFinite(litersNum) || litersNum <= 0) {
      return res.status(400).json({ error: `Invalid liters: ${liters}` });
    }
    if (!Number.isFinite(densityNum) || densityNum <= 0) {
      return res.status(400).json({ error: `Invalid density: ${density}` });
    }
    if (!Number.isFinite(rateNum) || rateNum <= 0) {
      return res.status(400).json({ error: `Invalid rate: ${rate}` });
    }

    // Lookup density conversion
    const densityDecimal = densityMap[densityNum];
    if (densityDecimal === undefined) {
      return res.status(400).json({ error: `Invalid density value: ${densityNum} (not in densityMap)` });
    }

    // Calculate
    const kilograms = litersNum * densityDecimal;
    const totalAmount = kilograms * rateNum;

    const tx = new Transaction({
      sellerName,
      liters: litersNum,
      density: densityNum,
      densityDecimal,
      kilograms,
      rate: rateNum,
      totalAmount,
      status
    });

    await tx.save();
    console.log("✅ Transaction saved:", tx._id);
    res.json(tx);
  } catch (err) {
    console.error("❌ Error creating transaction:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===================== List with optional date range =====================
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
    console.error("❌ Error listing transactions:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===================== Get single transaction =====================
router.get('/:id', async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ error: 'Not found' });
    res.json(tx);
  } catch (err) {
    console.error("❌ Error fetching transaction:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===================== PDF bill =====================
router.get('/:id/pdf', async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).send('Not found');

    const doc = new PDFDocument({ size: [200, 284], margin: 10 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=bill_${tx._id}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(12).font("Helvetica-Bold").text("SUNETH LATEX (Pvt) Ltd", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(8).font("Helvetica").text("PURCHASE RECEIPT", { align: "center" });
    doc.moveDown(1);

    // Info
    doc.fontSize(8).font("Helvetica");
    doc.text(`Date: ${new Date(tx.createdAt).toLocaleString()}`);
    doc.text(`Seller: ${tx.sellerName}`);
    doc.moveDown(0.5);

    doc.text(`Liters: ${tx.liters}`);
    doc.text(`Density: ${tx.density} (dec: ${tx.densityDecimal})`);
    doc.text(`Kilograms: ${tx.kilograms.toFixed(2)}`);
    doc.text(`Rate: Rs. ${tx.rate.toFixed(2)}`);
    doc.text(`Total: Rs. ${tx.totalAmount.toFixed(2)}`);
    doc.moveDown(0.5);

    doc.font("Helvetica-Bold").text("Calc:");
    doc.font("Helvetica").text(`${tx.liters} × ${tx.densityDecimal} = ${tx.kilograms.toFixed(2)} Kg`);
    doc.text(`${tx.kilograms.toFixed(2)} × Rs.${tx.rate.toFixed(2)} = Rs.${tx.totalAmount.toFixed(2)}`);
    doc.moveDown(0.5);

    doc.font("Helvetica-Bold").text(`Status: ${tx.status}`);
    doc.moveDown(1);

    doc.font("Helvetica-Oblique").fontSize(8).text("Thank you!", { align: "center" });
    doc.end();
  } catch (err) {
    console.error("❌ Error generating PDF:", err);
    res.status(500).send("Server error");
  }
});


// ✅ Update transaction status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Paid', 'Not Paid'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const tx = await Transaction.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    res.json(tx);
  } catch (err) {
    console.error('❌ Error updating status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;