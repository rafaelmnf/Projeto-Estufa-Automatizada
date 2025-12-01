import { useState } from "react";
import api from "../api";

export default function FormularioDados({ onSuccess }) {
  const [mostrar, setMostrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [dados, setDados] = useState({
    temperatura: "",
    umidade: "",
    lux: "",
    altura: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setSucesso("");

    try {
      // Insere dados de clima
      await api.post("/estufa/inserirDados", {
        temperatura: parseFloat(dados.temperatura),
        umidade: parseFloat(dados.umidade),
        lux: parseFloat(dados.lux) || 0,
      });

      // Insere altura se fornecida
      if (dados.altura) {
        await api.post("/estufa/inserirAltura", {
          altura: parseFloat(dados.altura),
        });
      }

      setSucesso("✅ Dados inseridos com sucesso!");
      setDados({ temperatura: "", umidade: "", lux: "", altura: "" });
      setTimeout(() => {
        setSucesso("");
        setMostrar(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setErro(err?.response?.data?.erro || "Erro ao inserir dados");
    } finally {
      setLoading(false);
    }
  };

  if (!mostrar) {
    return (
      <button
        className="btn"
        onClick={() => setMostrar(true)}
        style={{ width: "100%", marginBottom: 16 }}
      >
        ➕ Adicionar Dados Manualmente
      </button>
    );
  }

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
        <h3>Adicionar Dados Manualmente</h3>
        <button
          onClick={() => {
            setMostrar(false);
            setErro("");
            setSucesso("");
          }}
          style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 20 }}
        >
          ✕
        </button>
      </div>

      <p className="muted" style={{ marginBottom: 16 }}>
        Insira valores customizados para simular diferentes condições:
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>
              Temperatura (°C) *
            </label>
            <input
              type="number"
              step="0.1"
              value={dados.temperatura}
              onChange={(e) => setDados({ ...dados, temperatura: e.target.value })}
              required
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>
              Umidade (%) *
            </label>
            <input
              type="number"
              step="0.1"
              value={dados.umidade}
              onChange={(e) => setDados({ ...dados, umidade: e.target.value })}
              required
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>
              Luminosidade (lx)
            </label>
            <input
              type="number"
              step="0.1"
              value={dados.lux}
              onChange={(e) => setDados({ ...dados, lux: e.target.value })}
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>
              Altura (cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={dados.altura}
              onChange={(e) => setDados({ ...dados, altura: e.target.value })}
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>
        </div>

        {erro && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              background: "#fef2f2",
              borderRadius: 8,
              color: "#ef4444",
            }}
          >
            {erro}
          </div>
        )}

        {sucesso && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              background: "#f0fdf4",
              borderRadius: 8,
              color: "#16a34a",
            }}
          >
            {sucesso}
          </div>
        )}

        <button
          type="submit"
          className="btn"
          disabled={loading}
          style={{ width: "100%", marginTop: 16 }}
        >
          {loading ? "Salvando..." : "💾 Salvar Dados"}
        </button>
      </form>
    </div>
  );
}
