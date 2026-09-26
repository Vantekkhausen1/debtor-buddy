import { useState, useMemo } from 'react'
import { useClaimsStore } from '../store/useClaimsStore'
import { formatCurrency, getProcedureColor } from '../utils/dataLoader'
import { Claim } from '../types'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, flexRender, ColumnDef } from '@tanstack/react-table'
import { ChevronUp, ChevronDown, ChevronsUpDown, Eye } from 'lucide-react'

interface ClaimsTableProps { onSelectClaim: (az: string) => void; }

export default function ClaimsTable({ onSelectClaim }: ClaimsTableProps) {
  const filteredClaims = useClaimsStore((state) => state.filteredClaims)
  const updateClaim = useClaimsStore((state) => state.updateClaim)
  const [sorting, setSorting] = useState([])

  const columns: ColumnDef<Claim>[] = useMemo(() => [
    { accessorKey: 'AZ', header: 'AZ', cell: ({ row }) => <span className="font-mono font-semibold">{row.getValue('AZ')}</span> },
    { accessorKey: 'Name1', header: 'Gläubiger', cell: ({ row }) => (
      <div><div className="font-medium">{row.getValue('Name1')}</div><div className="text-xs text-gray-500 truncate max-w-xs">{row.original.Betreff}</div></div>
    )},
    { accessorKey: 'V_Name1', header: 'Inkasso', cell: ({ row }) => <div className="text-sm">{row.getValue('V_Name1')}</div> },
    { accessorKey: 'Gesamtforderung', header: 'Gesamt', cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.getValue('Gesamtforderung'))}</span> },
    { accessorKey: 'Verfahrensstand', header: 'Verfahren', cell: ({ row }) => (
      <span className={`px-2 py-1 rounded-full text-xs ${getProcedureColor(row.getValue('Verfahrensstand'))}`}>{row.getValue('Verfahrensstand')}</span>
    )},
    { accessorKey: 'Erledigt', header: 'Status', cell: ({ row }) => {
      const isDone = row.getValue('Erledigt')
      return (
        <button onClick={(e) => { e.stopPropagation(); updateClaim(row.original.AZ, { Erledigt: !isDone }) }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${isDone ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-orange-100 text-orange-800 hover:bg-orange-200'}`}>
          {isDone ? '✓ Erledigt' : '○ Offen'}
        </button>
      )
    }},
    { id: 'actions', header: '', cell: ({ row }) => (
      <button onClick={(e) => { e.stopPropagation(); onSelectClaim(row.original.AZ) }} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-xs font-medium">
        <Eye className="w-3.5 h-3.5" /> Details
      </button>
    )},
  ], [updateClaim, onSelectClaim])

  const table = useReactTable({
    data: filteredClaims, columns, state: { sorting }, onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  })

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={header.column.getToggleSortingHandler()}>
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' && <ChevronUp className="w-4 h-4" />}
                      {header.column.getIsSorted() === 'desc' && <ChevronDown className="w-4 h-4" />}
                      {header.column.getIsSorted() === false && <ChevronsUpDown className="w-4 h-4" />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectClaim(row.original.AZ)}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-700">Seite {table.getState().pagination.pageIndex + 1} von {table.getPageCount()}</div>
        <div className="flex gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Zurück</button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Weiter</button>
        </div>
      </div>
    </div>
  )
}
