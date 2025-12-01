const Planta = require('../models/plantaModel');
const Estufa = require('../models/estufaModel');

// Criar nova planta
exports.criarPlanta = (req, res) => {
  const dados = req.body;
  
  if (!dados.nome) {
    return res.status(400).json({ erro: 'Nome da planta é obrigatório' });
  }

  Planta.criar(dados, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao criar planta' });
    }
    res.status(201).json({ 
      mensagem: 'Planta cadastrada com sucesso', 
      id: result.insertId 
    });
  });
};

// Listar todas as plantas
exports.listarPlantas = (req, res) => {
  Planta.listarTodas((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar plantas' });
    }
    res.json(results);
  });
};

// Buscar planta por ID
exports.buscarPlantaPorId = (req, res) => {
  const { id } = req.params;
  
  Planta.buscarPorId(id, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar planta' });
    }
    if (results.length === 0) {
      return res.status(404).json({ erro: 'Planta não encontrada' });
    }
    res.json(results[0]);
  });
};

// Pesquisar plantas com filtros
exports.pesquisarPlantas = (req, res) => {
  const filtros = {};
  
  if (req.query.nome) filtros.nome = req.query.nome;
  if (req.query.tipo) filtros.tipo = req.query.tipo;
  if (req.query.temp_min) filtros.temp_min = parseFloat(req.query.temp_min);
  if (req.query.temp_max) filtros.temp_max = parseFloat(req.query.temp_max);
  if (req.query.umidade_min) filtros.umidade_min = parseFloat(req.query.umidade_min);
  if (req.query.umidade_max) filtros.umidade_max = parseFloat(req.query.umidade_max);

  Planta.buscarComFiltros(filtros, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao pesquisar plantas' });
    }
    res.json({
      total: results.length,
      filtros: filtros,
      plantas: results
    });
  });
};

// Buscar plantas compatíveis com condições atuais da estufa
exports.buscarCompativeis = (req, res) => {
  // Busca condições atuais
  Estufa.getTemperatura((errTemp, tempData) => {
    if (errTemp) {
      return res.status(500).json({ erro: 'Erro ao buscar temperatura' });
    }

    Estufa.getUmidade((errUmi, umiData) => {
      if (errUmi) {
        return res.status(500).json({ erro: 'Erro ao buscar umidade' });
      }

      Estufa.getLuminosidade((errLux, luxData) => {
        if (errLux) {
          return res.status(500).json({ erro: 'Erro ao buscar luminosidade' });
        }

        const temperatura = tempData[0]?.temperatura || 25;
        const umidade = umiData[0]?.umidade || 60;
        const luz = luxData[0]?.lux || 1000;

        Planta.buscarCompativeis(temperatura, umidade, luz, (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ erro: 'Erro ao buscar plantas compatíveis' });
          }

          res.json({
            condicoesAtuais: {
              temperatura,
              umidade,
              luminosidade: luz
            },
            plantas: results.map(p => ({
              ...p,
              statusCompatibilidade: p.compatibilidade
            }))
          });
        });
      });
    });
  });
};

// Atualizar planta
exports.atualizarPlanta = (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  if (!dados.nome) {
    return res.status(400).json({ erro: 'Nome da planta é obrigatório' });
  }

  Planta.atualizar(id, dados, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao atualizar planta' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Planta não encontrada' });
    }
    res.json({ mensagem: 'Planta atualizada com sucesso' });
  });
};

// Deletar planta
exports.deletarPlanta = (req, res) => {
  const { id } = req.params;

  Planta.deletar(id, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao deletar planta' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Planta não encontrada' });
    }
    res.json({ mensagem: 'Planta deletada com sucesso' });
  });
};

// Listar tipos de plantas
exports.listarTipos = (req, res) => {
  Planta.listarTipos((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar tipos' });
    }
    res.json(results.map(r => r.tipo));
  });
};
