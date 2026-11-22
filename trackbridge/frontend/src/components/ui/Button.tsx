import type { ButtonHTMLAttributes } from 'react';

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg bg-pine px-4 py-2 text-sm font-semibold text-parchment hover:bg-moss disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
