const Estufa = require('../models/estufaModel');

exports.getTemperatura = (req, res) => {
    Estufa.getTemperatura((err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar temperatura' });
        res.json(results);
    });
};

exports.getAllTemp = (req, res) =>{
    Estufa.getAllTemp((err, results) =>{
        if (err) return res.status(500).json({ erro: 'Erro ao buscar temperatura' });
        res.json(results);
    });
};

exports.getUmidade = (req, res) => {
    Estufa.getUmidade((err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar umidade' });
        res.json(results);
    });
};

exports.getLuminosidade = (req, res) => {
    Estufa.getLuminosidade((err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar luminosidade' });
        res.json(results);
    });
};

exports.getAltura = (req, res) => {
    const id_usuario = req.userId;
    Estufa.getAltura(id_usuario, (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar altura' });
        res.json(results);
    });
};

exports.alertaTemperatura = (req, res) => {
    Clima.alertaTemperatura((err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar temperatura' });
        res.json(results);
  });
};

exports.alertaUmidade = (req, res) => {
    Clima.alertaUmidade((err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar temperatura' });
        res.json(results);
  });
};
