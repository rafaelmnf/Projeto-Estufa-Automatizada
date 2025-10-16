/* const db = require('../config/db');

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
 */

// src/models/estufaModel.js
const db = require("../config/db");

function ultimaLeituraPorTipo(id_usuario, tipo) {
  db.ensure();

  // 1) Estufas do usuário
  const estufas = db.data.estufa.filter((e) => e.id_usuario === id_usuario);
  if (estufas.length === 0) return null;

  // 2) Sensores das estufas desse usuário e do tipo solicitado
  const estufaIds = new Set(estufas.map((e) => e.id_estufa));
  const sensores = db.data.sensor.filter(
    (s) => estufaIds.has(s.id_estufa) && s.tipo === tipo
  );
  if (sensores.length === 0) return null;

  const sensorIds = new Set(sensores.map((s) => s.id_sensor));

  // 3) Todas as leituras desses sensores; pega a mais recente
  const leituras = db.data.leitura_sensor
    .filter((l) => sensorIds.has(l.id_sensor))
    .sort((a, b) => {
      // Ordena por data_hora (ISO) e depois por id_leitura como critério de desempate
      const t = String(a.data_hora || "").localeCompare(
        String(b.data_hora || "")
      );
      return t !== 0 ? -t : b.id_leitura - a.id_leitura;
    });

  const last = leituras[0];
  if (!last) return null;

  // 4) Monta o objeto com alias conforme seus endpoints
  const out = { data_hora: last.data_hora };
  if (tipo === "temperatura") out.temperatura = Number(last.valor);
  else if (tipo === "umidade") out.umidade = Number(last.valor);
  else if (tipo === "luminosidade") out.luminosidade = Number(last.valor);
  else if (tipo === "ultrassonico") out.altura = Number(last.valor);

  return out;
}

// Helpers úteis para semear dados (opcionais, caso queira usar no controller de cadastro)
function criarEstufaParaUsuario(id_usuario, nome = "Minha Estufa") {
  db.ensure();
  const id_estufa = db.nextId("estufa");
  const row = {
    id_estufa,
    id_usuario,
    nome,
    created_at: new Date().toISOString(),
  };
  db.data.estufa.push(row);
  db.write();
  return id_estufa;
}

function adicionarSensor(id_estufa, tipo) {
  db.ensure();
  const id_sensor = db.nextId("sensor");
  const row = {
    id_sensor,
    id_estufa,
    tipo,
    created_at: new Date().toISOString(),
  };
  db.data.sensor.push(row);
  db.write();
  return id_sensor;
}

function adicionarLeitura(
  id_sensor,
  valor,
  data_hora = new Date().toISOString()
) {
  db.ensure();
  const id_leitura = db.nextId("leitura_sensor");
  const row = { id_leitura, id_sensor, valor: Number(valor), data_hora };
  db.data.leitura_sensor.push(row);
  db.write();
  return id_leitura;
}

const Estufa = {
  // **Assinaturas compatíveis com o controller atual**:
  // getTemperatura(id_usuario, callback), etc. → callback(err, rowsArrayComUmObjeto)
  getTemperatura(id_usuario, callback) {
    try {
      const row = ultimaLeituraPorTipo(id_usuario, "temperatura");
      return callback(null, row ? [row] : []);
    } catch (e) {
      return callback(e);
    }
  },

  getUmidade(id_usuario, callback) {
    try {
      const row = ultimaLeituraPorTipo(id_usuario, "umidade");
      return callback(null, row ? [row] : []);
    } catch (e) {
      return callback(e);
    }
  },

  getLuminosidade(id_usuario, callback) {
    try {
      const row = ultimaLeituraPorTipo(id_usuario, "luminosidade");
      return callback(null, row ? [row] : []);
    } catch (e) {
      return callback(e);
    }
  },

  getAltura(id_usuario, callback) {
    try {
      const row = ultimaLeituraPorTipo(id_usuario, "ultrassonico");
      return callback(null, row ? [row] : []);
    } catch (e) {
      return callback(e);
    }
  },

  // **Extras opcionais** (podem ser usados pelo seu controller de cadastro/semente):
  criarEstufaParaUsuario,
  adicionarSensor,
  adicionarLeitura,
};

module.exports = Estufa;
