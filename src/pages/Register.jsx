import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await api.post("/cadastro", { email, senha });
      const data = res.data;

      // Considere sucesso por status 2xx (principalmente 200/201)
      const is2xx = res.status >= 200 && res.status < 300;

      // E também por payloads alternativos do backend
      const hasSucessoFlag = data?.sucesso === true;
      const hasMensagem =
        typeof data?.mensagem === "string" || typeof data?.message === "string";
      const isEmptyBody =
        data == null ||
        (typeof data === "object" && Object.keys(data).length === 0);

      if (is2xx && (hasSucessoFlag || hasMensagem || isEmptyBody)) {
        setMsg("Cadastro realizado. Faça login.");
        setTimeout(() => nav("/login"), 800);
        return;
      }

      // Se chegou aqui, tratamos como erro “semânticamente” não-sucedido
      setError(
        data?.erro ||
          data?.mensagem ||
          data?.message ||
          "Não foi possível cadastrar."
      );
    } catch (err) {
      // Erros comuns (ex.: 409 e-mail já cadastrado)
      const r = err?.response;
      if (r?.status === 409) {
        setError(r.data?.erro || "E-mail já cadastrado.");
      } else {
        setError(
          r?.data?.erro ||
            r?.data?.mensagem ||
            r?.data?.message ||
            "Erro no cadastro."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container center">
      <form className="card" style={{ minWidth: 360 }} onSubmit={onSubmit}>
        <h2>Cadastrar</h2>
        <p className="muted">Crie sua conta para acessar a estufa.</p>
        <div style={{ height: 8 }} />
        <input
          className="input"
          type="email"
          placeholder="email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div style={{ height: 8 }} />
        <input
          className="input"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <div style={{ height: 12 }} />
        <button className="btn primary" disabled={loading}>
          {loading ? "Enviando..." : "Cadastrar"}
        </button>
        {msg && <p style={{ color: "#16a34a" }}>{msg}</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}
        <div style={{ height: 8 }} />
        <p className="muted">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
