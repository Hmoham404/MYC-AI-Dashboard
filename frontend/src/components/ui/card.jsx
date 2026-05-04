import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return <div className={cn('glass rounded-2xl shadow-glow', className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('p-4 md:p-5', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('font-display text-lg font-bold', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-4 pt-0 md:p-5 md:pt-0', className)} {...props} />;
}
