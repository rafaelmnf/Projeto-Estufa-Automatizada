const db = require('../config/db');

const Estufa = {
  getTemperatura: (id_estufa, callback) => {
    const sql = `
      SELECT temperatura, data_hora
      FROM clima
      WHERE id_estufa = ?
      ORDER BY data_hora DESC
      LIMIT 1
    `;
    db.query(sql, [id_estufa], callback);
  },

  getUmidade: (id_estufa, callback) => {
    const sql = `
      SELECT umidade, data_hora
      FROM clima
      WHERE id_estufa = ?
      ORDER BY data_hora DESC
      LIMIT 1
    `;
    db.query(sql, [id_estufa], callback);
  },

  getLuminosidade: (id_usuario, callback) => {
    const sql = `
      SELECT ls.valor AS luminosidade, ls.data_hora
      FROM leitura_sensor ls
      JOIN sensor s ON ls.id_sensor = s.id_sensor
      JOIN estufa e ON e.id_estufa = s.id_estufa
      WHERE e.id_usuario = ? AND s.tipo = 'luminosidade'
      ORDER BY ls.data_hora DESC
      LIMIT 1
    `;
    db.query(sql, [id_usuario], callback);
  },

  getAltura: (id_usuario, callback) => {
    const sql = `
      SELECT ls.valor AS altura, ls.data_hora
      FROM leitura_sensor ls
      JOIN sensor s ON ls.id_sensor = s.id_sensor
      JOIN estufa e ON e.id_estufa = s.id_estufa
      WHERE e.id_usuario = ? AND s.tipo = 'ultrassonico'
      ORDER BY ls.data_hora DESC
      LIMIT 1
    `;
    db.query(sql, [id_usuario], callback);
  },
};

module.exports = Estufa;