const db = require('../config/db');

const Estufa = {
  getTemperatura: (id_usuario, callback) => {
    const sql = `
      SELECT ls.valor AS temperatura, ls.data_hora
      FROM leitura_sensor ls
      JOIN sensor s ON ls.id_sensor = s.id_sensor
      JOIN estufa e ON e.id_estufa = s.id_estufa
      WHERE e.id_usuario = ? AND s.tipo = 'temperatura'
      ORDER BY ls.data_hora DESC
      LIMIT 1
    `;
    db.query(sql, [id_usuario], callback);
  },

  getUmidade: (id_usuario, callback) => {
    const sql = `
      SELECT ls.valor AS umidade, ls.data_hora
      FROM leitura_sensor ls
      JOIN sensor s ON ls.id_sensor = s.id_sensor
      JOIN estufa e ON e.id_estufa = s.id_estufa
      WHERE e.id_usuario = ? AND s.tipo = 'umidade'
      ORDER BY ls.data_hora DESC
      LIMIT 1
    `;
    db.query(sql, [id_usuario], callback);
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