import { useState, useEffect } from 'react'

const RealtimeIndicator = ({ message, show }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!visible) return null

  return (
    <div className={`realtime-indicator ${visible ? 'show' : ''}`}>
      {message}
    </div>
  )
}

export default RealtimeIndicator