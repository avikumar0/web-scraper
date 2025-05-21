import React, { Suspense } from 'react'
import Topbar from '../../_components/topbar/Topbar'
import { GetWorkflowExecutions } from '@/actions/workflows/getWorkflowExecutions';
import { InboxIcon, Loader2Icon } from 'lucide-react';
import ExecutionsTable from './_components/ExecutionsTable';

export default function ExecutionsPage({ params }: { params: { workflowId: string } }) {
  return (
    <div className='w-full h-full overflow-auto '>
      <Topbar workflowId={params.workflowId} title='All Runs' subtitle='List of all your workflow executions' hideButtons />

      <Suspense
        fallback={
          <div className='flex items-center justify-center w-full h-full'>
            <Loader2Icon size={30} className='animate-spin stroke-primary' />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  )
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);
  if (!executions) {
    return <div className='p-4'>No executions found</div>
  }
  if (executions.length === 0) {
    return (
      <div className='py-6 w-full container'>
        <div className="h-full flex flex-col items-center justify-center gap-2 w-full">
          <div className="flex items-center justify-center rounded-full bg-accent w-20 h-20">
            <InboxIcon size={40} className='stroke-primary' />
          </div>
          <div className='flex flex-col text-center'>
            <p className="font-bold">
              No runs has been triggerd yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can triggger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='container w-full py-6'>
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  )
}
