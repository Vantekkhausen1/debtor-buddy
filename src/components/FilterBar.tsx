import { useClaimsStore } from '../store/useClaimsStore'
import { Search, Filter, X } from 'lucide-react'

export default function FilterBar() {
  const { searchQuery, filterProcedure, filterType, filterStatus, setSearchQuery, setFilterProcedure, setFilterType, setFilterStatus, getStats } = useClaimsStore()
  const stats = getStats()
  const procedures = Object.keys(stats.byProcedure)
  const types = Object.keys(stats.byType)

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Suche</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="AZ, Gläubiger, Betreff, Inkasso..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>)}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Verfahrensstand</label>
          <select value={filterProcedure} onChange={(e) => setFilterProcedure(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Alle</option>
            {procedures.map((proc) => (<option key={proc} value={proc}>{proc}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Forderungsart</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Alle</option>
            {types.map((type) => (<option key={type} value={type}>{type}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Alle</option>
            <option value="open">Offen</option>
            <option value="completed">Erledigt</option>
          </select>
        </div>
      </div>
      {(filterProcedure || filterType || filterStatus) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Aktive Filter:</span>
          {filterProcedure && (<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{filterProcedure}</span>)}
          {filterType && (<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{filterType}</span>)}
          {filterStatus && (<span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">{filterStatus === 'open' ? 'Offen' : 'Erledigt'}</span>)}
          <button onClick={() => { setFilterProcedure(''); setFilterType(''); setFilterStatus(''); }} className="text-blue-600 hover:text-blue-800 underline">Alle löschen</button>
        </div>
      )}
    </div>
  )
}
