const axios = require('axios');
const Clima = require('../models/clima');
require('dotenv').config();

const API_KEY = process.env.API;
const LAT = -23.5505;  // São Paulo
const LON = -46.6333;

exports.coletarEGravar = async () => {
  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${LAT}&lon=${LON}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`;
    const resposta = await axios.get(url);

    const temperatura = resposta.data.current.temp;
    const umidade = resposta.data.current.humidity;

    Clima.salvar({ temperatura, umidade }, (err) => {
      if (err) return console.error('Erro ao salvar no banco:', err);
      console.log(`✅ Dados salvos: ${temperatura}°C | ${umidade}%`);
    });
  } catch (erro) {
    console.error('Erro ao coletar dados da OpenWeather:', erro.message);
  }
};
