import { useMemo, useState } from 'react'
import { getHeroes, useFetch } from '../api.js'
import { Status, Row, Empty } from '../components.jsx'
import { useTitle } from '../hooks.js'

export default function Heroes() {
  useTitle('Heroes')
  const { data, loading, error, reload } = useFetch(getHeroes)
  const [q, setQ] = useState('')
  const [game, setGame] = useState('')

  const games = useMemo(() => [...new Set(data?.map((h) => h.game).filter(Boolean))], [data])
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return data?.filter(
      (h) => (!game || h.game === game) && `${h.name} ${h.game} ${h.role}`.toLowerCase().includes(needle)
    )
  }, [data, q, game])

  return (
    <>
      <h1>Heroes</h1>
      <input
        className="search"
        type="search"
        placeholder="Cari nama, game, atau role"
        aria-label="Cari hero"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {games.length > 1 && (
        <div className="chips" role="group" aria-label="Filter game">
          {['', ...games].map((g) => (
            <button key={g || 'all'} className="chip" aria-pressed={game === g} onClick={() => setGame(g)}>
              {g || 'Semua'}
            </button>
          ))}
        </div>
      )}
      <Status loading={loading} error={error} reload={reload} />
      <div className="list">
        {list?.map((h, i) => (
          <Row i={i} key={h.id} to={`/heroes/${h.id}`} image={h.image} title={h.name} sub={`${h.game} · ${h.role}`} />
        ))}
      </div>
      {list?.length === 0 && <Empty title="Hero tidak ditemukan">Coba kata kunci lain atau ganti filter game.</Empty>}
    </>
  )
}
