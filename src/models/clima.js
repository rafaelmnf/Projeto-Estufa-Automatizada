const db = require('../config/db');

const Clima = {
  salvar: (dados, callback) => {
    const sql = `
      INSERT INTO clima (temperatura, umidade, data_coleta)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [dados.temperatura, dados.umidade, new Date()], callback);
  }
};

module.exports = Clima;