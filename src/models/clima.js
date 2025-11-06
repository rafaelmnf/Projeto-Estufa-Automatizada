const db = require('../config/db');

const Clima = {
  salvar: (dados, callback) => {
    const sql = `
      INSERT INTO clima (temperatura, umidade, lux, data_hora)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [dados.temperatura, dados.umidade, dados.lux, new Date()], callback);
  }
};

module.exports = Clima;
