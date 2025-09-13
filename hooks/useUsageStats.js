import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useUsageStats(user, refreshTrigger) {
  const [usage, setUsage] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUsageStats = useCallback(async () => {
    if (!user) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/usage?' + new Date().getTime(), {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Fresh usage data:', data)
        setUsage(data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Initial load
  useEffect(() => {
    fetchUsageStats()
  }, [fetchUsageStats])

  // Refresh on trigger
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('Usage hook: refresh triggered', refreshTrigger)
      // Wait a bit for the database to be updated
      setTimeout(() => {
        console.log('Fetching usage stats after trigger...')
        fetchUsageStats()
      }, 2000)
    }
  }, [refreshTrigger, fetchUsageStats])

  return { usage, loading, refetch: fetchUsageStats }
}
