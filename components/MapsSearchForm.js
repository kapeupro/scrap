import { useState } from 'react'

export default function MapsSearchForm({ onSearch, isSearching, disabled }) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [maxResults, setMaxResults] = useState(20)
  const [minRating, setMinRating] = useState('')
  const [priceLevel, setPriceLevel] = useState('')
  const [openNow, setOpenNow] = useState(false)
  const [radius, setRadius] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch({
        query: query.trim(),
        location: location.trim(),
        maxResults: maxResults,
        minRating: minRating ? parseFloat(minRating) : null,
        priceLevel: priceLevel || null,
        openNow: openNow,
        radius: radius ? parseInt(radius) : null
      })
    }
  }

  const suggestions = [
    { query: 'restaurant', location: 'Paris' },
    { query: 'supermarché', location: 'Lyon' },
    { query: 'hôtel', location: 'Nice' },
    { query: 'pharmacie', location: 'Marseille' },
    { query: 'café', location: 'Bordeaux' },
    { query: 'boulangerie', location: 'Toulouse' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type d'établissement *
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: restaurant, supermarché, hôtel..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
            disabled={disabled || isSearching}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ville (optionnel)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Paris, Lyon, Marseille..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={disabled || isSearching}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre maximum de résultats
        </label>
        <select
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={disabled || isSearching}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Filtres avancés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note minimale
          </label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={disabled || isSearching}
          >
            <option value="">Toutes les notes</option>
            <option value="4.5">4.5⭐ et plus</option>
            <option value="4.0">4.0⭐ et plus</option>
            <option value="3.5">3.5⭐ et plus</option>
            <option value="3.0">3.0⭐ et plus</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gamme de prix
          </label>
          <select
            value={priceLevel}
            onChange={(e) => setPriceLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={disabled || isSearching}
          >
            <option value="">Tous les prix</option>
            <option value="1">€ - Économique</option>
            <option value="2">€€ - Modéré</option>
            <option value="3">€€€ - Cher</option>
            <option value="4">€€€€ - Très cher</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rayon de recherche
          </label>
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={disabled || isSearching}
          >
            <option value="">Rayon par défaut</option>
            <option value="1000">1 km</option>
            <option value="2000">2 km</option>
            <option value="5000">5 km</option>
            <option value="10000">10 km</option>
            <option value="25000">25 km</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={openNow}
              onChange={(e) => setOpenNow(e.target.checked)}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              disabled={disabled || isSearching}
            />
            <span className="text-sm font-medium text-gray-700">
              🕐 Ouvert maintenant
            </span>
          </label>
        </div>
      </div>

      {/* Suggestions */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Essayez ces recherches :</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setQuery(suggestion.query)
                setLocation(suggestion.location)
              }}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              disabled={disabled || isSearching}
            >
              {suggestion.query} à {suggestion.location}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled || isSearching || !query.trim()}
        className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSearching ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Recherche en cours...
          </span>
        ) : (
          '🔍 Rechercher'
        )}
      </button>
    </form>
  )
}
