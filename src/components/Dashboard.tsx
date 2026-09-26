import { useClaimsStore } from '../store/useClaimsStore'
import { formatCurrency } from '../utils/dataLoader'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FileText, CheckCircle, Clock, Euro } from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function Dashboard() {
  const getStats = useClaimsStore((state) => state.getStats)
  const stats = getStats()
  const procedureData = Object.entries(stats.byProcedure).map(([name, value]) => ({ name, value }))
  const creditorData = Object.entries(stats.byCreditor).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600">Gesamt Forderungen</p><p className="text-2xl font-bold">{stats.totalClaims}</p></div>
            <FileText className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600">Offen</p><p className="text-2xl font-bold text-orange-600">{stats.openClaims}</p></div>
            <Clock className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600">Erledigt</p><p className="text-2xl font-bold text-green-600">{stats.completedClaims}</p></div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600">Gesamtsumme</p><p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p></div>
            <Euro className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Verfahrensstand</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={procedureData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} outerRadius={80} fill="#8884d8" dataKey="value">
                {procedureData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Gläubiger</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={creditorData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Forderungsarten</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="bg-gray-50 rounded p-3">
              <p className="text-sm text-gray-600 truncate">{type}</p>
              <p className="text-xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
