import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export const Skeleton = ({ count = 3 }) => (
  <div className="list" aria-hidden="true">
    {Array.from({ length: count }, (_, i) => <div key={i} className="skel" />)}
  </div>
)

export const Status = ({ loading, error, reload, count }) => {
  if (loading) return <div role="status" aria-label="Memuat"><Skeleton count={count} /></div>
  if (error) {
    return (
      <div className="notice error" role="alert">
        <p>{error.message}</p>
        {reload && <button className="btn btn-sm" onClick={reload}>Coba lagi</button>}
      </div>
    )
  }
  return null
}

export const Empty = ({ icon = '🔍', title, children }) => (
  <div className="notice empty">
    <div className="empty-icon" aria-hidden="true">{icon}</div>
    <strong>{title}</strong>
    {children && <p className="muted">{children}</p>}
  </div>
)

export function Thumb({ src, alt }) {
  const [failed, setFailed] = useState(false)
  return src && !failed ? (
    <img className="thumb" src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
  ) : (
    <div className="thumb ph" role="img" aria-label={alt}>{alt?.[0]?.toUpperCase()}</div>
  )
}

export function Back({ fallback = '/' }) {
  const nav = useNavigate()
  const { key } = useLocation()
  // key === 'default' berarti halaman dibuka langsung (tanpa riwayat di app).
  return (
    <button className="back" onClick={() => (key !== 'default' ? nav(-1) : nav(fallback))}>
      ← Kembali
    </button>
  )
}

export const Row = ({ to, image, title, sub, i = 0 }) => (
  <Link to={to} className="row" style={{ '--i': Math.min(i, 8) }}>
    <Thumb src={image} alt={title} />
    <div className="row-text">
      <strong>{title}</strong>
      <div className="muted">{sub}</div>
    </div>
    <span className="chev" aria-hidden="true">›</span>
  </Link>
)
