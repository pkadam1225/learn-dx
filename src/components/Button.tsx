import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-2xl font-medium transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        bg-[#1f273d] text-blue-400 hover:bg-[#2a324a] hover:text-blue-300
        ${className}`}
    >
      {children}
    </button>
  );
}