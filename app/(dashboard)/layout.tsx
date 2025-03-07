import BreadcrumHeader from '@/components/BreadcrumHeader'
import DesktopSidebar from '@/components/Sidebar'
import { ModeToggle } from '@/components/ThemeModeToggle'
import { Separator } from '@/components/ui/separator'
import { SignedIn, UserButton } from '@clerk/nextjs'
import React from 'react'

function layout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className='flex h-screen'>
        <DesktopSidebar />
        <div className='flex flex-1 flex-col min-h-screen'>
            <header className='flex items-center justify-between px-6 py-4 h-[50px] container '>
                <BreadcrumHeader />
                <div className='gap-3 flex items-center'>
                    <ModeToggle />
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </header>
            <Separator />
            <div className='overflow-auto'>
                <div className='flex-1 container py-4 text-accent-foreground '>
                    {children}
                </div>
            </div>
        </div>
    </div>
  )
}

export default layout