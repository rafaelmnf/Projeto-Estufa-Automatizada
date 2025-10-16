import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { isAuthed, clearToken } from "./auth.js";

function Nav() {
  const nav = useNavigate();
  const logout = () => {
    clearToken();
    nav("/login");
  };
  return (
    <header className="nav">
      <div className="bar">
        <div className="row">
          <strong>Estufa Automatizada</strong>
          <span className="pill">dev</span>
        </div>
        <nav className="row" style={{ gap: 16 }}>
          {isAuthed() && <Link to="/">Dashboard</Link>}
          {!isAuthed() && <Link to="/login">Entrar</Link>}
          {!isAuthed() && <Link to="/register">Cadastrar</Link>}
          {isAuthed() && (
            <button className="btn" onClick={logout}>
              Sair
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

function Protected({ children }) {
  if (!isAuthed()) {
    window.location.href = "/login";
    return null;
  }
  return children;
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <div className="footer">Projeto estufa</div>
    </>
  );
}
