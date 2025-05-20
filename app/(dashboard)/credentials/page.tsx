import React, { Suspense } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { GetCredentialsForUser } from '@/actions/credentials/getCredentialsForUser'
import { Card } from '@/components/ui/card'
import CreateCredentialDialog from './_components/CreateCredentialDialog'
import { formatDistanceToNow } from 'date-fns'
import DeleteCredentialDialog from './_components/DeleteCredentialDialog'


export default function CredentialsPage() {
    return (
        <div className='flex flex-1 flex-col h-full'>
            <div className="flex justify-between">
                <div className='flex flex-col'>
                    <h1 className="text-3xl font-bold">Credentials</h1>
                    <p className="text-muted-foreground">Manage your credentials here.</p>
                </div>
                <CreateCredentialDialog  />
            </div>
            <div className="h-full py-6 space-y-8">
                <Alert>
                    <ShieldIcon className="h-4 w-4 stroke-primary" />
                    <AlertTitle className='text-primary'>Encyption</AlertTitle>
                    <AlertDescription>
                        All Information is securely encypted ,ensuring your data is safe and private.
                    </AlertDescription>
                </Alert>
                <Suspense fallback={<Skeleton className='h-[300px] w-full' />} >
                    <UserCredentials />
                </Suspense>
            </div>
        </div>
    )
}


async function UserCredentials() {
    const credentials = await GetCredentialsForUser();
    if (!credentials) {
        return (
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">No Credentials Found</h2>
                <p className="text-muted-foreground">You have not added any credentials yet.</p>
            </div>
        )
    }

    if (credentials.length === 0) {
        return (
            <Card className='w-full p-4'>
                <div className='flex flex-col gap-4 items-center justify-center'>
                    <div className='rounded-full flex justify-center items-center bg-accent w-20 h-20'>
                        <ShieldOffIcon size={40} className=" stroke-primary" />
                    </div>
                    <div className='flex flex-col gap-2 items-center'>
                        <p className='font-bold'>No Credentials Created Yet</p>
                        <p className='text-sm text-muted-foreground'>Click the button below to create first credential</p>
                    </div>
                    <CreateCredentialDialog triggerText='Create Your first Credential' />
                </div>
            </Card>
        )
    }
    return (
        <div className='flex gap-2 flex-wrap' >
            {credentials.map((credential)=>{
                const createdAt = formatDistanceToNow(credential.createdAt,{
                    addSuffix:true,
                })
                return (
                    <Card key={credential.id} className='w-full p-4 flex justify-between' >
                        <div className="flex gap-2 items-center">
                            <div className="rounded-full flex h-8 w-8 justify-center items-center bg-primary/10">
                                <LockKeyholeIcon size={16} className="stroke-primary" />
                            </div>
                            <div className="">
                                <p className='font-bold'>{credential.name}</p>
                                <p className='text-xs text-muted-foreground'>{createdAt}</p>
                            </div>
                        </div>
                        <DeleteCredentialDialog name={credential.name} />
                    </Card>
                )
            })}
        </div>  
    )
}