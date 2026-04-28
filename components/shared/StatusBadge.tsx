import React from 'react';
import { STATUS_CONFIG, EntityStatus } from '@/lib/table-utils';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: EntityStatus | string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as EntityStatus] || STATUS_CONFIG.inactive;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider",
      config.bg,
      config.text,
      config.border,
      className
    )}>
      <div className="relative flex h-1.5 w-1.5">
        {config.animated && (
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            config.dot
          )} />
        )}
        <span className={cn(
          "relative inline-flex rounded-full h-1.5 w-1.5",
          config.dot
        )} />
      </div>
      {config.label}
    </div>
  );
}
