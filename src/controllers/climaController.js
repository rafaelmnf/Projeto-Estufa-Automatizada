const axios = require('axios');
const Clima = require('../models/clima'); // Seu model para salvar no banco
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const LAT = -23.5505;  // São Paulo
const LON = -46.6333;

exports.coletarEGravar = async () => {
  // Verifica se a chave está definida
  if (!API_KEY) {
    return console.error('❌ API_KEY não definida. Verifique o .env');
  }

  try {
    // Endpoint gratuito
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;

    // Faz a requisição
    const resposta = await axios.get(url);

    // Extrai temperatura e umidade
    const temperatura = resposta.data.main.temp;
    const umidade = resposta.data.main.humidity;

    // Salva no banco
    Clima.salvar({ temperatura, umidade }, (err) => {
      if (err) return console.error('❌ Erro ao salvar no banco:', err);
      console.log(`✅ Dados salvos: ${temperatura}°C | ${umidade}%`);
    });

  } catch (erro) {
    // Tratamento de erro detalhado
    if (erro.response) {
      console.error(`❌ Erro na API OpenWeather: ${erro.response.status} - ${erro.response.data.message}`);
    } else {
      console.error('❌ Erro ao coletar dados:', erro.message);
    }
  }
};
