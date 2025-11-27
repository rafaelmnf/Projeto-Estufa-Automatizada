const express = require('express');
const router = express.Router();
const estufaController = require('../controllers/estufaController');
const autenticar = require('../middleware/authMiddleware');

router.get('/temperatura', autenticar, estufaController.getTemperatura);
router.get('/umidade', autenticar, estufaController.getUmidade);
router.get('/luminosidade', autenticar, estufaController.getLuminosidade);
router.get('/altura', autenticar, estufaController.getAltura);
router.get('/allTemp', autenticar, estufaController.getAllTemp);
router.get('/allUmidade', autenticar, estufaController.getAllUmidade);
router.get('/todosDados', autenticar, estufaController.getTodosDados);


module.exports = router;
    