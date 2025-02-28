import { cn } from '@/lib/utils'
import { SquareMousePointer } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Logo({fontSize='text-2xl', iconSize=20}: Readonly<{fontSize?: string, iconSize?: number}>) {
  return (
    <Link href='/' className={cn('text-2xl flex items-center gap-2 font-extrabold', fontSize)}>
        <div className='rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 p-2'>
            <SquareMousePointer size={iconSize} 
            className='stroke-white'
            />
        </div>
        <div className=''>
            <span className='bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent'>Scraper </span>
            <span className='text-stone-700 dark:text-stone-300 '>Flow</span>
        </div>
    </Link>
  )
}

export default Logo