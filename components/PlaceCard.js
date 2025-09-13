export default function PlaceCard({ place }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      <h3 className="font-bold text-lg text-gray-800 mb-2">{place.name}</h3>
      
      <div className="space-y-2 text-sm">
        {place.category && place.category !== 'N/A' && (
          <div className="flex items-start">
            <span className="text-gray-500 mr-2">📍</span>
            <span className="text-gray-700">{place.category}</span>
          </div>
        )}
        
        {place.rating && place.rating !== 'N/A' && (
          <div className="flex items-start">
            <span className="text-yellow-400 mr-2">⭐</span>
            <span className="text-gray-700">{place.rating}</span>
          </div>
        )}
        
        {place.address && place.address !== 'N/A' && (
          <div className="flex items-start">
            <span className="text-gray-500 mr-2">📍</span>
            <span className="text-gray-700">{place.address}</span>
          </div>
        )}
        
        {place.phone && place.phone !== 'N/A' && (
          <div className="flex items-start">
            <span className="text-gray-500 mr-2">📞</span>
            <a href={`tel:${place.phone}`} className="text-blue-600 hover:underline">
              {place.phone}
            </a>
          </div>
        )}
        
        {place.website && place.website !== 'N/A' && (
          <div className="flex items-start">
            <span className="text-gray-500 mr-2">🌐</span>
            <a 
              href={place.website.startsWith('http') ? place.website : `https://${place.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Site web
            </a>
          </div>
        )}
        
        {place.hours && place.hours !== 'N/A' && (
          <div className="flex items-start">
            <span className="text-gray-500 mr-2">🕐</span>
            <span className="text-gray-700">{place.hours}</span>
          </div>
        )}
      </div>
    </div>
  )
}
