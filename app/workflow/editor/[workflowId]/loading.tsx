import { Loader2Icon } from 'lucide-react'
import React from 'react'

function loading() {
  return (
    <div className='flex h-screen items-center justify-center w-full'>
        <Loader2Icon size={30} className='animate-spin stroke-primary' />
    </div>
  )
}

export default loading