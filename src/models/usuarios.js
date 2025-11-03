const db = require('../config/db');

const Usuario ={
    criar: (email, senha, callback) =>{
      const query = 'INSERT INTO usuario (email, senha) VALUES (?, ?)';
      db.query(query, [email, senha], callback);
    },

    buscarPorEmail: (email, callback) =>{
        const query = 'SELECT * FROM usuario WHERE email = ?';
        db.query(query, [email], callback);
    },

    executarQuery: (query, params, callback) => {
    db.query(query, params, callback);
  }
};

module.exports = Usuario;