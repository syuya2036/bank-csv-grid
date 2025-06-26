'use client';
import * as React from 'react';

/** Tailwind のユーティリティ結合（存在しなければ単純連結） */
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/** 最小 Input ラッパー */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'border rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-400',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
