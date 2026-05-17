import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const { signIn } = useAuth()
  const navigate = useNavigate()

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      setError('')
      setLoading(true)
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error.message)
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      setError('Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <button 
        onClick={toggleDarkMode}
        className="dark-mode-toggle"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000
        }}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="icon">
          {isDarkMode ? '☀️' : '🌙'}
        </span>
      </button>
      <div className="auth-card">
        <h2>Login to Expense Tracker</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <p className="auth-link">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login