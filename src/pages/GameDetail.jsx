import { useParams } from 'react-router-dom'
import { getGame, getHeroes, useFetch } from '../api.js'
import { Status, Thumb, Back, Row, Empty } from '../components.jsx'
import { useTitle } from '../hooks.js'

export default function GameDetail() {
  const { id } = useParams()
  const { data: g, loading, error, reload } = useFetch((s) => getGame(id, s), [id])
  const heroes = useFetch(getHeroes)
  const chars = heroes.data?.filter((h) => h.game === g?.title)
  useTitle(g?.title)

  return (
    <>
      <Back fallback="/games" />
      <Status loading={loading} error={error} reload={reload} count={1} />
      {g && (
        <article className="detail">
          <Thumb src={g.image} alt={g.title} />
          <div className="detail-body">
            <h1>{g.title}</h1>
            <div className="chips static"><span className="chip">{g.genre}</span></div>
            <p className="desc">{g.description}</p>
          </div>
          <section className="detail-wide">
            <h2>Characters</h2>
            <Status loading={heroes.loading} error={heroes.error} reload={heroes.reload} count={2} />
            <div className="list">
              {chars?.map((h, i) => (
                <Row i={i} key={h.id} to={`/heroes/${h.id}`} image={h.image} title={h.name} sub={h.role} />
              ))}
            </div>
            {chars?.length === 0 && <Empty icon="🦸" title="Belum ada karakter">Karakter untuk game ini belum ditambahkan.</Empty>}
          </section>
        </article>
      )}
    </>
  )
}
