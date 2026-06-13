import { useState, useRef, useEffect, type ReactNode } from 'react';
import { clsx } from 'clsx';

type Placement = 'top' | 'bottom' | 'left' | 'right';

interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  placement?: Placement;
}

const PLACEMENT_CLASSES: Record<Placement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Popover({ trigger, content, placement = 'bottom' }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggle = () => {
    const next = !isOpen;
    console.log('[Popover] toggled, isOpen:', next);
    setIsOpen(next);
  };

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={toggle} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={clsx(
            'absolute z-20 min-w-[160px] bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/50 rounded-lg shadow-lg p-3 text-sm text-slate-700 dark:text-slate-200',
            PLACEMENT_CLASSES[placement],
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
