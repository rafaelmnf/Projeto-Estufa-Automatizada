export default function SensorCard({ title, value, unit, timestamp, status }) {
  const badgeColor = status === 'ok' ? '#16a34a' : status === 'warn' ? '#f59e0b' : status === 'bad' ? '#ef4444' : '#334155'
  return (
    <div className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <h3>{title}</h3>
        <span className="pill" style={{borderColor: badgeColor, color: badgeColor}}>{status || '—'}</span>
      </div>
      <div className="value">{value ?? '—'} {unit}</div>
      <div className="muted">Atualizado: {timestamp ? new Date(timestamp).toLocaleString() : '—'}</div>
    </div>
  )
}
