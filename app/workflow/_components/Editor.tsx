"use client";

import { Workflow } from '@prisma/client';
import React from 'react'
import { ReactFlowProvider} from '@xyflow/react';

function Editor({workflow}:{workflow:Workflow}) {
  return (
    <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
            <section className='flex h-full overflow-auto'>
                Flow Editor Component
            </section>
        </div>
    </ReactFlowProvider>
  )
}

export default Editor