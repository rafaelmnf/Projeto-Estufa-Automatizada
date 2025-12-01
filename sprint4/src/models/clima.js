const db = require('../config/db');

const Clima = {
  salvar: (dados, callback) => {
    const sql = `
      INSERT INTO clima (temperatura, umidade, lux, data_hora)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [dados.temperatura, dados.umidade, dados.lux, new Date()], callback);
  },

  alertaTemperatura: (callback) =>{
    const sql = `
      SELECT * FROM alerta
      WHERE tipo = “temperatura”
      ORDER BY data_hora DESC
      LIMIT 1
    `;
    db.query(sql, callback);
  },

  alertaUmidade: (callback) =>{
    const sql = `
    SELECT * FROM alerta 
    WHERE tipo = "umidade"
    ORDER BY data_hora DESC 
    LIMIT 1;
    `;
    db.query(sql, callback);
  },

  salvarAlerta: (dados, callback) =>{
    const sql = `
      INSERT INTO alerta (tipo, dados, data_hora)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [dados.tipo, dados.dados, new Date()], callback);
  },
};

module.exports = Clima;
