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

exports.getAllUmidade = (req, res) =>{
    Estufa.getAllUmidade((err, results) =>{
        if (err) return res.status(500).json({ erro: 'Erro ao buscar umidade' });
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
    Estufa.getAltura((err, results) => {
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

exports.getTodosDados = (req, res) => {
    // Primeiro busca temperatura
    Estufa.getAllTemp((err, tempData) => {
        if (err) return res.status(500).send(err);

        // Depois busca umidade
        Estufa.getAllUmidade((err2, umiData) => {
            if (err2) return res.status(500).send(err2);

            // Combina temperatura + umidade + data_hora
            const resultado = tempData.map((item, index) => ({
                temperatura: item.temperatura,
                umidade: umiData[index] ? umiData[index].umidade : null,
                data_hora: item.data_hora
            }));

            res.json(resultado);
        });
    });
}

// Inserir dados de clima manualmente
exports.inserirDadosClima = (req, res) => {
    const { temperatura, umidade, lux } = req.body;

    if (temperatura == null || umidade == null) {
        return res.status(400).json({ erro: 'Temperatura e umidade são obrigatórios' });
    }

    const dados = {
        temperatura: parseFloat(temperatura),
        umidade: parseFloat(umidade),
        lux: lux != null ? parseFloat(lux) : 0
    };

    Estufa.inserirDadosClima(dados, (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao inserir dados' });
        res.status(201).json({ mensagem: 'Dados inseridos com sucesso', id: result.insertId });
    });
};

// Inserir altura manualmente
exports.inserirAltura = (req, res) => {
    const { altura } = req.body;

    if (altura == null) {
        return res.status(400).json({ erro: 'Altura é obrigatória' });
    }

    Estufa.inserirAltura(parseFloat(altura), (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao inserir altura' });
        res.status(201).json({ mensagem: 'Altura inserida com sucesso', id: result.insertId });
    });
};
