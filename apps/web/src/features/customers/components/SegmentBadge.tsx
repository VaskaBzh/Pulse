import { clsx } from 'clsx';
import type { Customer } from '../../../shared/types';

const SEGMENT_STYLES: Record<Customer['segment'], string> = {
  Enterprise: 'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/25',
  Pro: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/25',
  Starter: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/25',
};

interface SegmentBadgeProps {
  segment: Customer['segment'];
}

export function SegmentBadge({ segment }: SegmentBadgeProps) {
  return (
    <span
      className={clsx(
        'text-[11px] font-semibold px-2.5 py-1 rounded-full',
        SEGMENT_STYLES[segment],
      )}
    >
      {segment}
    </span>
  );
}
