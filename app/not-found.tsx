import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function NotFoundPage() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4'>
            <div className='text-center'>
                <h1 className='font-bold text-6xl text-primary mb-4 '>404</h1>
                <h2 className='font-semibold text-2xl mb-4'>Page Not Found</h2>
                <p className="mb-8 text-muted-foreground max-w-md  ">
                    The page you are looking for does not exist. It might have been moved or deleted.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 ">
                    <Link href="/" className='flex items-center jc-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors'>
                        <ArrowLeft className='w-4 h-4 mr-2 ' />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
            <footer className="text-muted-foreground text-sm mt-12 text-center">
                If you think this is a mistake, please contact our support team.
            </footer>
        </div>
    )
}

export default NotFoundPage