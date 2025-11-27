const db = require('../config/db');

const Estufa = {
  getTemperatura: (callback) => {
    const sql = `
      SELECT temperatura, data_hora
      FROM clima
      ORDER BY data_hora DESC
      LIMIT 1
    `;
    db.query(sql, callback);
  },

  getAllTemp: (callback) => {
    const sql = `
      SELECT temperatura, data_hora
      FROM clima
      ORDER BY data_hora ASC
    `;
    db.query(sql, callback);
  },

  getUmidade: (callback) => {
    const sql = `
      SELECT umidade, data_hora
      FROM clima
      ORDER BY data_hora DESC
      LIMIT 1
    `;
    db.query(sql, callback);
  },

  getAllUmidade: (callback) => {
    const sql = `
      SELECT umidade, data_hora
      FROM clima
      ORDER BY data_hora ASC
    `;
    db.query(sql, callback);
  },

  getLuminosidade: (callback) => {
    const sql = `
      SELECT lux, data_hora
      FROM clima
      ORDER BY data_hora DESC
      LIMIT 1
    `;
    db.query(sql, callback);
  },

  getAltura: (callback) => {
    const sql = `
    SELECT altura, Data
    FROM altura
    LIMIT 1
    `;
    db.query(sql, callback);
  },
};

module.exports = Estufa;