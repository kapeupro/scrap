import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function SubscriptionStatus({ user, refreshTrigger }) {
  const [usage, setUsage] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUsageStats = async () => {
    if (!user) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const timestamp = Date.now()
      const response = await fetch(`/api/usage?t=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Cache-Control': 'no-cache'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('🔄 Usage data fetched:', data)
        setUsage(data)
      }
    } catch (error) {
      console.error('❌ Error fetching usage:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchUsageStats()
  }, [user])

  // Refresh on trigger change
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('🔄 Refresh trigger activated:', refreshTrigger)
      setTimeout(fetchUsageStats, 1000)
    }
  }, [refreshTrigger])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  if (!usage) return null

  const { current, limit, limitType, planType, isFreePlan, resetDate, planFeatures } = usage
  const percentage = limit > 0 ? (current / limit) * 100 : 0
  const remaining = Math.max(0, limit - current)
  
  console.log('SubscriptionStatus render:', { current, limit, percentage, remaining })
  
  const planInfo = planFeatures[planType]
  const isNearLimit = percentage >= 80
  const isOverLimit = percentage >= 100

  const formatResetDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
      {/* Plan Status */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            {isFreePlan ? (
              <>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm mr-2">
                  GRATUIT
                </span>
                Plan {planInfo.name}
              </>
            ) : (
              <>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm mr-2">
                  PREMIUM
                </span>
                Plan {planInfo.name}
              </>
            )}
          </h3>
          <p className="text-sm text-gray-600">
            {planInfo.searches} • {planInfo.features.slice(0, 2).join(' • ')}
          </p>
        </div>
        
        {!isFreePlan && (
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">{planInfo.price}</div>
          </div>
        )}
      </div>

      {/* Usage Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Utilisation {limitType === 'weekly' ? 'hebdomadaire' : 'mensuelle'}
          </span>
          <span className={`text-sm font-semibold ${
            isOverLimit ? 'text-red-600' : 
            isNearLimit ? 'text-orange-600' : 
            'text-gray-600'
          }`}>
            {current} / {limit} recherches
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              isOverLimit ? 'bg-red-500' : 
              isNearLimit ? 'bg-orange-500' : 
              'bg-primary-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>
            {remaining > 0 ? `${remaining} recherches restantes` : 'Limite atteinte'}
          </span>
          <span>
            Renouvellement le {formatResetDate(resetDate)}
          </span>
        </div>
      </div>

      {/* Upgrade Notice for Free Plan */}
      {isFreePlan && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-primary-600 text-lg">🚀</span>
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-primary-900">
                Passez au plan Pro pour plus de recherches
              </h4>
              <p className="text-xs text-primary-700 mt-1">
                1,000 recherches/mois • Support prioritaire • Données enrichies
              </p>
              <button 
                onClick={() => window.location.href = '/pricing'}
                className="mt-2 bg-primary-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-primary-700 transition-colors"
              >
                Découvrir Pro - 29€/mois
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Messages */}
      {isNearLimit && !isOverLimit && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
          <div className="flex items-center">
            <span className="text-orange-500 mr-2">⚠️</span>
            <span className="text-sm text-orange-800">
              Attention : Vous approchez de votre limite {limitType === 'weekly' ? 'hebdomadaire' : 'mensuelle'}
            </span>
          </div>
        </div>
      )}

      {isOverLimit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">🚫</span>
            <span className="text-sm text-red-800">
              Limite {limitType === 'weekly' ? 'hebdomadaire' : 'mensuelle'} atteinte. 
              {isFreePlan ? ' Passez au plan Pro pour continuer.' : ' Votre limite sera renouvelée bientôt.'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
