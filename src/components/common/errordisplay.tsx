import { AlertCircle, X, Info, AlertTriangle } from 'lucide-react'
import { ErrorMessage } from '../../utils/errormessages'

interface ErrorDisplayProps {
  error: ErrorMessage | null
  onDismiss?: () => void
  className?: string
}

export default function ErrorDisplay({ error, onDismiss, className = '' }: ErrorDisplayProps) {
  if (!error) return null

  const getIcon = () => {
    switch (error.type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStyles = () => {
    switch (error.type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div className={`${getStyles()} border px-4 py-3 rounded-lg ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{error.title}</h4>
          <p className="mb-2">{error.message}</p>
          {error.action && (
            <p className="text-sm opacity-90">{error.action}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
