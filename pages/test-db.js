import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function TestDB() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [searches, setSearches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
    await fetchSearches(user.id)
  }

  const fetchSearches = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('extractions')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'maps')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching searches:', error)
      } else {
        console.log('Searches found:', data)
        setSearches(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTestSearch = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('extractions')
        .insert({
          user_id: user.id,
          type: 'maps',
          query: 'Test Restaurant',
          location: 'Test City',
          results_count: 5,
          data: [{ name: 'Test Place', address: 'Test Address' }]
        })
        .select()

      if (error) {
        console.error('Error creating test search:', error)
        alert('Error: ' + error.message)
      } else {
        console.log('Test search created:', data)
        alert('Test search created successfully!')
        await fetchSearches(user.id)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error: ' + error.message)
    }
  }

  const deleteAllSearches = async () => {
    if (!user || !confirm('Delete all searches?')) return

    try {
      const { error } = await supabase
        .from('extractions')
        .delete()
        .eq('user_id', user.id)
        .eq('type', 'maps')

      if (error) {
        console.error('Error deleting searches:', error)
      } else {
        alert('All searches deleted!')
        await fetchSearches(user.id)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Database Test Page</h1>
          
          <div className="mb-6">
            <p><strong>User ID:</strong> {user?.id}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={createTestSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Test Search
            </button>
            <button
              onClick={() => fetchSearches(user.id)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Refresh Searches
            </button>
            <button
              onClick={deleteAllSearches}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete All Searches
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Searches Found: {searches.length}
            </h2>
            
            {searches.length === 0 ? (
              <p className="text-gray-500">No searches found</p>
            ) : (
              <div className="space-y-4">
                {searches.map((search) => (
                  <div key={search.id} className="border rounded p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>ID:</strong> {search.id}</div>
                      <div><strong>Query:</strong> {search.query}</div>
                      <div><strong>Location:</strong> {search.location}</div>
                      <div><strong>Results:</strong> {search.results_count}</div>
                      <div><strong>Created:</strong> {new Date(search.created_at).toLocaleString()}</div>
                      <div><strong>Type:</strong> {search.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Back to App
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
