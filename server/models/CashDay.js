// server/models/CashDay.js
const mongoose = require('mongoose');
const CashDaySchema = new mongoose.Schema({
  date: { type: Date, required: true, index: true },
  broughtFromBank: { type: Number, default: 0 },
  paidToSellers: { type: Number, default: 0 },
  moneyLeft: { type: Number, default: 0 },
  borrowed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('CashDay', CashDaySchema);
