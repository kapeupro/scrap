import { useState } from 'react'

export default function ExportButton({ data, filename = 'export', type = 'places' }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (format = 'csv') => {
    setExporting(true)
    
    try {
      if (format === 'csv') {
        // Generate CSV directly in the browser
        let csvContent = '';
        
        if (type === 'places') {
          // Headers for places
          csvContent = 'Nom,Catégorie,Note,Adresse,Téléphone,Site Web,Horaires\n';
          
          // Add data rows
          data.forEach(place => {
            const row = [
              place.name || '',
              place.category || '',
              place.rating || '',
              place.address || '',
              place.phone || '',
              place.website || '',
              place.hours || ''
            ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
            csvContent += row + '\n';
          });
        } else {
          // Headers for profiles (LinkedIn)
          csvContent = 'Nom,Titre,Entreprise,Localisation,URL Profil,Email\n';
          
          // Add data rows
          data.forEach(profile => {
            const row = [
              profile.name || '',
              profile.title || '',
              profile.company || '',
              profile.location || '',
              profile.profileUrl || '',
              profile.email || ''
            ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
            csvContent += row + '\n';
          });
        }
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (format === 'json') {
        // Generate JSON
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      alert(`Erreur d'export: ${error.message}`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => handleExport('csv')}
        disabled={exporting || !data || data.length === 0}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {exporting ? '⏳ Export...' : '📥 Télécharger CSV'}
      </button>
      <button
        onClick={() => handleExport('json')}
        disabled={exporting || !data || data.length === 0}
        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {exporting ? '⏳ Export...' : '📄 Télécharger JSON'}
      </button>
    </div>
  )
}
