import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'icon' | 'full'
  className?: string
}

export default function Logo({ size = 'md', variant = 'icon', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  if (variant === 'icon') {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
        <img
          src="/planitlogo.jpeg"
          alt="PlanItIU Logo"
          className="w-full h-full object-contain"
          style={{ display: 'block' }}
        />
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className={sizeClasses[size]}>
        <img
          src="/planitlogo.jpeg"
          alt="PlanItIU Logo"
          className="w-full h-full object-contain"
          style={{ display: 'block' }}
        />
      </div>
      <span className={`font-bold text-gray-800 ${textSizes[size]}`} style={{ color: '#1e293b' }}>
        PlanItIU
      </span>
    </div>
  )
}

