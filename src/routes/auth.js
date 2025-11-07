const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/cadastro', authController.cadastrar);
router.post('/login-google', authController.loginGoogle);
router.post('/esqueci-senha', authController.changePassword);
router.post('/redefinir-senha', authController.resetPassword);

module.exports = router;
