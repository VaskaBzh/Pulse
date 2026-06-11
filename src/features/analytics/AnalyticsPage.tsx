import { useEffect } from 'react';
import { funnelData, retentionData } from '../../shared/data/mockData';
import { FunnelChart } from './components/FunnelChart';
import { RetentionHeatmap } from './components/RetentionHeatmap';
import { RetentionCurve } from './components/RetentionCurve';

export function AnalyticsPage() {
  useEffect(() => {
    console.log('[Analytics] page mounted, data points:', retentionData.length);
  }, []);

  return (
    <div className="p-5 space-y-5 min-h-full">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Analytics</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Funnel performance and cohort retention</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FunnelChart data={funnelData} />
        <RetentionCurve data={retentionData} />
      </div>

      <RetentionHeatmap data={retentionData} />
    </div>
  );
}
