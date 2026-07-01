export function PageSkeleton() {
  return (
    <div className="p-5 space-y-5 animate-pulse">
      <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
      <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl" />
    </div>
  );
}
