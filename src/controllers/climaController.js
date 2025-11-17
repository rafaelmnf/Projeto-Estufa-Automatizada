const axios = require('axios');
const Clima = require('../models/clima'); 
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const LAT = -23.5505;  // São Paulo
const LON = -46.6333;

exports.coletarEGravar = async () => {
  if (!API_KEY) {
    return console.error('❌ API_KEY não definida. Verifique o .env');
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;
    const resposta = await axios.get(url);

    const temperatura = resposta.data.main.temp;
    const umidade = resposta.data.main.humidity;
    const lux = estimarLux(resposta.data);

    if (temperatura < 10 || temperatura > 34) {
      Clima.salvarAlerta({
        tipo: 'temperatura',
        dados: temperatura
        },(err) => {
        if (err) return console.error('❌ Erro ao salvar no banco:', err);
      });
    }

    if (umidade < 40 || umidade > 85) {
      Clima.salvarAlerta({
        tipo: 'umidade',
        dados: umidade
        },(err) => {
        if (err) return console.error('❌ Erro ao salvar no banco:', err);
      });
    }
    Clima.salvar({ temperatura, umidade, lux }, (err) => {
      if (err) return console.error('❌ Erro ao salvar no banco:', err);
      console.log(`✅ Dados salvos: ${temperatura}°C | ${umidade}% | 💡 ${lux.toFixed(0)} lux`);
    });

  } catch (erro) {
    if (erro.response) {
      console.error(`❌ Erro na API OpenWeather: ${erro.response.status} - ${erro.response.data.message}`);
    } else {
      console.error('❌ Erro ao coletar dados:', erro.message);
    }
  }

  // --- Cálculo de Lux ---
  function estimarLux(data) {
    const agora = data.dt;
    const nascer = data.sys.sunrise;
    const por = data.sys.sunset;
    const nuvens = data.clouds.all;

    // Noite profunda
    if (agora < nascer || agora > por) {
      return 1; // 0~1 lux
    }

    // Calcula posição relativa do Sol no céu (0 = nascer, 1 = meio-dia, 0 = pôr)
    const meioDia = (nascer + por) / 2;
    const duracaoDia = por - nascer;
    const progresso = Math.abs((agora - meioDia) / (duracaoDia / 2)); // 0 = meio-dia, 1 = bordas
    const fatorSolar = 1 - progresso; // mais próximo do meio-dia = mais luz

    // Base de lux para céu limpo ao meio-dia (~100.000 lux)
    let luxBase = 100000 * fatorSolar;

    // Ajuste por nuvens (reduz luminosidade proporcionalmente)
    const reducaoNuvens = (100 - nuvens) / 100; // 100% nuvens = 0.0; 0% nuvens = 1.0
    luxBase *= reducaoNuvens;

    // Adiciona uma leve variação aleatória para simular flutuação natural
    const variacao = (Math.random() * 0.1) + 0.95; // entre 0.95 e 1.05
    luxBase *= variacao;

    // Garante limite mínimo durante o dia
    return Math.max(luxBase, 10);
  }
};
