import { Link } from 'react-router-dom'
import { getHeroes, useFetch } from '../api.js'
import { Status, Row, Empty } from '../components.jsx'
import { useTitle } from '../hooks.js'

export default function Favorites({ favs }) {
  useTitle('Favorites')
  const { data, loading, error, reload } = useFetch(getHeroes)
  const list = data?.filter((h) => favs.includes(h.id))

  return (
    <>
      <h1>Favorites</h1>
      <Status loading={loading} error={error} reload={reload} count={2} />
      <div className="list">
        {list?.map((h, i) => (
          <Row i={i} key={h.id} to={`/heroes/${h.id}`} image={h.image} title={h.name} sub={`${h.game} · ${h.role}`} />
        ))}
      </div>
      {list?.length === 0 && (
        <Empty icon="⭐" title="Belum ada favorit">
          Buka halaman hero lalu tekan “Tambah ke favorit”. <Link to="/heroes">Lihat semua hero</Link>
        </Empty>
      )}
    </>
  )
}
