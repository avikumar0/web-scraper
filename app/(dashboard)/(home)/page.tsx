import { GetPeriod } from '@/actions/analytics/getPeriod';
import React, { Suspense } from 'react'
import PeriodSelector from './_components/PeriodSelector';
import { Period } from '@/types/analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { GetStatsCardsValues } from '@/actions/analytics/getStatsCardsValues';
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from 'lucide-react';
import StatsCard from './_components/StatsCard';
import { GetWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats';
import ExecutionStatusChart from './_components/ExecutionStatusChart';
import { GetCreditUsageInPeriod } from '@/actions/analytics/getCreditUsageInPeriod';
import CreditUsageChart from '../billing/_components/CreditUsageChart';

const HomePage = ({
  searchParams,
}: {
  searchParams: { month?: string, year?: string };
}) => {
  const currentDate = new Date();
  const { month, year } = searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  }
  return (
    <div className='flex flex-col h-full flex-1'>
      <div className='flex justify-between' >
        <h1 className='text-3xl font-bold'>Home</h1>
        <Suspense fallback={
          <Skeleton className="h-40 w-[180px]" />
        }>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="flex flex-col gap-4 py-6 h-full">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className='w-full h-[300px]' />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className='w-full h-[300px]' />}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>

    </div>
  );
}

async function PeriodSelectorWrapper({ selectedPeriod }: { selectedPeriod: Period }) {
  const periods = await GetPeriod();
  return (
    <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />
  );
}

async function StatCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetStatsCardsValues(selectedPeriod);
  return (
    <div className='grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]'>
      <StatsCard
        title="Workflow Executions"
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase Executions"
        value={data.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits Consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  )
}

function StatsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[1,2,3].map((i)=>(
        <Skeleton key={i} className="min-h-[120px] w-full" />
      ))}
    </div>
  )
}

async function StatsExecutionStatus({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetWorkflowExecutionStats(selectedPeriod);
  return (
    <ExecutionStatusChart data={data} />
  )
}

async function CreditsUsageInPeriod({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetCreditUsageInPeriod(selectedPeriod);
  return(
    <CreditUsageChart data={data} title=" Daily Credits Spent" description="Daily credits consumed in the selectedperiod" />
  )
}

export default HomePage