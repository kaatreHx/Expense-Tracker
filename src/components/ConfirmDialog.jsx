import { useState, useEffect } from 'react'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', type = 'danger' }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className={`confirm-overlay ${isOpen ? 'show' : ''}`} onClick={handleCancel}>
      <div className={`confirm-dialog ${isOpen ? 'show' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="confirm-header">
          <h3>{title}</h3>
        </div>
        
        <div className="confirm-body">
          <p>{message}</p>
        </div>
        
        <div className="confirm-actions">
          <button 
            onClick={handleCancel}
            className="confirm-btn cancel"
          >
            {cancelText}
          </button>
          <button 
            onClick={handleConfirm}
            className={`confirm-btn ${type}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog