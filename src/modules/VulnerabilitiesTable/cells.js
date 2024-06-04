import { useMemo } from 'react'
import classNames from 'classnames'
import { scaleBand } from 'd3-scale'

import useChartDimensions from '@/hooks/useChartDimensions'

export function MultilineCell ({ value }) {
  return (
    <div className='flex flex-col'>
      {value.map(v => <div key={v}>{v}</div>)}
    </div>
  )
}

export function ImageCell ({ src, alt, className }) {
  return (
    <div className={classNames('h-8 p-1 flex justify-center bg-white', className)}>
      <img className='object-contain h-full' src={src} alt={alt} />
    </div>
  )
}

const timeViewChartSettings = {
  marginLeft: 1,
  marginTop: 1,
  marginRight: 1,
  marginBottom: 15
}

const timeViewTypes = ['references', 'tools', 'attacks']

function timeViewColors ({ viewType, entryValue }) {
  if (entryValue === 0) return 'none'
  if (viewType === 'references') return '#377eb8'
  if (viewType === 'tools') return '#4daf4a'
  if (viewType === 'attacks') return '#e41a1c'
}

export function AxisBottom ({ dms, scale }) {
  return (
    <g transform={`translate(0, ${dms.boundedHeight})`}>
      {scale.domain().map(t => (
        <text key={t} transform={`translate(${scale(t) + scale.bandwidth() / 2}, 15)`} className='text-xs fill-slate-600' style={{ textAnchor: 'middle' }}>
          {`'${t.toString().slice(2)}`}
        </text>
      ))}
    </g>
  )
}

export function TimeViewHeader () {
  return (
    <div className='flex flex-col text-sm'>
      <div className='flex items-center'>
        <div className='w-4 h-4' style={{ background: timeViewColors({ viewType: 'references', entryValue: 1 }) }} />
        <div className='pl-2'>References</div>
      </div>
      <div className='flex items-center'>
        <div className='w-4 h-4' style={{ background: timeViewColors({ viewType: 'tools', entryValue: 1 }) }} />
        <div className='pl-2'>Tools</div>
      </div>
      <div className='flex items-center'>
        <div className='w-4 h-4' style={{ background: timeViewColors({ viewType: 'attacks', entryValue: 1 }) }} />
        <div className='pl-2'>Attacks</div>
      </div>
    </div>
  )
}

export function TimeViewCell ({ value }) {
  const [ref, dms] = useChartDimensions(timeViewChartSettings)
  const xScale = useMemo(() => (
    scaleBand()
      .domain(value.map(v => v.year))
      .range([0, dms.boundedWidth])
      .paddingInner(0.15)
  ), [dms.width])
  const yScale = useMemo(() => (
    scaleBand()
      .domain(timeViewTypes)
      .range([0, dms.boundedHeight])
      .paddingInner(0.15)
  ), [dms.height])
  return (
    <div ref={ref} className='h-20 my-1 w-52'>
      <svg width={dms.width} height={dms.height}>
        <AxisBottom dms={dms} scale={xScale} />
        <g transform={`translate(${[
          dms.marginLeft,
          dms.marginTop
        ].join(',')})`}
        >
          {value.map(v => (timeViewTypes.map(t => (
            <rect
              key={`${v.year}-${t}`}
              x={xScale(v.year)}
              y={yScale(t)}
              width={xScale.bandwidth()}
              height={yScale.bandwidth()}
              fill={timeViewColors({ viewType: t, entryValue: v[t] })}
              className='stroke-slate-400'
            />
          ))))}
        </g>
      </svg>
    </div>
  )
}
