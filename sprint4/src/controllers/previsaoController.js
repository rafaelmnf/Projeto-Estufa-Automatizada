const Estufa = require('../models/estufaModel');

// Calcula média móvel simples
function calcularMediaMovel(valores, periodo = 5) {
  if (valores.length < periodo) return null;
  const ultimos = valores.slice(-periodo);
  const soma = ultimos.reduce((acc, val) => acc + val, 0);
  return soma / periodo;
}

// Calcula tendência (crescente, decrescente ou estável)
function calcularTendencia(valores) {
  if (valores.length < 3) return 'estável';
  
  const recentes = valores.slice(-5);
  let crescente = 0;
  let decrescente = 0;
  
  for (let i = 1; i < recentes.length; i++) {
    if (recentes[i] > recentes[i - 1]) crescente++;
    else if (recentes[i] < recentes[i - 1]) decrescente++;
  }
  
  if (crescente > decrescente * 1.5) return 'crescente';
  if (decrescente > crescente * 1.5) return 'decrescente';
  return 'estável';
}

// Calcula taxa de variação média
function calcularTaxaVariacao(valores) {
  if (valores.length < 2) return 0;
  
  const recentes = valores.slice(-10);
  let somaVariacoes = 0;
  
  for (let i = 1; i < recentes.length; i++) {
    somaVariacoes += (recentes[i] - recentes[i - 1]);
  }
  
  return somaVariacoes / (recentes.length - 1);
}

// Prevê próximo valor
function preverProximoValor(valores, taxaVariacao, mediaMovel) {
  if (!mediaMovel) return null;
  
  // Combina média móvel com tendência
  const ultimoValor = valores[valores.length - 1];
  const previsao = ultimoValor + (taxaVariacao * 0.7) + ((mediaMovel - ultimoValor) * 0.3);
  
  return parseFloat(previsao.toFixed(2));
}

// Gera recomendações baseadas nas previsões
function gerarRecomendacoes(previsaoTemp, previsaoUmidade, tendenciaTemp, tendenciaUmidade) {
  const recomendacoes = [];
  
  // Temperatura
  if (previsaoTemp > 34) {
    recomendacoes.push({
      tipo: 'crítico',
      sensor: 'temperatura',
      mensagem: `Temperatura prevista para ${previsaoTemp}°C - RISCO DE SUPERAQUECIMENTO`,
      acao: 'Ative sistema de resfriamento e ventilação imediatamente'
    });
  } else if (previsaoTemp > 30) {
    recomendacoes.push({
      tipo: 'alerta',
      sensor: 'temperatura',
      mensagem: `Temperatura prevista para ${previsaoTemp}°C - Acima do ideal`,
      acao: 'Prepare sistema de ventilação preventivamente'
    });
  } else if (previsaoTemp < 10) {
    recomendacoes.push({
      tipo: 'crítico',
      sensor: 'temperatura',
      mensagem: `Temperatura prevista para ${previsaoTemp}°C - RISCO DE CONGELAMENTO`,
      acao: 'Ative aquecimento imediatamente'
    });
  } else if (previsaoTemp < 15) {
    recomendacoes.push({
      tipo: 'alerta',
      sensor: 'temperatura',
      mensagem: `Temperatura prevista para ${previsaoTemp}°C - Muito baixa`,
      acao: 'Prepare sistema de aquecimento'
    });
  }
  
  // Umidade
  if (previsaoUmidade > 85) {
    recomendacoes.push({
      tipo: 'crítico',
      sensor: 'umidade',
      mensagem: `Umidade prevista para ${previsaoUmidade}% - RISCO DE FUNGOS`,
      acao: 'Ative desumidificador e melhore ventilação'
    });
  } else if (previsaoUmidade > 70) {
    recomendacoes.push({
      tipo: 'alerta',
      sensor: 'umidade',
      mensagem: `Umidade prevista para ${previsaoUmidade}% - Elevada`,
      acao: 'Monitore e prepare desumidificação se necessário'
    });
  } else if (previsaoUmidade < 40) {
    recomendacoes.push({
      tipo: 'crítico',
      sensor: 'umidade',
      mensagem: `Umidade prevista para ${previsaoUmidade}% - RISCO DE RESSECAMENTO`,
      acao: 'Ative irrigação ou nebulização'
    });
  } else if (previsaoUmidade < 50) {
    recomendacoes.push({
      tipo: 'alerta',
      sensor: 'umidade',
      mensagem: `Umidade prevista para ${previsaoUmidade}% - Baixa`,
      acao: 'Prepare sistema de irrigação preventivamente'
    });
  }
  
  // Tendências preocupantes
  if (tendenciaTemp === 'crescente' && previsaoTemp > 25) {
    recomendacoes.push({
      tipo: 'info',
      sensor: 'temperatura',
      mensagem: 'Tendência de aquecimento contínuo detectada',
      acao: 'Monitore e esteja preparado para intervenção'
    });
  }
  
  if (tendenciaTemp === 'decrescente' && previsaoTemp < 20) {
    recomendacoes.push({
      tipo: 'info',
      sensor: 'temperatura',
      mensagem: 'Tendência de resfriamento contínuo detectada',
      acao: 'Monitore e esteja preparado para aquecimento'
    });
  }
  
  if (tendenciaUmidade === 'decrescente' && previsaoUmidade < 60) {
    recomendacoes.push({
      tipo: 'info',
      sensor: 'umidade',
      mensagem: 'Tendência de ressecamento detectada',
      acao: 'Considere aumentar irrigação gradualmente'
    });
  }
  
  return recomendacoes;
}

exports.obterPrevisao = (req, res) => {
  // Busca histórico de temperatura
  Estufa.getAllTemp((errTemp, tempData) => {
    if (errTemp) return res.status(500).json({ erro: 'Erro ao buscar dados de temperatura' });
    
    // Busca histórico de umidade
    Estufa.getAllUmidade((errUmi, umiData) => {
      if (errUmi) return res.status(500).json({ erro: 'Erro ao buscar dados de umidade' });
      
      if (!tempData || tempData.length < 3 || !umiData || umiData.length < 3) {
        return res.status(400).json({ 
          erro: 'Dados insuficientes para previsão',
          mensagem: 'São necessários pelo menos 3 registros históricos' 
        });
      }
      
      // Extrai valores
      const temperaturas = tempData.map(d => parseFloat(d.temperatura));
      const umidades = umiData.map(d => parseFloat(d.umidade));
      
      // Calcula estatísticas para temperatura
      const mediaTempMovel = calcularMediaMovel(temperaturas, 5);
      const tendenciaTemp = calcularTendencia(temperaturas);
      const taxaVariacaoTemp = calcularTaxaVariacao(temperaturas);
      const previsaoTemp = preverProximoValor(temperaturas, taxaVariacaoTemp, mediaTempMovel);
      
      // Calcula estatísticas para umidade
      const mediaUmiMovel = calcularMediaMovel(umidades, 5);
      const tendenciaUmi = calcularTendencia(umidades);
      const taxaVariacaoUmi = calcularTaxaVariacao(umidades);
      const previsaoUmi = preverProximoValor(umidades, taxaVariacaoUmi, mediaUmiMovel);
      
      // Gera recomendações
      const recomendacoes = gerarRecomendacoes(previsaoTemp, previsaoUmi, tendenciaTemp, tendenciaUmi);
      
      // Monta resposta
      res.json({
        previsao: {
          temperatura: {
            atual: temperaturas[temperaturas.length - 1],
            prevista: previsaoTemp,
            tendencia: tendenciaTemp,
            mediaMovel: mediaTempMovel ? parseFloat(mediaTempMovel.toFixed(2)) : null,
            taxaVariacao: parseFloat(taxaVariacaoTemp.toFixed(2))
          },
          umidade: {
            atual: umidades[umidades.length - 1],
            prevista: previsaoUmi,
            tendencia: tendenciaUmi,
            mediaMovel: mediaUmiMovel ? parseFloat(mediaUmiMovel.toFixed(2)) : null,
            taxaVariacao: parseFloat(taxaVariacaoUmi.toFixed(2))
          }
        },
        recomendacoes,
        geradoEm: new Date().toISOString(),
        baseadoEm: {
          totalRegistros: tempData.length,
          periodoAnalise: '10 últimas leituras'
        }
      });
    });
  });
};
