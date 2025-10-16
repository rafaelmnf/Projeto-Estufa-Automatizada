/* const db = require('../config/db');

const Usuario ={
    criar: (email, senha, callback) =>{
      const query = 'INSERT INTO usuario (email, senha) VALUES (?, ?)';
      db.query(query, [email, senha], callback);
    },

    buscarPorEmail: (email, callback) =>{
        const query = 'SELECT * FROM usuario WHERE email = ?';
        db.query(query, [email], callback);
    }
};

module.exports = Usuario;
 */

// src/models/usuarios.js
const db = require("../config/db");

const Usuario = {
  // Mantém assinatura (email, senhaHash, callback)
  criar(email, senha, callback) {
    try {
      db.ensure();
      const lower = String(email).toLowerCase();

      // Unicidade por e-mail
      const exists = db.data.usuario.find((u) => u.email === lower);
      if (exists) {
        const err = new Error("E-mail já cadastrado");
        err.code = "DUPLICATE";
        return callback(err);
      }

      const now = new Date().toISOString();
      const id = db.nextId("usuario");
      const row = { id_usuario: id, email: lower, senha, created_at: now };

      db.data.usuario.push(row);
      db.write();
      return callback(null, { insertId: id });
    } catch (e) {
      return callback(e);
    }
  },

  // Mantém assinatura (email, callback) → callback(err, rowsArray)
  buscarPorEmail(email, callback) {
    try {
      db.ensure();
      const lower = String(email).toLowerCase();
      const found = db.data.usuario.find((u) => u.email === lower);
      // Para compatibilizar com seu controller atual (que usava mysql2), devolvemos um array
      return callback(null, found ? [found] : []);
    } catch (e) {
      return callback(e);
    }
  },
};

module.exports = Usuario;
