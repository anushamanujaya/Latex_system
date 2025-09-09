require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const transactionsRouter = require('./routes/transactions');
const cashRouter = require('./routes/cash');
const reportsRouter = require('./routes/reports');
const densityRouter = require('./routes/density'); 
const authRouter = require('./routes/auth');


const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionsRouter);
app.use('/api/cash', cashRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/density', densityRouter);
app.use('/api/auth', authRouter);


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Mongo connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ Mongo connection error:', err));
