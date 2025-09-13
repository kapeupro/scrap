import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import MapsSearchForm from '../components/MapsSearchForm'
import PlacesTable from '../components/PlacesTable'
import PlaceCard from '../components/PlaceCard'
import ExportButton from '../components/ExportButton'
import UsageStats from '../components/UsageStats'

export default function Home() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [viewMode, setViewMode] = useState('cards')
  const [usage, setUsage] = useState(null)

  useEffect(() => {
    checkSession()
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchUsage(session)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      if (session) {
        await fetchUsage(session)
      }
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsage = async (session) => {
    try {
      const response = await fetch('/api/usage', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUsage(data)
      }
    } catch (error) {
      console.error('Error fetching usage:', error)
    }
  }

  const handleLogin = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      setSession(data.session)
      if (data.session) {
        await fetchUsage(data.session)
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const handleSignup = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) throw error
      
      if (data.user && !data.session) {
        return { 
          success: true, 
          message: 'Inscription réussie ! Vérifiez votre email pour confirmer votre compte.' 
        }
      }
      
      setSession(data.session)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setSearchResults(null)
    setUsage(null)
  }

  const handleSearch = async (query, location, maxResults) => {
    setSearching(true)
    setSearchResults(null)
    
    try {
      const response = await fetch('/api/maps-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          query,
          location,
          maxResults
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setSearchResults(data)
        // Refresh usage after search
        await fetchUsage(session)
      } else {
        alert(data.error || 'Erreur lors de la recherche')
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Erreur lors de la recherche')
    } finally {
      setSearching(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🗺️ Google Maps Scraper
          </h1>
          
          <AuthForm onLogin={handleLogin} onSignup={handleSignup} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🗺️ Google Maps Scraper</h1>
              <p className="text-gray-600 mt-2">Extrayez des données d'établissements facilement</p>
            </div>
            <div className="flex items-center space-x-4">
              <UsageStats usage={usage} />
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <MapsSearchForm 
            onSearch={handleSearch} 
            isSearching={searching}
            disabled={usage && usage.remaining === 0}
          />
          {usage && usage.remaining === 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">
                Vous avez atteint votre limite mensuelle de {usage.limit} recherches.
                Votre quota sera réinitialisé le mois prochain.
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {searchResults && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Résultats ({searchResults.places?.length || 0} établissements)
              </h2>
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-md">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-4 py-2 rounded-l-md transition-colors ${
                      viewMode === 'cards' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    📇 Cartes
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-r-md transition-colors ${
                      viewMode === 'table' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    📊 Tableau
                  </button>
                </div>
                
                {/* Export Button */}
                <ExportButton 
                  data={searchResults.places} 
                  filename="google-maps-places"
                  type="places"
                />
              </div>
            </div>

            {/* Display Results */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.places?.map((place, index) => (
                  <PlaceCard key={index} place={place} />
                ))}
              </div>
            ) : (
              <PlacesTable places={searchResults.places || []} />
            )}

            {/* Search Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p>Recherche : "{searchResults.query}" {searchResults.location && `à ${searchResults.location}`}</p>
                <p>Date : {new Date(searchResults.created_at).toLocaleString('fr-FR')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Auth Form Component
function AuthForm({ onLogin, onSignup }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = isLogin 
      ? await onLogin(email, password)
      : await onSignup(email, password)

    if (result.success) {
      if (result.message) {
        setMessage(result.message)
        setEmail('')
        setPassword('')
      }
    } else {
      setMessage(result.error || 'Une erreur est survenue')
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          minLength={6}
        />
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('réussie') 
            ? 'bg-green-50 text-green-600' 
            : 'bg-red-50 text-red-600'
        }`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin)
            setMessage('')
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          {isLogin ? "Pas de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
        </button>
      </div>
    </form>
  )
}
