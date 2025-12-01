const express = require('express');
const router = express.Router();
const previsaoController = require('../controllers/previsaoController');
const autenticar = require('../middleware/authMiddleware');

router.get('/previsao', autenticar, previsaoController.obterPrevisao);

module.exports = router;
