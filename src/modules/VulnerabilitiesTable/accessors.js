export function accessorVulnerability (row) {
  return row.name
}

export function accessorLevel (row) {
  return row.level
}

export function accessorCategories (row) {
  return row.categories.map(c => `\u2022 ${c.name}`)
}

export function accessorMitigations (row) {
  return row.mitigations.map(m => `\u2022 ${m.name}`)
}

export function accessorCwes (row) {
  return row.cwes.map(c => `CWE-${c.weakness_id}`)
}

export function accessorSwcs (row) {
  return row.swcs.map(s => `SWC-${s.weakness_id}`)
}

export function accessorTimeView (row) {
  return row.timeView
}
