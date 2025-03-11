import { GetWorkflowsForUser } from '@/actions/workflows/getWorkflowsforUser'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { waitFor } from '@/lib/helper/waitFor'
import { AlertCircle, InboxIcon, User } from 'lucide-react'
import React, { Suspense } from 'react'
import CreateWorkflowDialog from './_components/CreateWorkflowDialog'

function page() {
  return (
    <div className='flex flex-1 flex-col h-full'>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">WorkFlows</h1>
          <p className="text-muted-foreground">Mange your workflows</p>
        </div>
        <CreateWorkflowDialog  />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  )
}

export default page


function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {
        [1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))
      }
    </div>
  )
}

async function UserWorkflows() {
  const workflows = await GetWorkflowsForUser();

  if (!workflows) {
    return (
      <Alert variant="destructive" >
        <AlertCircle className="w-6 h-6 mr-2" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong. Please try agin later</AlertDescription>
      </Alert>
    )
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center justify-center ">
        <div className='rounded-full bg-accent w-20 h-20 flex items-center justify-center'>
          <InboxIcon className='stroke-primary' size={40} />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No Workflow created yet</p>
          <p className="text-sm text-muted-foreground">Click below button to create your first workflow</p>
        </div>
        <CreateWorkflowDialog triggerText="Create your first Workflow " />
      </div>
    )
  }

  return (
    <div>
      User Workflows
    </div>
  )
}