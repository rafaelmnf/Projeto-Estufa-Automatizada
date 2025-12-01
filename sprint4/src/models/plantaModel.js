const db = require('../config/db');

const Planta = {
  // Criar nova planta
  criar: (dados, callback) => {
    const sql = `
      INSERT INTO plantas (nome, tipo, temp_min, temp_max, umidade_min, umidade_max, 
                          luz_min, luz_max, altura_esperada, data_plantio, observacoes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      dados.nome, dados.tipo, dados.temp_min, dados.temp_max,
      dados.umidade_min, dados.umidade_max, dados.luz_min, dados.luz_max,
      dados.altura_esperada, dados.data_plantio, dados.observacoes
    ], callback);
  },

  // Listar todas as plantas
  listarTodas: (callback) => {
    const sql = 'SELECT * FROM plantas ORDER BY created_at DESC';
    db.query(sql, callback);
  },

  // Buscar planta por ID
  buscarPorId: (id, callback) => {
    const sql = 'SELECT * FROM plantas WHERE id_planta = ?';
    db.query(sql, [id], callback);
  },

  // Buscar plantas por filtros
  buscarComFiltros: (filtros, callback) => {
    let sql = 'SELECT * FROM plantas WHERE 1=1';
    const params = [];

    if (filtros.nome) {
      sql += ' AND nome LIKE ?';
      params.push(`%${filtros.nome}%`);
    }

    if (filtros.tipo) {
      sql += ' AND tipo LIKE ?';
      params.push(`%${filtros.tipo}%`);
    }

    if (filtros.temp_min !== undefined) {
      sql += ' AND temp_min <= ?';
      params.push(filtros.temp_min);
    }

    if (filtros.temp_max !== undefined) {
      sql += ' AND temp_max >= ?';
      params.push(filtros.temp_max);
    }

    if (filtros.umidade_min !== undefined) {
      sql += ' AND umidade_min <= ?';
      params.push(filtros.umidade_min);
    }

    if (filtros.umidade_max !== undefined) {
      sql += ' AND umidade_max >= ?';
      params.push(filtros.umidade_max);
    }

    sql += ' ORDER BY created_at DESC';
    db.query(sql, params, callback);
  },

  // Buscar plantas compatíveis com condições atuais
  buscarCompativeis: (temperatura, umidade, luz, callback) => {
    const sql = `
      SELECT *, 
        CASE 
          WHEN ? BETWEEN temp_min AND temp_max 
           AND ? BETWEEN umidade_min AND umidade_max 
           AND (luz_min IS NULL OR ? >= luz_min) 
           AND (luz_max IS NULL OR ? <= luz_max)
          THEN 'ideal'
          WHEN (? >= temp_min - 5 AND ? <= temp_max + 5)
           AND (? >= umidade_min - 10 AND ? <= umidade_max + 10)
          THEN 'toleravel'
          ELSE 'incompativel'
        END as compatibilidade
      FROM plantas
      ORDER BY 
        CASE compatibilidade
          WHEN 'ideal' THEN 1
          WHEN 'toleravel' THEN 2
          ELSE 3
        END,
        created_at DESC
    `;
    db.query(sql, [
      temperatura, umidade, luz, luz,
      temperatura, temperatura, umidade, umidade
    ], callback);
  },

  // Atualizar planta
  atualizar: (id, dados, callback) => {
    const sql = `
      UPDATE plantas 
      SET nome = ?, tipo = ?, temp_min = ?, temp_max = ?, 
          umidade_min = ?, umidade_max = ?, luz_min = ?, luz_max = ?,
          altura_esperada = ?, data_plantio = ?, observacoes = ?
      WHERE id_planta = ?
    `;
    db.query(sql, [
      dados.nome, dados.tipo, dados.temp_min, dados.temp_max,
      dados.umidade_min, dados.umidade_max, dados.luz_min, dados.luz_max,
      dados.altura_esperada, dados.data_plantio, dados.observacoes, id
    ], callback);
  },

  // Deletar planta
  deletar: (id, callback) => {
    const sql = 'DELETE FROM plantas WHERE id_planta = ?';
    db.query(sql, [id], callback);
  },

  // Buscar tipos únicos
  listarTipos: (callback) => {
    const sql = 'SELECT DISTINCT tipo FROM plantas WHERE tipo IS NOT NULL ORDER BY tipo';
    db.query(sql, callback);
  }
};

module.exports = Planta;
