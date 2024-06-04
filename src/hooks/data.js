import bibtexParser from '@orcid/bibtex-parse-js'
import Cite from 'citation-js'

import { useState } from '@/data/store'

export function useData () {
  const state = useState()
  return state.data
}

export function useTimeSpan () {
  const {
    toolsById, toolsIds,
    referencesById, referencesIds,
    attacksById, attacksIds
  } = useData()
  let minYear = null
  let maxYear = null
  toolsIds.forEach(id => {
    if (toolsById[id].year && (!minYear || toolsById[id].year < minYear)) minYear = toolsById[id].year
    if (toolsById[id].year && (!maxYear || toolsById[id].year > maxYear)) maxYear = toolsById[id].year
    // if (toolsById[id].year && (toolsById[id].year < 2008 || toolsById[id].year > 2024)) console.log(toolsById[id])
  })
  referencesIds.forEach(id => {
    if (referencesById[id].year && (!minYear || referencesById[id].year < minYear)) minYear = referencesById[id].year
    if (referencesById[id].year && (!maxYear || referencesById[id].year > maxYear)) maxYear = referencesById[id].year
    // if (referencesById[id].year && (referencesById[id].year < 2008 || referencesById[id].year > 2024)) console.log(referencesById[id])
  })
  attacksIds.forEach(id => {
    if (attacksById[id].year && (!minYear || attacksById[id].year < minYear)) minYear = attacksById[id].year
    if (attacksById[id].year && (!maxYear || attacksById[id].year > maxYear)) maxYear = attacksById[id].year
    // if (attacksById[id].year && (attacksById[id].year < 2008 || attacksById[id].year > 2024)) console.log(attacksById[id])
  })
  return { minYear, maxYear }
}

export function useVulnerabilities () {
  const {
    vulnerabilitiesIds, vulnerabilitiesById,
    levelsById,
    categoriesById,
    mitigationsById,
    cwesById,
    swcsById,
    toolsById,
    referencesById,
    attacksById
  } = useData()
  const { minYear, maxYear } = useTimeSpan()
  function getTimeView (vulnerability) {
    const yearsById = {}
    let year = minYear
    while (year <= maxYear) {
      yearsById[year] = {
        year,
        references: 0,
        tools: 0,
        attacks: 0
      }
      year++
    }
    vulnerability.references.forEach(ref => { if (ref.year) yearsById[ref.year].references++ })
    vulnerability.tools.forEach(ref => { if (ref.year) yearsById[ref.year].tools++ })
    vulnerability.attacks.forEach(ref => { if (ref.year) yearsById[ref.year].attacks++ })
    return Object.values(yearsById).sort((a, b) => a.year - b.year)
  }
  return vulnerabilitiesIds.map(id => {
    const vul = vulnerabilitiesById[id]
    const vulnerability = {
      ...vul,
      level: levelsById[vul.level],
      categories: vul.categories.map(id => categoriesById[id]),
      mitigations: vul.mitigations.map(id => mitigationsById[id]),
      cwes: vul.cwes.map(id => cwesById[id]),
      swcs: vul.swcs.map(id => swcsById[id]),
      tools: vul.tools.map(id => ({
        ...toolsById[id],
        references: toolsById[id].references.map(refId => ({
          ...referencesById[refId],
          bibtexJson: bibtexParser.toJSON(referencesById[refId].bibtex)[0],
          citation: Cite(referencesById[refId].bibtex).format('citation')
        })).sort((a, b) => b.year - a.year)
      })),
      references: vul.references.map(ref => ({
        ...referencesById[ref.ref_id],
        alias: ref.alias,
        bibtexJson: bibtexParser.toJSON(referencesById[ref.ref_id].bibtex)[0],
        citation: Cite(referencesById[ref.ref_id].bibtex).format('citation')
      })).sort((a, b) => b.year - a.year),
      attacks: vul.attacks.map(id => ({
        ...attacksById[id],
        references: attacksById[id].references.map(refId => ({
          ...referencesById[refId],
          bibtexJson: bibtexParser.toJSON(referencesById[refId].bibtex)[0],
          citation: Cite(referencesById[refId].bibtex).format('citation')
        })).sort((a, b) => b.year - a.year)
      }))
    }
    vulnerability.timeView = getTimeView(vulnerability)
    return vulnerability
  })
}
