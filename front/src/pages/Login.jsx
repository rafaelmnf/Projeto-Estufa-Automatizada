import { useState } from 'react'
import api from '../api'
import { setToken, isAuthed } from '../auth'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/login', { email, senha })
      if (data && data.token) {
        setToken(data.token)
        nav('/')
      } else {
        setError('Falha no login.')
      }
    } catch (err) {
      setError(err?.response?.data?.erro || 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthed()) {
    nav('/')
    return null
  }

  return (
    <div className="container center">
      <form className="card" style={{minWidth:360}} onSubmit={onSubmit}>
        <h2>Entrar</h2>
        <p className="muted">Use seu e-mail e senha cadastrados.</p>
        <div style={{height:8}}/>
        <input className="input" type="email" placeholder="email@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <div style={{height:8}}/>
        <input className="input" type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} required/>
        <div style={{height:12}}/>
        <button className="btn primary" disabled={loading}>{loading?'Entrando...':'Entrar'}</button>
        {error && <p className="muted" style={{color:'#ef4444'}}>{error}</p>}
        <div style={{height:8}}/>
        <p className="muted">Ainda não tem conta? <Link to="/register">Cadastrar</Link></p>
      </form>
    </div>
  )
}
