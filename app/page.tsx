export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#f9f8f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '13px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: '#0a0a0a',
          marginBottom: '8px',
          fontWeight: 300,
        }}>
          Drop<span style={{ color: '#00c2d4' }}>●</span>Circle
        </div>
        <div style={{
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#b0b0b0',
        }}>
          Coming soon
        </div>
      </div>
    </main>
  )
}