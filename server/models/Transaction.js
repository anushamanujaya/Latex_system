const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  sellerName: { type: String, required: true },
  liters: { type: Number, required: true },
  density: { type: Number, required: true },       // e.g., 150
  densityDecimal: { type: Number, required: true },// e.g., 0.40
  kilograms: { type: Number, required: true },     // liters * densityDecimal
  rate: { type: Number, required: true },          // Rs per kg
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Paid','Not Paid'], default: 'Not Paid' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
