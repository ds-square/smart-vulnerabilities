'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

import { useVulnerabilities } from '@/hooks/data'
import VulnerabilitiesTable from '@/modules/VulnerabilitiesTable'
import VulnerabilityConnectionsGraph from '@/modules/VulnerabilityConnectionsGraph'
import VulnerabilityPane from '@/modules/VulnerabilityPane'

export default function Main () {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const vulnerabilityPar = searchParams.get('vulnerability')
  const updateVulnerabilityPar = useCallback(value => {
    if (value === null) router.push(pathname)
    else {
      const params = new URLSearchParams()
      params.set('vulnerability', value)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [searchParams])
  //
  const vulnerabilities = useVulnerabilities()
  return (
    <div className='flex flex-1'>
      <div className='flex flex-col flex-3'>
        <div className='flex-1 overflow-y-auto'>
          <VulnerabilitiesTable
            vulnerabilities={vulnerabilities}
            selectedVulnerability={vulnerabilityPar}
            selectVulnerability={updateVulnerabilityPar}
          />
        </div>
        <div className='flex flex-1 border-t-2 border-slate-300'>
          {vulnerabilityPar &&
            <VulnerabilityConnectionsGraph
              selectedVulnerability={vulnerabilityPar}
              selectVulnerability={updateVulnerabilityPar}
            />}
        </div>
      </div>
      <div className='overflow-y-auto border-l-2 flex-2 border-slate-300'>
        {vulnerabilityPar &&
          <VulnerabilityPane vulnerability={vulnerabilities[vulnerabilities.map(v => v.id).indexOf(vulnerabilityPar)]} />}
      </div>
    </div>
  )
}
