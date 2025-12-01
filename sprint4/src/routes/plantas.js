const express = require('express');
const router = express.Router();
const plantaController = require('../controllers/plantaController');
const autenticar = require('../middleware/authMiddleware');

// CRUD de plantas
router.post('/plantas', autenticar, plantaController.criarPlanta);
router.get('/plantas', autenticar, plantaController.listarPlantas);
router.get('/plantas/tipos', autenticar, plantaController.listarTipos);
router.get('/plantas/pesquisar', autenticar, plantaController.pesquisarPlantas);
router.get('/plantas/compativeis', autenticar, plantaController.buscarCompativeis);
router.get('/plantas/:id', autenticar, plantaController.buscarPlantaPorId);
router.put('/plantas/:id', autenticar, plantaController.atualizarPlanta);
router.delete('/plantas/:id', autenticar, plantaController.deletarPlanta);

module.exports = router;
