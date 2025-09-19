const mongoose = require('mongoose');

const StockMarkerSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  transactionId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model('StockMarker', StockMarkerSchema);
