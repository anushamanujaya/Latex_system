const mongoose = require('mongoose');

const BowserProfitSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  litersGiven: { type: Number, required: true },
  kilosGiven: { type: Number, required: true },
  amountGiven: { type: Number, required: true },
  amountReceived: { type: Number, required: true },
  profit: { type: Number, required: true },
  diffLiters: { type: Number, default: 0 },
  diffKilos: { type: Number, default: 0 }
});

module.exports = mongoose.model('BowserProfit', BowserProfitSchema);
