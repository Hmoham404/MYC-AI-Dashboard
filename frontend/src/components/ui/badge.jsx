import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground',
        className
      )}
    >
      {children}
    </span>
  );
}
