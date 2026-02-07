interface NHDLogoProps {
  variant?: 'horizontal' | 'stacked' | 'symbol'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function NHDLogo({ variant = 'horizontal', size = 'md', className = '' }: NHDLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }

  const symbolSizes = {
    sm: 20,
    md: 24,
    lg: 32
  }

  const renderSymbol = () => (
    <svg 
      width={symbolSizes[size]} 
      height={symbolSizes[size]} 
      viewBox="0 0 24 24" 
      className={`${sizeClasses[size]} flex-shrink-0`}
    >
      <defs>
        <linearGradient id="diamond-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#667eea', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#764ba2', stopOpacity:1}} />
        </linearGradient>
      </defs>
      <path 
        d="M 12 2 L 20 12 L 12 22 L 4 12 Z" 
        fill="url(#diamond-gradient)"
        className="animate-pulse-brand"
      />
    </svg>
  )

  if (variant === 'symbol') {
    return (
      <div className={`${className}`}>
        {renderSymbol()}
      </div>
    )
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {renderSymbol()}
        <div className="mt-2 text-center">
          <div className={`font-bold text-gray-900 ${textSizes[size]}`}>
            North Head
          </div>
          <div className={`font-bold text-gray-900 ${textSizes[size]}`}>
            Digital
          </div>
        </div>
      </div>
    )
  }

  // Horizontal variant (default)
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {renderSymbol()}
      <div>
        <div className={`font-bold text-gray-900 ${textSizes[size]}`}>
          North Head Digital
        </div>
        <div className="text-xs text-gray-500">
          Client Portal
        </div>
      </div>
    </div>
  )
}
