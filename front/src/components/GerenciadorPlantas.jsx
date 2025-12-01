import { useEffect, useState } from "react";
import api from "../api";

export default function GerenciadorPlantas() {
  const [mostrar, setMostrar] = useState(false);
  const [aba, setAba] = useState("pesquisar"); // pesquisar, cadastrar, compativeis
  const [plantas, setPlantas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Filtros de pesquisa
  const [filtros, setFiltros] = useState({
    nome: "",
    tipo: "",
    temp_min: "",
    temp_max: "",
    umidade_min: "",
    umidade_max: ""
  });

  // Dados do formulário
  const [novaPlanta, setNovaPlanta] = useState({
    nome: "",
    tipo: "",
    temp_min: "",
    temp_max: "",
    umidade_min: "",
    umidade_max: "",
    luz_min: "",
    luz_max: "",
    altura_esperada: "",
    data_plantio: "",
    observacoes: ""
  });

  useEffect(() => {
    if (mostrar && aba === "pesquisar") {
      carregarPlantas();
    }
  }, [mostrar, aba]);

  const carregarPlantas = async () => {
    setLoading(true);
    setErro("");
    try {
      const { data } = await api.get("/plantas");
      setPlantas(data);
    } catch (err) {
      setErro("Erro ao carregar plantas");
    } finally {
      setLoading(false);
    }
  };

  const pesquisarPlantas = async () => {
    setLoading(true);
    setErro("");
    try {
      const params = new URLSearchParams();
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) params.append(key, filtros[key]);
      });
      
      const { data } = await api.get(`/plantas/pesquisar?${params.toString()}`);
      setPlantas(data.plantas);
      setSucesso(`${data.total} planta(s) encontrada(s)`);
      setTimeout(() => setSucesso(""), 3000);
    } catch (err) {
      setErro("Erro ao pesquisar plantas");
    } finally {
      setLoading(false);
    }
  };

  const buscarCompativeis = async () => {
    setLoading(true);
    setErro("");
    try {
      const { data } = await api.get("/plantas/compativeis");
      setPlantas(data.plantas);
      setSucesso(`Condições atuais: ${data.condicoesAtuais.temperatura}°C, ${data.condicoesAtuais.umidade}%`);
    } catch (err) {
      setErro("Erro ao buscar plantas compatíveis");
    } finally {
      setLoading(false);
    }
  };

  const cadastrarPlanta = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setSucesso("");

    try {
      await api.post("/plantas", novaPlanta);
      setSucesso("✅ Planta cadastrada com sucesso!");
      setNovaPlanta({
        nome: "", tipo: "", temp_min: "", temp_max: "",
        umidade_min: "", umidade_max: "", luz_min: "", luz_max: "",
        altura_esperada: "", data_plantio: "", observacoes: ""
      });
      setTimeout(() => setSucesso(""), 3000);
    } catch (err) {
      setErro(err?.response?.data?.erro || "Erro ao cadastrar planta");
    } finally {
      setLoading(false);
    }
  };

  const deletarPlanta = async (id) => {
    if (!confirm("Deseja realmente deletar esta planta?")) return;
    
    try {
      await api.delete(`/plantas/${id}`);
      setPlantas(plantas.filter(p => p.id_planta !== id));
      setSucesso("Planta deletada");
      setTimeout(() => setSucesso(""), 2000);
    } catch (err) {
      setErro("Erro ao deletar planta");
    }
  };

  if (!mostrar) {
    return (
      <button
        className="btn"
        onClick={() => setMostrar(true)}
        style={{ width: "100%", marginBottom: 16, background: "#16a34a", color: "white" }}
      >
        🌱 Gerenciar Plantas
      </button>
    );
  }

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <h3>🌱 Gerenciador de Plantas</h3>
        <button
          onClick={() => setMostrar(false)}
          style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 20 }}
        >
          ✕
        </button>
      </div>

      {/* Abas */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, borderBottom: "1px solid #e5e7eb" }}>
        <button
          onClick={() => setAba("pesquisar")}
          style={{
            padding: "8px 16px",
            background: aba === "pesquisar" ? "#16a34a" : "transparent",
            color: aba === "pesquisar" ? "white" : "#64748b",
            border: "none",
            borderBottom: aba === "pesquisar" ? "2px solid #16a34a" : "none",
            cursor: "pointer"
          }}
        >
          🔍 Pesquisar
        </button>
        <button
          onClick={() => setAba("cadastrar")}
          style={{
            padding: "8px 16px",
            background: aba === "cadastrar" ? "#16a34a" : "transparent",
            color: aba === "cadastrar" ? "white" : "#64748b",
            border: "none",
            borderBottom: aba === "cadastrar" ? "2px solid #16a34a" : "none",
            cursor: "pointer"
          }}
        >
          ➕ Cadastrar
        </button>
        <button
          onClick={() => { setAba("compativeis"); buscarCompativeis(); }}
          style={{
            padding: "8px 16px",
            background: aba === "compativeis" ? "#16a34a" : "transparent",
            color: aba === "compativeis" ? "white" : "#64748b",
            border: "none",
            borderBottom: aba === "compativeis" ? "2px solid #16a34a" : "none",
            cursor: "pointer"
          }}
        >
          ✨ Compatíveis
        </button>
      </div>

      {erro && <div style={{ padding: 12, background: "#fef2f2", color: "#ef4444", borderRadius: 8, marginBottom: 12 }}>{erro}</div>}
      {sucesso && <div style={{ padding: 12, background: "#f0fdf4", color: "#16a34a", borderRadius: 8, marginBottom: 12 }}>{sucesso}</div>}

      {/* ABA PESQUISAR */}
      {aba === "pesquisar" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <input
              placeholder="Nome da planta"
              value={filtros.nome}
              onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })}
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
            />
            <input
              placeholder="Tipo (ex: Tomate, Alface)"
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
            />
            <input
              type="number"
              placeholder="Temp. mínima"
              value={filtros.temp_min}
              onChange={(e) => setFiltros({ ...filtros, temp_min: e.target.value })}
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
            />
            <input
              type="number"
              placeholder="Temp. máxima"
              value={filtros.temp_max}
              onChange={(e) => setFiltros({ ...filtros, temp_max: e.target.value })}
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={pesquisarPlantas} disabled={loading} style={{ flex: 1 }}>
              {loading ? "Buscando..." : "🔍 Pesquisar"}
            </button>
            <button 
              onClick={() => { setFiltros({ nome: "", tipo: "", temp_min: "", temp_max: "", umidade_min: "", umidade_max: "" }); carregarPlantas(); }}
              style={{ padding: "8px 16px", background: "#64748b", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
            >
              🔄 Limpar
            </button>
          </div>

          {/* Lista de plantas */}
          <div style={{ marginTop: 16 }}>
            {loading && <p className="muted">Carregando...</p>}
            {!loading && plantas.length === 0 && <p className="muted">Nenhuma planta encontrada</p>}
            {plantas.map(planta => (
              <div key={planta.id_planta} style={{ padding: 12, background: "#f8fafc", borderRadius: 8, marginBottom: 8 }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div>
                    <strong>{planta.nome}</strong>
                    {planta.tipo && <span style={{ marginLeft: 8, color: "#64748b", fontSize: 14 }}>({planta.tipo})</span>}
                    {planta.statusCompatibilidade && (
                      <span 
                        className="pill" 
                        style={{ 
                          marginLeft: 8,
                          borderColor: planta.statusCompatibilidade === 'ideal' ? '#16a34a' : planta.statusCompatibilidade === 'toleravel' ? '#f59e0b' : '#ef4444',
                          color: planta.statusCompatibilidade === 'ideal' ? '#16a34a' : planta.statusCompatibilidade === 'toleravel' ? '#f59e0b' : '#ef4444',
                          fontSize: 11
                        }}
                      >
                        {planta.statusCompatibilidade}
                      </span>
                    )}
                  </div>
                  <button onClick={() => deletarPlanta(planta.id_planta)} style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>
                    🗑️
                  </button>
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                  Temp: {planta.temp_min}°C - {planta.temp_max}°C | 
                  Umidade: {planta.umidade_min}% - {planta.umidade_max}%
                  {planta.altura_esperada && ` | Altura: ${planta.altura_esperada}cm`}
                </div>
                {planta.observacoes && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{planta.observacoes}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ABA CADASTRAR */}
      {aba === "cadastrar" && (
        <form onSubmit={cadastrarPlanta}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>Nome *</label>
              <input
                required
                value={novaPlanta.nome}
                onChange={(e) => setNovaPlanta({ ...novaPlanta, nome: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>Tipo</label>
              <input
                value={novaPlanta.tipo}
                onChange={(e) => setNovaPlanta({ ...novaPlanta, tipo: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>Temp. Mín (°C)</label>
              <input
                type="number"
                step="0.1"
                value={novaPlanta.temp_min}
                onChange={(e) => setNovaPlanta({ ...novaPlanta, temp_min: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>Temp. Máx (°C)</label>
              <input
                type="number"
                step="0.1"
                value={novaPlanta.temp_max}
                onChange={(e) => setNovaPlanta({ ...novaPlanta, temp_max: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>Umidade Mín (%)</label>
              <input
                type="number"
                step="0.1"
                value={novaPlanta.umidade_min}
                onChange={(e) => setNovaPlanta({ ...novaPlanta, umidade_min: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>Umidade Máx (%)</label>
              <input
                type="number"
                step="0.1"
                value={novaPlanta.umidade_max}
                onChange={(e) => setNovaPlanta({ ...novaPlanta, umidade_max: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>Luz Mín (lx)</label>
              <input
                type="number"
                step="0.1"
                value={novaPlanta.luz_min}
                onChange={(e) => setNovaPlanta({ ...novaPlanta, luz_min: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>Luz Máx (lx)</label>
              <input
                type="number"
                step="0.1"
                value={novaPlanta.luz_max}
                onChange={(e) => setNovaPlanta({ ...novaPlanta, luz_max: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>Altura Esperada (cm)</label>
              <input
                type="number"
                step="0.1"
                value={novaPlanta.altura_esperada}
                onChange={(e) => setNovaPlanta({ ...novaPlanta, altura_esperada: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>Data de Plantio</label>
              <input
                type="date"
                value={novaPlanta.data_plantio}
                onChange={(e) => setNovaPlanta({ ...novaPlanta, data_plantio: e.target.value })}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 13, display: "block", marginBottom: 4 }}>Observações</label>
            <textarea
              value={novaPlanta.observacoes}
              onChange={(e) => setNovaPlanta({ ...novaPlanta, observacoes: e.target.value })}
              rows={3}
              style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
            />
          </div>
          <button type="submit" className="btn" disabled={loading} style={{ width: "100%", marginTop: 16 }}>
            {loading ? "Cadastrando..." : "💾 Cadastrar Planta"}
          </button>
        </form>
      )}

      {/* ABA COMPATÍVEIS */}
      {aba === "compativeis" && (
        <div>
          {loading && <p className="muted">Analisando compatibilidade...</p>}
          {!loading && plantas.length === 0 && <p className="muted">Nenhuma planta cadastrada</p>}
          {plantas.map(planta => (
            <div key={planta.id_planta} style={{ padding: 12, background: "#f8fafc", borderRadius: 8, marginBottom: 8 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <strong>{planta.nome}</strong>
                  {planta.tipo && <span style={{ marginLeft: 8, color: "#64748b", fontSize: 14 }}>({planta.tipo})</span>}
                  <span 
                    className="pill" 
                    style={{ 
                      marginLeft: 8,
                      borderColor: planta.compatibilidade === 'ideal' ? '#16a34a' : planta.compatibilidade === 'toleravel' ? '#f59e0b' : '#ef4444',
                      color: planta.compatibilidade === 'ideal' ? '#16a34a' : planta.compatibilidade === 'toleravel' ? '#f59e0b' : '#ef4444',
                      fontSize: 11
                    }}
                  >
                    {planta.compatibilidade === 'ideal' ? '✅ Ideal' : planta.compatibilidade === 'toleravel' ? '⚠️ Tolerável' : '❌ Incompatível'}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                Temp: {planta.temp_min}°C - {planta.temp_max}°C | 
                Umidade: {planta.umidade_min}% - {planta.umidade_max}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
