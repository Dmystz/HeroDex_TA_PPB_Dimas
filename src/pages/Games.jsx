import { getGames, useFetch } from '../api.js'
import { Status, Row, Empty } from '../components.jsx'
import { useTitle } from '../hooks.js'

export default function Games() {
  useTitle('Games')
  const { data, loading, error, reload } = useFetch(getGames)

  return (
    <>
      <h1>Games</h1>
      <Status loading={loading} error={error} reload={reload} />
      <div className="list">
        {data?.map((g, i) => (
          <Row i={i} key={g.id} to={`/games/${g.id}`} image={g.image} title={g.title} sub={g.genre} />
        ))}
      </div>
      {data?.length === 0 && <Empty icon="🎮" title="Belum ada game" />}
    </>
  )
}
