  const { OAuth2Client } = require('google-auth-library');
  const Usuario = require('../models/usuarios');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const nodemailer = require('nodemailer');
  const Estufa = require('../models/estufaModel');

  require('dotenv').config();
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  exports.loginGoogle = async (req, res) => {
    const { token } = req.body; // token vindo do frontend

    if (!token) {
      return res.status(400).json({ erro: 'Token Google não fornecido' });
    }

    try {
      // 1️⃣ Verifica o token com o Google
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email } = payload;

      if (!email) {
        return res.status(400).json({ erro: 'Não foi possível obter o email do Google' });
      }

      // 2️⃣ Verifica se o usuário já existe
      Usuario.buscarPorEmail(email, (err, resultado) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ erro: 'Erro ao buscar usuário no banco' });
        }

        if (resultado.length === 0) {
          // 3️⃣ Cria o usuário novo, sem senha (pois é login via Google)
          const senhaFake = null; // ou '', se sua coluna não permitir NULL
          Usuario.criar(email, senhaFake, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ erro: 'Erro ao criar usuário Google' });
            }
          });
        }

        // 4️⃣ Gera o token JWT da aplicação
        const tokenJWT = jwt.sign(
          { email },
          process.env.JWT_SECRET,
          { expiresIn: '2h' }
        );

        res.json({
          mensagem: 'Login Google bem-sucedido',
          token: tokenJWT,
          usuario: { email },
        });
      });
    } catch (err) {
      console.error(err);
      res.status(401).json({ erro: 'Token Google inválido', detalhes: err.message });
    }
  };

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

  exports.changePassword = (req, res) => {
  const { email } = req.body;

  Usuario.buscarPorEmail(email, async (err, resultado) => {
    if (err) return res.status(500).json({ erro: 'Erro interno no servidor' });

    if (resultado.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Gera token JWT válido por 15 minutos
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const resetLink = `http://localhost:5173/reset-password.html?token=${token}`; // frontend

    // Configura transporte de e-mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Monta e-mail
    const mailOptions = {
      from: `"Suporte Estufa" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Redefinição de senha',
      html: `
        <h3>Olá!</h3>
        <p>Você solicitou redefinir sua senha.</p>
        <p>Clique no link abaixo (válido por 15 minutos):</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Se não foi você, ignore este e-mail.</p>
      `
    };

    // Envia
    transporter.sendMail(mailOptions, (erro, info) => {
      if (erro) {
        console.error('Erro ao enviar e-mail:', erro);
        return res.status(500).json({ erro: 'Falha ao enviar e-mail' });
      }
      console.log('E-mail enviado:', info.response);
      res.json({ mensagem: 'E-mail de redefinição enviado com sucesso!' });
    });
  });
};

// --- Redefine senha após clique no link ---
exports.resetPassword = async (req, res) => {
  const { token, novaSenha } = req.body;

  if (!token || !novaSenha)
    return res.status(400).json({ erro: 'Token e nova senha são obrigatórios' });

  try {
    // Verifica token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Gera novo hash
    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

    // Atualiza no banco
    Usuario.changePassword(email, senhaCriptografada, (err, resultado) => {
      if (err) {
        console.error('Erro ao atualizar senha:', err);
        return res.status(500).json({ erro: 'Erro ao atualizar senha' });
      }
      res.json({ mensagem: 'Senha redefinida com sucesso!' });
    });
  } catch (error) {
    console.error('Token inválido ou expirado:', error);
    res.status(400).json({ erro: 'Token inválido ou expirado' });
  }
};