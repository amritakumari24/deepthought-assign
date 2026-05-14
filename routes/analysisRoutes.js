const express = require('express');
const { analyzeTranscriptController } = require('../controllers/analysisController');

const router = express.Router();

router.post('/', analyzeTranscriptController);

module.exports = router;
