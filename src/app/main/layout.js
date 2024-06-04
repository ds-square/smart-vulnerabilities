'use client'

import { StoreProvider } from '@/data/store'
import { Suspense } from 'react'

export default function MainLayout ({ children }) {
  return (
    <StoreProvider>
      <Suspense>
        {children}
      </Suspense>
    </StoreProvider>
  )
}
