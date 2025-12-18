import { useEffect, useState } from 'react'

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false)
    }
    function handleOffline() {
      setIsOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div style={{
      position: 'sticky',       // stick at top without overlay
      top: 0,
      width: '100%',
      padding: '12px 20px',
      backgroundColor: '#FFEB3B', // softer yellow
      color: '#333',
      textAlign: 'center',
      fontWeight: 600,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #FDD835',
      zIndex: 999,
      fontFamily: 'sans-serif',
      fontSize: '14px',
    }}>
      ⚠️ You are currently offline
    </div>
  )
}
