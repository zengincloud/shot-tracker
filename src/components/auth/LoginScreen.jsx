import { useState } from 'react';

export default function LoginScreen({ onSignIn }) {
  const [username, setUsername] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (username.trim()) {
      onSignIn(username.trim());
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Shot Tracker</h1>
        <p>One-handed basketball scouting</p>
        <p className="text-muted" style={{ fontSize: '0.85rem', maxWidth: '280px', margin: '0 auto 1.5rem' }}>
          Track every shot in real time using just your keyboard. Set up your teams, start a game, and log shots in 4 quick keystrokes.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            className="input"
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <button className="btn btn-primary btn-lg" type="submit" disabled={!username.trim()}>
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}
