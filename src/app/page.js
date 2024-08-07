import Link from 'next/link'

export default function Home () {
  return (
    <div className='flex flex-col items-center justify-center w-full text-lg'>
      <h1 className='pb-4 text-2xl font-bold text-center text-emerald-800'>SoK: A Unified Data Model for<br />Smart Contract Vulnerability Taxonomies</h1>
      <h2 className='text-lg font-bold text-slate-400'><a href="https://doi.org/10.1145/3664476.3664507">DOI: 10.1145/3664476.3664507</a></h2>
      <h2 className='text-lg font-bold text-slate-400'>Claudia Ruggiero, Pietro Mazzini, Emilio Coppa, Simone Lenti, Silvia Bonomi</h2>
      <h2 className='text-lg font-bold text-slate-400'>ARES 2024</h2>
      <img className='py-10 w-96' src='data-model.png' alt='Data model' />
      <Link href='/main' target='_blank' rel='noreferrer' className='p-2 m-1 border hover:bg-slate-100'>Visualization platform</Link>
      <Link href='https://github.com/ds-square/smartbugs-orchestrator' target='_blank' rel='noreferrer' className='p-2 m-1 border hover:bg-slate-100'>SmartBugs orchestrator</Link>
      <Link href='https://github.com/ds-square/smart-vulnerabilities/blob/main/SoK__A_Unified_Data_Model_for_Smart_Contract_Vulnerability_Taxonomies_NEW.pdf' target='_blank' rel='noreferrer' className='p-2 m-1 border hover:bg-slate-100'>Technical report</Link>
    </div>
  )
}
