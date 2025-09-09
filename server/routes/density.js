const express = require('express');
const router = express.Router();
const densityMap = require('../data/densityMap');

// Return density map
router.get('/', (req, res) => {
  res.json(densityMap);
});

module.exports = router;
