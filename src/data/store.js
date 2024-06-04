import { useState as useStateReact } from 'react'
import { createContainer } from 'react-tracked'

import data from './out.json'

function parseData () {
  const d = {}
  const entityKeys = Object.keys(data)
  for (const k of entityKeys) {
    d[`${k}Ids`] = data[k].map(e => e.id)
    d[`${k}ById`] = {}
    data[k].forEach(e => {
      d[`${k}ById`][e.id] = e
      if (k === 'vulnerabilities') {
        d[`${k}ById`][e.id].child_vulnerabilities = []
        d[`${k}ById`][e.id].enabled_vulnerabilities = []
        d[`${k}ById`][e.id].impacted_vulnerabilities = []
      }
    })
  }
  data.vulnerabilities.forEach(e => {
    e.parent_vulnerabilities.forEach(pvId => { d.vulnerabilitiesById[pvId].child_vulnerabilities.push(e.id) })
    e.enabling_vulnerabilities.forEach(evId => { d.vulnerabilitiesById[evId].enabled_vulnerabilities.push(e.id) })
    e.impacting_vulnerabilities.forEach(dvId => { d.vulnerabilitiesById[dvId].impacted_vulnerabilities.push(e.id) })
  })
  return d
}

export const initialState = {
  data: parseData()
}

const useValue = () => useStateReact(initialState)

export const {
  Provider: StoreProvider,
  useTrackedState: useState,
  useUpdate: useSetState
} = createContainer(useValue)
