import { Link, useParams } from 'react-router-dom'
import { getGames, getHero, useFetch } from '../api.js'
import { Status, Thumb, Back } from '../components.jsx'
import { useTitle } from '../hooks.js'

export default function HeroDetail({ favs, toggleFav }) {
  const { id } = useParams()
  const { data: h, loading, error, reload } = useFetch((s) => getHero(id, s), [id])
  const games = useFetch(getGames)
  const game = games.data?.find((g) => g.title === h?.game)
  const isFav = h ? favs.includes(h.id) : false
  useTitle(h?.name)

  return (
    <>
      <Back fallback="/heroes" />
      <Status loading={loading} error={error} reload={reload} count={1} />
      {h && (
        <article className="detail">
          <Thumb src={h.image} alt={h.name} />
          <div className="detail-body">
            <h1>{h.name}</h1>
            <div className="chips static">
              {game ? <Link className="chip" to={`/games/${game.id}`}>{h.game}</Link> : <span className="chip">{h.game}</span>}
              <span className="chip">{h.role}</span>
            </div>
            <p className="desc">{h.description}</p>
            <button className={`btn ${isFav ? 'btn-ghost' : ''}`} aria-pressed={isFav} onClick={() => toggleFav(h.id)}>
              {isFav ? '★ Hapus dari favorit' : '☆ Tambah ke favorit'}
            </button>
          </div>
        </article>
      )}
    </>
  )
}
