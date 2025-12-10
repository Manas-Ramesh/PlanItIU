import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Button({ children, variant = 'default', size = 'md', className = '', ...props }: ButtonProps) {
  const baseClasses = 'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Only apply variant classes if className doesn't override colors
  const hasColorOverride = className.includes('bg-') || className.includes('text-')
  const variantClasses = hasColorOverride ? '' : {
    default: 'bg-gray-900 text-white hover:bg-gray-800 border-0',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border-0'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const variantClass = typeof variantClasses === 'string' ? variantClasses : variantClasses[variant]
  
  return (
    <button
      className={`${baseClasses} ${variantClass} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

