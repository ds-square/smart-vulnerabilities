import { useState } from 'react'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'

import { getVulnerabilitiesGraph } from '@/data/graphs'
import useChartDimensions from '@/hooks/useChartDimensions'

const chartSettings = {
  marginLeft: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0
}

export default function VulnerabilitiesGraph ({ vulnerabilities }) {
  const [ref, dms] = useChartDimensions(chartSettings)
  const [graph, setGraph] = useState(getVulnerabilitiesGraph({ vulnerabilities }))
  return (
    <div ref={ref} className='flex-1'>
      <div style={{ width: dms.width, height: dms.height }}>
        {dms.height > 0 &&
          <ReactFlow
            nodes={graph.nodes}
            edges={graph.edges}
            minZoom={0.05}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>}
      </div>
    </div>
  )
}
