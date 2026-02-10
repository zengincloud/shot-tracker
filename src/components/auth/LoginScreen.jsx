export default function LoginScreen({ onSignIn }) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Shot Tracker</h1>
        <p>One-handed basketball scouting</p>
        <p className="text-muted" style={{ fontSize: '0.85rem', maxWidth: '280px', margin: '0 auto 1rem' }}>
          Track every shot in real time using just your keyboard. Set up your teams, start a game, and log shots in 4 quick keystrokes.
        </p>
        <button className="btn btn-primary btn-lg" onClick={onSignIn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
