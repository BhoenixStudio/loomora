export default function HomePage() {
  return (
    <main className="page-shell">
      <p className="eyebrow">Private development app</p>
      <h1>Loomora Playground</h1>
      <p className="intro">
        Add component and hook examples here while building the library. Changes inside the root
        <code>src</code> directory are picked up by Next.js Fast Refresh.
      </p>
      <div className="command-card">
        <span>Start the playground</span>
        <code>npm run dev</code>
      </div>
    </main>
  )
}
