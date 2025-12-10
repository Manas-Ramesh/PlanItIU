import React from 'react'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  className?: string
}

export function Progress({ value, className = '', ...props }: ProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100)
  
  return (
    <div
      className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="bg-red-600 h-full transition-all duration-300 ease-out"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  )
}
