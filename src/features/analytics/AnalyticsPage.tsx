import { useQuery } from '@tanstack/react-query';
import { FunnelChart } from './components/FunnelChart';
import { RetentionCurve } from './components/RetentionCurve';
import { RetentionHeatmap } from './components/RetentionHeatmap';
import { fetchFunnelData, fetchRetentionData } from '../../shared/api';

function SkeletonBlock({ h = 'h-48' }: { h?: string }) {
  return <div className={`animate-pulse ${h} bg-slate-200 dark:bg-slate-700 rounded-xl`} />;
}

export function AnalyticsPage() {
  const { data: funnelData, isLoading: funnelLoading } = useQuery({
    queryKey: ['funnelData'],
    queryFn: fetchFunnelData,
  });

  const { data: retentionData, isLoading: retentionLoading } = useQuery({
    queryKey: ['retentionData'],
    queryFn: fetchRetentionData,
  });

  return (
    <div className="p-5 space-y-5 min-h-full">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Analytics</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Funnel performance and cohort retention
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {funnelLoading ? (
          <SkeletonBlock h="h-64" />
        ) : (
          funnelData && <FunnelChart data={funnelData} />
        )}
        {retentionLoading ? (
          <SkeletonBlock h="h-64" />
        ) : (
          retentionData && <RetentionCurve data={retentionData} />
        )}
      </div>

      {retentionLoading ? (
        <SkeletonBlock h="h-72" />
      ) : (
        retentionData && <RetentionHeatmap data={retentionData} />
      )}
    </div>
  );
}
