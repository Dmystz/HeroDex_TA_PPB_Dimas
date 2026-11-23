import { useState } from 'react'
import { useInstall } from '../install.js'
import { useProfile, useTitle } from '../hooks.js'

function ProfileCard() {
  const [profile, save] = useProfile()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)

  const startEdit = () => { setDraft(profile); setEditing(true) }
  const onSubmit = (e) => {
    e.preventDefault()
    save(draft)
    setEditing(false)
  }
  const set = (k) => (e) => setDraft({ ...draft, [k]: e.target.value })

  if (!editing) {
    return (
      <div className="profile">
        <div className="avatar" aria-hidden="true">{profile.name[0]?.toUpperCase()}</div>
        <div className="profile-info">
          <h2>{profile.name}</h2>
          <p className="muted">Favorite game: {profile.game || '-'}</p>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={startEdit}>Edit</button>
      </div>
    )
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>Edit profil</h2>
      <label className="field">Nickname
        <input className="search" value={draft.name} onChange={set('name')} maxLength={40} required autoFocus />
      </label>
      <label className="field">Favorite game
        <input className="search" value={draft.game} onChange={set('game')} maxLength={40} />
      </label>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Batal</button>
        <button type="submit" className="btn">Simpan</button>
      </div>
    </form>
  )
}

export default function About() {
  useTitle('About')
  const { canInstall, installed, ios, install } = useInstall()
  const [help, setHelp] = useState(false)

  const onClick = () => (canInstall ? install() : setHelp(true))

  return (
    <>
      <h1>About</h1>
      <ProfileCard />
      <div className="card">
        <h2>HeroDex</h2>
        <p>Ensiklopedia karakter game untuk melihat hero, game, dan menyimpan favoritmu.</p>
      </div>
      <div className="card">
        <h2>Install Aplikasi</h2>
        {installed ? (
          <p className="muted">Aplikasi sudah ter-install.</p>
        ) : (
          <>
            <button className="btn" onClick={onClick}>Install HeroDex</button>
            {help && (
              <p className="muted" style={{ marginTop: 10 }}>
                {ios
                  ? 'Tekan tombol Share di Safari, lalu pilih Add to Home Screen.'
                  : 'Buka menu browser (⋮), lalu pilih Install app / Add to Home screen.'}
              </p>
            )}
          </>
        )}
      </div>
    </>
  )
}