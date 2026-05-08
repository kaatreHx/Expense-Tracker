import { useState } from 'react'

const DebugPanel = ({ transactions, categories }) => {
  const [showDebug, setShowDebug] = useState(false)

  if (!showDebug) {
    return (
      <button 
        onClick={() => setShowDebug(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 1000
        }}
      >
        🐛
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #dee2e6',
      borderRadius: '8px',
      padding: '1rem',
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      zIndex: 1000,
      fontSize: '12px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0 }}>Debug Panel</h4>
        <button 
          onClick={() => setShowDebug(false)}
          style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
        >
          ×
        </button>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong>Categories ({categories.length}):</strong>
        <div style={{ maxHeight: '80px', overflow: 'auto', background: '#f8f9fa', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>
          {categories.map(cat => (
            <div key={cat.id} style={{ fontSize: '10px', marginBottom: '2px' }}>
              <span style={{ 
                display: 'inline-block', 
                width: '10px', 
                height: '10px', 
                backgroundColor: cat.color, 
                marginRight: '4px',
                borderRadius: '2px'
              }}></span>
              {cat.name}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <strong>Transactions ({transactions.length}):</strong>
        <div style={{ maxHeight: '80px', overflow: 'auto', background: '#f8f9fa', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>
          {transactions.slice(0, 5).map(trans => (
            <div key={trans.id} style={{ fontSize: '10px', marginBottom: '2px' }}>
              <span style={{ color: trans.type === 'income' ? '#28a745' : '#dc3545' }}>
                {trans.type === 'income' ? '+' : '-'}${trans.amount}
              </span> - {trans.note}
              {trans.categories && (
                <span style={{ color: '#6c757d' }}> ({trans.categories.name})</span>
              )}
            </div>
          ))}
          {transactions.length > 5 && (
            <div style={{ fontSize: '10px', color: '#6c757d', fontStyle: 'italic' }}>
              ...and {transactions.length - 5} more
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DebugPanel