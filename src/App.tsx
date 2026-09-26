import { useEffect, useState } from 'react'
import { useClaimsStore } from './store/useClaimsStore'
import { loadClaimsData } from './utils/dataLoader'
import Dashboard from './components/Dashboard'
import ClaimsTable from './components/ClaimsTable'
import FilterBar from './components/FilterBar'
import ClaimDetail from './components/ClaimDetail'
import { Home, Table } from 'lucide-react'

function App() {
  const setClaims = useClaimsStore((state) => state.setClaims)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'claims'>('dashboard')
  const [selectedAz, setSelectedAz] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try { const data = await loadClaimsData(); setClaims(data) }
      catch (error) { console.error('Failed to load claims:', error) }
      finally { setLoading(false) }
    }
    loadData()
  }, [setClaims])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Forderungen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Debtor Buddy</h1>
          <p className="text-gray-600">Forderungsverwaltung und Inkasso-Übersicht</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex gap-2 border-b">
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
              <Home className="w-4 h-4" /> Dashboard
            </button>
            <button onClick={() => setActiveTab('claims')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'claims' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
              <Table className="w-4 h-4" /> Forderungen
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'claims' && (<><FilterBar /><ClaimsTable onSelectClaim={setSelectedAz} /></>)}
      </main>

      {selectedAz && <ClaimDetail az={selectedAz} onClose={() => setSelectedAz(null)} />}
    </div>
  )
}

export default App
