import { useCallback } from 'react'
import { useToast } from '../contexts/ToastContext'

interface ApiError {
  success: false
  message: string
  type: string
  timestamp: string
  path?: string
  details?: any
}

interface ErrorHandlerOptions {
  showToast?: boolean
  logError?: boolean
  fallbackMessage?: string
}

export const useErrorHandler = () => {
  const { showToast } = useToast()

  const handleError = useCallback((
    error: any,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast: shouldShowToast = true,
      logError: shouldLogError = true,
      fallbackMessage = 'An unexpected error occurred'
    } = options

    // Log error for debugging
    if (shouldLogError) {
      console.error('Error handled:', {
        error,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }

    let message = fallbackMessage
    let type = 'UNKNOWN_ERROR'

    // Handle different error types
    if (error?.response?.data) {
      // API error response
      const apiError: ApiError = error.response.data
      message = apiError.message || fallbackMessage
      type = apiError.type || 'API_ERROR'
    } else if (error?.message) {
      // Standard Error object
      message = error.message
      type = 'CLIENT_ERROR'
    } else if (typeof error === 'string') {
      // String error
      message = error
      type = 'STRING_ERROR'
    } else if (error?.networkError) {
      // Network error
      message = 'Network error. Please check your connection.'
      type = 'NETWORK_ERROR'
    } else if (error?.code === 'NETWORK_ERROR') {
      // Axios network error
      message = 'Unable to connect to the server. Please try again.'
      type = 'NETWORK_ERROR'
    }

    // Show user-friendly toast notification
    if (shouldShowToast) {
      showToast(message, 'error')
    }

    return {
      message,
      type,
      originalError: error
    }
  }, [showToast])

  const handleApiError = useCallback((error: any) => {
    return handleError(error, {
      showToast: true,
      logError: true,
      fallbackMessage: 'Failed to process request'
    })
  }, [handleError])

  const handleNetworkError = useCallback((error: any) => {
    return handleError(error, {
      showToast: true,
      logError: true,
      fallbackMessage: 'Network connection failed'
    })
  }, [handleError])

  const handleValidationError = useCallback((error: any) => {
    return handleError(error, {
      showToast: true,
      logError: true,
      fallbackMessage: 'Please check your input and try again'
    })
  }, [handleError])

  const handleAuthError = useCallback((error: any) => {
    return handleError(error, {
      showToast: true,
      logError: true,
      fallbackMessage: 'Authentication failed'
    })
  }, [handleError])

  const handleSilentError = useCallback((error: any) => {
    return handleError(error, {
      showToast: false,
      logError: true,
      fallbackMessage: 'Silent error occurred'
    })
  }, [handleError])

  return {
    handleError,
    handleApiError,
    handleNetworkError,
    handleValidationError,
    handleAuthError,
    handleSilentError
  }
}

export default useErrorHandler
