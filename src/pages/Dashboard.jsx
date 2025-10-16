import { useEffect, useState } from 'react'
import api from '../api'
import SensorCard from '../components/SensorCard.jsx'

async function fetchOne(path) {
  const { data } = await api.get(path)
  // API returns an array or object? In model, controllers respond with results (mysql rows).
  // We'll handle both: array[0] or object
  const row = Array.isArray(data) ? data[0] : data
  return row
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dados, setDados] = useState({
    temperatura: null, temperatura_time: null,
    umidade: null, umidade_time: null,
    luminosidade: null, luminosidade_time: null,
    altura: null, altura_time: null
  })

  async function load() {
    setError('')
    try {
      const [t, u, l, a] = await Promise.all([
        fetchOne('/estufa/temperatura'),
        fetchOne('/estufa/umidade'),
        fetchOne('/estufa/luminosidade'),
        fetchOne('/estufa/altura'),
      ])
      setDados({
        temperatura: t?.temperatura ?? t?.valor ?? null,
        temperatura_time: t?.data_hora ?? t?.data ?? null,
        umidade: u?.umidade ?? u?.valor ?? null,
        umidade_time: u?.data_hora ?? u?.data ?? null,
        luminosidade: l?.luminosidade ?? l?.valor ?? null,
        luminosidade_time: l?.data_hora ?? l?.data ?? null,
        altura: a?.altura ?? a?.valor ?? null,
        altura_time: a?.data_hora ?? a?.data ?? null,
      })
    } catch (err) {
      setError(err?.response?.data?.erro || 'Falha ao buscar dados.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    load()
    const id = setInterval(load, 15000) // atualiza a cada 15s
    return () => clearInterval(id)
  }, [])

  return (
    <div className="container">
      <h1>Painel</h1>
      <p className="muted">Leituras mais recentes da sua estufa.</p>
      <div style={{height:12}}/>
      {error && <div className="card" style={{borderColor:'#ef4444', color:'#ef4444'}}>{error}</div>}
      <div className="grid">
        <SensorCard title="Temperatura" value={dados.temperatura} unit="°C" timestamp={dados.temperatura_time} status={statusTemp(dados.temperatura)} />
        <SensorCard title="Umidade" value={dados.umidade} unit="%" timestamp={dados.umidade_time} status={statusUmid(dados.umidade)} />
        <SensorCard title="Luminosidade" value={dados.luminosidade} unit="lx" timestamp={dados.luminosidade_time} status={statusLux(dados.luminosidade)} />
        <SensorCard title="Altura (ultrassom)" value={dados.altura} unit="cm" timestamp={dados.altura_time} status={statusAlt(dados.altura)} />
      </div>
    </div>
  )
}

function statusTemp(v){ if(v==null) return '—'; if(v<15) return 'warn'; if(v>35) return 'bad'; return 'ok' }
function statusUmid(v){ if(v==null) return '—'; if(v<30) return 'warn'; if(v>90) return 'bad'; return 'ok' }
function statusLux(v){ if(v==null) return '—'; if(v<100) return 'warn'; return 'ok' }
function statusAlt(v){ if(v==null) return '—'; return 'ok' }
