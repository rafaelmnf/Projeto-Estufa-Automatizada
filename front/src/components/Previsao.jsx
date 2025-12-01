import { useEffect, useState } from "react";
import api from "../api";

export default function Previsao() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [previsao, setPrevisao] = useState(null);
  const [mostrar, setMostrar] = useState(false);

  async function carregarPrevisao() {
    setLoading(true);
    setErro("");
    try {
      const { data } = await api.get("/previsao");
      setPrevisao(data);
    } catch (err) {
      setErro(err?.response?.data?.erro || err?.response?.data?.mensagem || "Erro ao carregar previsão");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (mostrar) {
      carregarPrevisao();
      const interval = setInterval(carregarPrevisao, 60000); // Atualiza a cada minuto
      return () => clearInterval(interval);
    }
  }, [mostrar]);

  if (!mostrar) {
    return (
      <button
        className="btn"
        onClick={() => setMostrar(true)}
        style={{ width: "100%", marginBottom: 16, background: "#3b82f6", color: "white" }}
      >
        🔮 Ver Previsão de Condições
      </button>
    );
  }

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
        <h3>🔮 Previsão de Condições</h3>
        <button
          onClick={() => setMostrar(false)}
          style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 20 }}
        >
          ✕
        </button>
      </div>

      {loading && <p className="muted">Analisando dados históricos...</p>}

      {erro && (
        <div
          style={{
            padding: 12,
            background: "#fef2f2",
            borderRadius: 8,
            color: "#ef4444",
            marginBottom: 12,
          }}
        >
          {erro}
        </div>
      )}

      {!loading && previsao && (
        <>
          <p className="muted" style={{ marginBottom: 16 }}>
            Análise baseada em {previsao.baseadoEm?.totalRegistros} registros
          </p>

          {/* Previsões */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Temperatura */}
            <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8 }}>
              <h4 style={{ marginBottom: 8, fontSize: 14 }}>🌡️ Temperatura</h4>
              <div style={{ marginBottom: 4 }}>
                <span className="muted" style={{ fontSize: 12 }}>Atual: </span>
                <strong>{previsao.previsao.temperatura.atual}°C</strong>
              </div>
              <div style={{ marginBottom: 4 }}>
                <span className="muted" style={{ fontSize: 12 }}>Prevista: </span>
                <strong style={{ color: getCorPrevisao(previsao.previsao.temperatura.prevista, 10, 34) }}>
                  {previsao.previsao.temperatura.prevista}°C
                </strong>
              </div>
              <div style={{ marginBottom: 4 }}>
                <span className="muted" style={{ fontSize: 12 }}>Tendência: </span>
                <span className="pill" style={{ 
                  borderColor: getCorTendencia(previsao.previsao.temperatura.tendencia),
                  color: getCorTendencia(previsao.previsao.temperatura.tendencia),
                  fontSize: 11
                }}>
                  {getTendenciaIcone(previsao.previsao.temperatura.tendencia)} {previsao.previsao.temperatura.tendencia}
                </span>
              </div>
            </div>

            {/* Umidade */}
            <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8 }}>
              <h4 style={{ marginBottom: 8, fontSize: 14 }}>💧 Umidade</h4>
              <div style={{ marginBottom: 4 }}>
                <span className="muted" style={{ fontSize: 12 }}>Atual: </span>
                <strong>{previsao.previsao.umidade.atual}%</strong>
              </div>
              <div style={{ marginBottom: 4 }}>
                <span className="muted" style={{ fontSize: 12 }}>Prevista: </span>
                <strong style={{ color: getCorPrevisao(previsao.previsao.umidade.prevista, 40, 85) }}>
                  {previsao.previsao.umidade.prevista}%
                </strong>
              </div>
              <div style={{ marginBottom: 4 }}>
                <span className="muted" style={{ fontSize: 12 }}>Tendência: </span>
                <span className="pill" style={{ 
                  borderColor: getCorTendencia(previsao.previsao.umidade.tendencia),
                  color: getCorTendencia(previsao.previsao.umidade.tendencia),
                  fontSize: 11
                }}>
                  {getTendenciaIcone(previsao.previsao.umidade.tendencia)} {previsao.previsao.umidade.tendencia}
                </span>
              </div>
            </div>
          </div>

          {/* Recomendações */}
          {previsao.recomendacoes && previsao.recomendacoes.length > 0 && (
            <div>
              <h4 style={{ marginBottom: 12, fontSize: 14 }}>📋 Recomendações Preventivas</h4>
              {previsao.recomendacoes.map((rec, index) => (
                <div
                  key={index}
                  style={{
                    padding: 12,
                    marginBottom: 8,
                    background: getCorRecomendacao(rec.tipo).bg,
                    borderLeft: `4px solid ${getCorRecomendacao(rec.tipo).border}`,
                    borderRadius: 4,
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: 4, color: getCorRecomendacao(rec.tipo).text }}>
                    {getIconeRecomendacao(rec.tipo)} {rec.mensagem}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>
                    💡 {rec.acao}
                  </div>
                </div>
              ))}
            </div>
          )}

          {previsao.recomendacoes && previsao.recomendacoes.length === 0 && (
            <div
              style={{
                padding: 12,
                background: "#f0fdf4",
                borderRadius: 8,
                color: "#16a34a",
                textAlign: "center",
              }}
            >
              ✅ Condições previstas dentro dos parâmetros ideais
            </div>
          )}

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button
              className="btn"
              onClick={carregarPrevisao}
              disabled={loading}
              style={{ fontSize: 14, padding: "8px 16px" }}
            >
              🔄 Atualizar Previsão
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function getCorPrevisao(valor, min, max) {
  if (valor < min || valor > max) return "#ef4444";
  if (valor < min + 5 || valor > max - 5) return "#f59e0b";
  return "#16a34a";
}

function getCorTendencia(tendencia) {
  if (tendencia === "crescente") return "#f59e0b";
  if (tendencia === "decrescente") return "#3b82f6";
  return "#64748b";
}

function getTendenciaIcone(tendencia) {
  if (tendencia === "crescente") return "↗️";
  if (tendencia === "decrescente") return "↘️";
  return "→";
}

function getCorRecomendacao(tipo) {
  if (tipo === "crítico") {
    return { bg: "#fef2f2", border: "#ef4444", text: "#ef4444" };
  }
  if (tipo === "alerta") {
    return { bg: "#fef9f5", border: "#f59e0b", text: "#f59e0b" };
  }
  return { bg: "#f0f9ff", border: "#3b82f6", text: "#3b82f6" };
}

function getIconeRecomendacao(tipo) {
  if (tipo === "crítico") return "🚨";
  if (tipo === "alerta") return "⚠️";
  return "ℹ️";
}
