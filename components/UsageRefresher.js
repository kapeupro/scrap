import { useEffect } from 'react'

export default function UsageRefresher({ onRefresh, user, trigger }) {
  useEffect(() => {
    if (user && trigger && onRefresh) {
      // Refresh immediately after search
      const timer = setTimeout(() => {
        onRefresh()
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [trigger, user, onRefresh])

  return null
}
