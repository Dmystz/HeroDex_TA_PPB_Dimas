import { Link } from 'react-router-dom'
import { getHeroes, getGames, useFetch } from '../api.js'
import { Status, Row } from '../components.jsx'
import { useTitle } from '../hooks.js'

export default function Home() {
  useTitle()
  const heroes = useFetch(getHeroes)
  const games = useFetch(getGames)

  return (
    <>
      <section className="hero">
        <div className="logo" aria-hidden="true">⚔️</div>
        <h1 className="grad">HeroDex</h1>
        <p className="muted">Game Character Encyclopedia</p>
      </section>

      <div className="stats">
        <Link to="/heroes"><b>{heroes.data?.length ?? '–'}</b>Heroes</Link>
        <Link to="/games"><b>{games.data?.length ?? '–'}</b>Games</Link>
      </div>

      <h2>Featured</h2>
      <Status {...heroes} count={4} />
      <div className="list">
        {heroes.data?.slice(0, 4).map((h, i) => (
          <Row i={i} key={h.id} to={`/heroes/${h.id}`} image={h.image} title={h.name} sub={`${h.game} · ${h.role}`} />
        ))}
      </div>
    </>
  )
}
