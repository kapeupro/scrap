import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import MapsSearchForm from '../components/MapsSearchForm'
import PlacesTable from '../components/PlacesTable'
import ExportButton from '../components/ExportButton'
import SubscriptionStatus from '../components/SubscriptionStatus'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [places, setPlaces] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [usage, setUsage] = useState({ current: 0, limit: 100 })
  const [searchTrigger, setSearchTrigger] = useState(0)
  
  const dashboardRef = useRef(null)
  const searchFormRef = useRef(null)
  const resultsRef = useRef(null)

  useEffect(() => {
    // Vérifier la session utilisateur
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    getSession()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchUsageStats()
    }
  }, [user])

  const fetchUsageStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/usage', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUsage(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    }
  }

  const handleSearch = async (searchData) => {
    if (!user) {
      alert('Veuillez vous connecter pour effectuer une recherche')
      return
    }

    setSearchLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/maps-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(searchData),
      })

      if (response.ok) {
        const data = await response.json()
        setPlaces(data.places || [])
        // Immediately increment the search trigger
        console.log('✅ Search completed successfully')
        setSearchTrigger(prev => {
          const newValue = prev + 1
          console.log('🔄 Incrementing search trigger to:', newValue)
          return newValue
        })
      } else {
        const error = await response.json()
        if (response.status === 429) {
          // Quota exceeded
          alert(`Limite atteinte: ${error.error}\n\nUtilisé: ${error.used}/${error.limit}\nType: ${error.limitType}\nRenouvellement: ${new Date(error.resetDate).toLocaleDateString('fr-FR')}`)
        } else {
          alert(`Erreur: ${error.error}`)
        }
        // Refresh usage stats even on error to show updated quota
        setTimeout(() => fetchUsageStats(), 500)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la recherche')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setPlaces([])
      setUsage({ current: 0, limit: 100 })
      router.push('/landing')
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation moderne */}
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center animate-slide-down">
              <div className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer">
                🗺️ MapScraper
              </div>
            </div>
            <div className="flex items-center space-x-4 animate-slide-down" style={{animationDelay: '0.2s'}}>
              {user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg animate-glow">
                      <span className="text-white font-bold text-sm">
                        {(user.user_metadata?.full_name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-secondary-700 font-semibold">
                      {user.user_metadata?.full_name || user.email.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-secondary-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="text-secondary-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => router.push('/signup')}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-glow"
                  >
                    Commencer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {user ? (
          <div ref={dashboardRef} className="space-y-8">
            {/* En-tête avec statistiques */}
            <div className="text-center animate-slide-up">
              <h1 className="text-5xl font-bold text-secondary-900 mb-4">
                Tableau de bord
              </h1>
              <p className="text-xl text-secondary-600 mb-8">
                Recherchez et exportez des données d'établissements
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Search Form */}
              <div className="lg:col-span-2">
                <MapsSearchForm onSearch={handleSearch} loading={searchLoading} />
              </div>

              {/* Subscription Status */}
              <div>
                <SubscriptionStatus user={user} refreshTrigger={searchTrigger} />
              </div>
            </div>

            {/* Résultats avec design amélioré */}
            {places.length > 0 && (
              <div ref={resultsRef} className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-primary-200 animate-slide-up">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-secondary-900 mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                        Résultats de recherche
                      </span>
                    </h2>
                    <p className="text-secondary-600 text-lg">
                      <span className="inline-flex items-center">
                        <span className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        {places.length} établissement{places.length > 1 ? 's' : ''} trouvé{places.length > 1 ? 's' : ''}
                      </span>
                    </p>
                  </div>
                  <ExportButton places={places} />
                </div>
                <PlacesTable places={places} />
              </div>
            )}

            {/* État de chargement amélioré */}
            {searchLoading && (
              <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-12 text-center border border-primary-200 animate-pulse">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-200 border-t-primary-600 mx-auto mb-8"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-3">Recherche en cours...</h3>
                <p className="text-secondary-600 text-lg">Extraction des données d'établissements</p>
                <div className="mt-6 flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}

            {/* Message d'accueil si pas de résultats */}
            {!searchLoading && places.length === 0 && (
              <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-12 text-center border border-primary-200 animate-scale-in">
                <div className="text-8xl mb-8 animate-float">🔍</div>
                <h3 className="text-3xl font-bold text-secondary-900 mb-6">
                  Prêt à commencer vos recherches ?
                </h3>
                <p className="text-xl text-gray-600 mb-8">
                  L'outil le plus simple pour extraire des données d'établissements.
                  Restaurants, hôtels, pharmacies... Tout en quelques clics avec export CSV/JSON.
                </p>
                
                {/* Aperçu des fonctionnalités */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                  {[
                    { icon: "⚡", title: "Ultra rapide", desc: "Résultats en secondes" },
                    { icon: "📊", title: "Export facile", desc: "CSV & JSON en un clic" },
                    { icon: "🎯", title: "Données précises", desc: "Informations complètes" }
                  ].map((feature, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue sur MapScraper</h1>
            <p className="text-xl text-gray-600 mb-8">Connectez-vous pour commencer vos recherches</p>
          </div>
        )}
      </main>
    </div>
  )
}
