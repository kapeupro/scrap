export default function PlacesTable({ places }) {
  if (!places || places.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun résultat trouvé
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Catégorie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Note
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Adresse
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Téléphone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Site Web
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Horaires
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {places.map((place, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {place.name || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {place.category || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {place.rating !== 'N/A' && place.rating ? (
                  <span className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    {place.rating}
                  </span>
                ) : (
                  'N/A'
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {place.address || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {place.phone !== 'N/A' && place.phone ? (
                  <a href={`tel:${place.phone}`} className="text-blue-600 hover:underline">
                    {place.phone}
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {place.website !== 'N/A' && place.website ? (
                  <a 
                    href={place.website.startsWith('http') ? place.website : `https://${place.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visiter
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {place.hours || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
