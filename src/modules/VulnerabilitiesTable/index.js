import { useState } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import classNames from 'classnames'

import { getLevelImage } from '@/utils'
import TableHeadSort from '@/components/TableHeadSort'
import { accessorCategories, accessorCwes, accessorLevel, accessorMitigations, accessorSwcs, accessorTimeView, accessorVulnerability } from './accessors'
import { ImageCell, MultilineCell, TimeViewCell, TimeViewHeader } from './cells'

const columnHelper = createColumnHelper()
const columns = [
  columnHelper.accessor(accessorLevel, {
    id: 'level',
    header: 'Level',
    cell: v => <ImageCell src={getLevelImage(v.getValue().id)} alt={v.getValue().name} />
  }),
  columnHelper.accessor(accessorVulnerability, {
    id: 'vulnerability',
    header: 'Vulnerability',
    cell: v => v.getValue()
  }),
  columnHelper.accessor(accessorCategories, {
    id: 'categories',
    header: 'Categories',
    cell: v => <MultilineCell value={v.getValue()} />
  }),
  columnHelper.accessor(accessorCwes, {
    id: 'cwes',
    header: _ => <div className='w-20 text-start'>CWEs</div>,
    cell: v => <MultilineCell value={v.getValue()} />
  }),
  columnHelper.accessor(accessorSwcs, {
    id: 'swcs',
    header: <div className='w-20 text-start'>SWCs</div>,
    cell: v => <MultilineCell value={v.getValue()} />
  }),
  columnHelper.accessor(accessorMitigations, {
    id: 'mitigations',
    header: 'Mitigations',
    cell: v => <MultilineCell value={v.getValue()} />
  }),
  columnHelper.accessor(accessorTimeView, {
    id: 'timeView',
    header: _ => <TimeViewHeader />,
    cell: v => <TimeViewCell value={v.getValue()} />
  })
]

export default function VulnerabilitiesTable ({ vulnerabilities, selectedVulnerability, selectVulnerability }) {
  const [sorting, setSorting] = useState([{ id: 'vulnerability', desc: false }])

  const table = useReactTable({
    data: vulnerabilities,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting
  })
  return (
    <table>
      <TableHeadSort headerGroups={table.getHeaderGroups()} />
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr
            key={row.id}
            className={classNames('border-y border-slate-300',
              selectedVulnerability === row.original.id && 'bg-slate-600 text-slate-100'
            )}
            onClick={() => selectVulnerability(selectedVulnerability === row.original.id ? null : row.original.id)}
          >
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className='px-2 cursor-pointer'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
