import dagre from '@dagrejs/dagre'
import { MarkerType } from 'reactflow'
import resolveConfig from 'tailwindcss/resolveConfig'

import tailwindConfig from '@/../tailwind.config'

const { theme: { colors } } = resolveConfig(tailwindConfig)

export function getVulnerabilitiesGraph ({ vulnerabilities }) {
  // console.log(vulnerabilities)
  const g = new dagre.graphlib.Graph()
  g.setGraph({
    rankdir: 'TB',
    ranker: 'network-simplex' // network-simplex, tight-tree, longest-path
  })
  const nodesById = {}
  const edgesById = {
    parent: {},
    enabling: {},
    depending: {}
  }
  vulnerabilities.forEach(vul => {
    g.setNode(vul.id, { ...vul, width: 110, height: 70 })
    vul.parent_vulnerabilities.forEach(pvId => { g.setEdge(pvId, vul.id, { stroke: '#264653' }) })
    vul.enabling_vulnerabilities.forEach(evId => { g.setEdge(evId, vul.id, { stroke: '#2a9d8f' }) })
    vul.depending_vulnerabilities.forEach(dvId => { g.setEdge(vul.id, dvId, { stroke: '#e76f51' }) })
  })
  dagre.layout(g)
  const nodes = g.nodes()
    .map(v => g.node(v))
    .map(d => ({
      id: d.id,
      data: { label: d.name },
      position: { x: d.x, y: d.y }
    }))
  const edges = g.edges()
    .map(v => ({ ...g.edge(v), idSrc: v.v, idTrg: v.w }))
    .map(d => ({
      id: `${d.idSrc}-${d.idTrg}`,
      source: d.idSrc,
      target: d.idTrg,
      style: { stroke: d.stroke, strokeWidth: 5 }
    }))
  // console.log(nodes)
  return {
    nodes,
    edges
  }
}

export function getVulnerabilityConnections ({ vulnerabilitiesById, selectedVulnerability }) {
  const g = new dagre.graphlib.Graph()
  g.setGraph({
    rankdir: 'BT',
    ranker: 'tight-tree' // network-simplex, tight-tree, longest-path
  })
  const nodesById = {}
  const edgesById = {
    childOf: {},
    enabledBy: {},
    impactedBy: {}
  }
  function addVulnerability (id) {
    if (!nodesById[id]) {
      nodesById[id] = {
        id,
        width: 192,
        height: 64
      }
    }
  }
  function addEdge (idSrc, keyType, idTrg) {
    const id = `${idSrc}-${idTrg}`
    if (!edgesById[keyType][id]) {
      edgesById[keyType][id] = [idSrc, idTrg, { id, keyType }]
    }
  }
  function getEdgeLabel (keyType) {
    if (keyType === 'childOf') return 'child_of'
    if (keyType === 'enabledBy') return 'enabled_by'
    if (keyType === 'impactedBy') return 'impacted_by'
  }
  function getEdgeColor (keyType) {
    if (keyType === 'childOf') return colors.sky[600]
    if (keyType === 'enabledBy') return colors.green[600]
    if (keyType === 'impactedBy') return colors.pink[600]
  }
  function visitVulnerability (idVulnerability) {
    addVulnerability(idVulnerability)
    vulnerabilitiesById[idVulnerability].parent_vulnerabilities.forEach(parentId => {
      addVulnerability(parentId)
      addEdge(idVulnerability, 'childOf', parentId)
    })
    vulnerabilitiesById[idVulnerability].child_vulnerabilities.forEach(childId => {
      addVulnerability(childId)
      addEdge(childId, 'childOf', idVulnerability)
    })
    vulnerabilitiesById[idVulnerability].enabling_vulnerabilities.forEach(enablingId => {
      addVulnerability(enablingId)
      addEdge(idVulnerability, 'enabledBy', enablingId)
    })
    vulnerabilitiesById[idVulnerability].enabled_vulnerabilities.forEach(enabledId => {
      addVulnerability(enabledId)
      addEdge(enabledId, 'enabledBy', idVulnerability)
    })
    vulnerabilitiesById[idVulnerability].impacting_vulnerabilities.forEach(impactingId => {
      addVulnerability(impactingId)
      addEdge(idVulnerability, 'impactedBy', impactingId)
    })
    vulnerabilitiesById[idVulnerability].impacted_vulnerabilities.forEach(impactedId => {
      addVulnerability(impactedId)
      addEdge(impactedId, 'impactedBy', idVulnerability)
    })
  }
  visitVulnerability(selectedVulnerability)
  vulnerabilitiesById[selectedVulnerability].parent_vulnerabilities.forEach(id => visitVulnerability(id))
  vulnerabilitiesById[selectedVulnerability].child_vulnerabilities.forEach(id => visitVulnerability(id))
  vulnerabilitiesById[selectedVulnerability].enabling_vulnerabilities.forEach(id => visitVulnerability(id))
  vulnerabilitiesById[selectedVulnerability].enabled_vulnerabilities.forEach(id => visitVulnerability(id))
  vulnerabilitiesById[selectedVulnerability].impacting_vulnerabilities.forEach(id => visitVulnerability(id))
  vulnerabilitiesById[selectedVulnerability].impacted_vulnerabilities.forEach(id => visitVulnerability(id))
  for (const [id, obj] of Object.entries(nodesById)) { g.setNode(id, obj) }
  for (const [idSrc, idTrg, obj] of Object.values(edgesById.childOf)) { g.setEdge(idSrc, idTrg, obj) }
  for (const [idSrc, idTrg, obj] of Object.values(edgesById.enabledBy)) { g.setEdge(idSrc, idTrg, obj) }
  for (const [idSrc, idTrg, obj] of Object.values(edgesById.impactedBy)) { g.setEdge(idSrc, idTrg, obj) }
  dagre.layout(g)
  const nodes = g.nodes()
    .map(v => g.node(v))
    .map(d => {
      return {
        id: d.id,
        type: d.id === selectedVulnerability ? 'selectedNode' : 'node',
        data: {
          label: vulnerabilitiesById[d.id].name,
          width: d.width,
          height: d.height
        },
        position: { x: d.x - d.width / 2, y: d.y - d.height / 2 }
      }
    })
  const edges = g.edges()
    .map(v => ({ ...g.edge(v), source: v.v, target: v.w }))
    .map(d => {
      return {
        id: d.id,
        source: d.source,
        target: d.target,
        label: getEdgeLabel(d.keyType),
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: getEdgeColor(d.keyType)
        },
        type: 'edge',
        style: {
          stroke: getEdgeColor(d.keyType),
          strokeWidth: 2
        }
      }
    })
  return {
    nodes,
    edges
  }
}
