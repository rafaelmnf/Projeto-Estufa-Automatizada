const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.cadastrar = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha obrigatórios', tentarNovamente: true });
    }

    Usuario.buscarPorEmail(email, async (err, resultado) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });

        if (resultado.length > 0) {
            return res.status(409).json({ erro: 'Email já cadastrado' });
        }

        try {
            const senhaCriptografada = await bcrypt.hash(senha, 10);
            Usuario.criar(email, senhaCriptografada, (err, result) => {
                if (err) return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
                res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
            });
        } catch (e) {
            res.status(500).json({ erro: 'Erro interno ao criptografar senha' });
        }
    });
};

exports.login = (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha obrigatórios' });
    }

    Usuario.buscarPorEmail(email, async (err, resultado) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });

        if (resultado.length === 0) {
            return res.status(401).json({ erro: 'Usuário não encontrado' });
        }

        const usuario = resultado[0];
        const senhaConfere = await bcrypt.compare(senha, usuario.senha);

        if (!senhaConfere) {
            return res.status(401).json({ erro: 'Senha incorreta' });
        }

        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            mensagem: 'Login bem-sucedido',
            token,
        });
    });
};
