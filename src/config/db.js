/* const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

module.exports = db;
 */

// src/config/db.js
const fs = require("fs");
const path = require("path");

const FILE = path.resolve(process.cwd(), "db.json");

function load() {
  if (!fs.existsSync(FILE)) {
    const seed = {
      usuario: [], // { id_usuario, email, senha, created_at }
      estufa: [], // { id_estufa, id_usuario, nome, created_at }
      sensor: [], // { id_sensor, id_estufa, tipo, created_at }
      leitura_sensor: [], // { id_leitura, id_sensor, valor, data_hora }
      counters: { usuario: 0, estufa: 0, sensor: 0, leitura_sensor: 0 },
    };
    fs.writeFileSync(FILE, JSON.stringify(seed, null, 2));
  }
  const text = fs.readFileSync(FILE, "utf-8");
  return JSON.parse(text);
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

const db = {
  data: load(),
  // Garante que os arrays/counters existam (caso o arquivo tenha sido editado manualmente)
  ensure() {
    const d = db.data;
    d.usuario ||= [];
    d.estufa ||= [];
    d.sensor ||= [];
    d.leitura_sensor ||= [];
    d.counters ||= { usuario: 0, estufa: 0, sensor: 0, leitura_sensor: 0 };
  },
  // Gera IDs incrementais por coleção
  nextId(collection) {
    db.ensure();
    db.data.counters[collection] = (db.data.counters[collection] || 0) + 1;
    return db.data.counters[collection];
  },
  write() {
    db.ensure();
    save(db.data);
  },
};

module.exports = db;
