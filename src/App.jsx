import { useEffect } from 'react'
import { HashRouter, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Heroes from './pages/Heroes.jsx'
import HeroDetail from './pages/HeroDetail.jsx'
import Games from './pages/Games.jsx'
import GameDetail from './pages/GameDetail.jsx'
import Favorites from './pages/Favorites.jsx'
import About from './pages/About.jsx'
import { Empty } from './components.jsx'
import { useFavorites, useTitle } from './hooks.js'
import { HomeIcon, ShieldIcon, GamepadIcon, StarIcon, UserIcon } from './icons.jsx'

const tabs = [
  ['/', 'Home', HomeIcon],
  ['/heroes', 'Heroes', ShieldIcon],
  ['/games', 'Games', GamepadIcon],
  ['/favorites', 'Favorites', StarIcon],
  ['/about', 'About', UserIcon]
]

const Nav = ({ className, label }) => (
  <nav className={className} aria-label={label}>
    {tabs.map(([to, name, Icon]) => (
      <NavLink key={to} to={to} end={to === '/'}>
        <Icon />
        {name}
      </NavLink>
    ))}
  </nav>
)

function NotFound() {
  useTitle('Tidak ditemukan')
  return (
    <Empty icon="🧭" title="Halaman tidak ditemukan">
      <Link to="/">Kembali ke Home</Link>
    </Empty>
  )
}

function Pages({ fav }) {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <main key={pathname} className="page">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/heroes" element={<Heroes />} />
        <Route path="/heroes/:id" element={<HeroDetail {...fav} />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:id" element={<GameDetail />} />
        <Route path="/favorites" element={<Favorites favs={fav.favs} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

export default function App() {
  const fav = useFavorites()

  return (
    <HashRouter>
      <Pages fav={fav} />
      <Nav className="bottom-nav" label="Navigasi utama" />
    </HashRouter>
  )
}