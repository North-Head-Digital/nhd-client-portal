/**
 * Centralized error messages for better user experience
 * Provides specific, actionable error messages instead of generic ones
 */

export interface ErrorMessage {
  title: string
  message: string
  action?: string
  type: 'error' | 'warning' | 'info'
}

export const ERROR_MESSAGES = {
  // Authentication Errors
  AUTH: {
    INVALID_CREDENTIALS: {
      title: 'Login Failed',
      message: 'The email or password you entered is incorrect. Please check your credentials and try again.',
      action: 'Forgot your password? Contact support for assistance.',
      type: 'error' as const
    },
    ACCOUNT_LOCKED: {
      title: 'Account Temporarily Locked',
      message: 'Your account has been temporarily locked due to multiple failed login attempts. Please wait 15 minutes before trying again.',
      action: 'Contact support if you need immediate access.',
      type: 'warning' as const
    },
    TOKEN_EXPIRED: {
      title: 'Session Expired',
      message: 'Your session has expired for security reasons. Please log in again to continue.',
      action: 'Click here to log in again.',
      type: 'info' as const
    },
    NETWORK_ERROR: {
      title: 'Connection Problem',
      message: 'Unable to connect to our servers. Please check your internet connection and try again.',
      action: 'If the problem persists, contact support.',
      type: 'error' as const
    },
    SERVER_ERROR: {
      title: 'Server Error',
      message: 'We\'re experiencing technical difficulties. Our team has been notified and is working to resolve this.',
      action: 'Please try again in a few minutes.',
      type: 'error' as const
    }
  },

  // Form Validation Errors
  VALIDATION: {
    REQUIRED_FIELD: {
      title: 'Required Information Missing',
      message: 'Please fill in all required fields to continue.',
      action: 'Check the highlighted fields above.',
      type: 'warning' as const
    },
    INVALID_EMAIL: {
      title: 'Invalid Email Format',
      message: 'Please enter a valid email address (e.g., user@company.com).',
      action: 'Check for typos in your email address.',
      type: 'warning' as const
    },
    WEAK_PASSWORD: {
      title: 'Password Too Weak',
      message: 'Your password must be at least 8 characters long and include letters and numbers.',
      action: 'Try adding numbers or special characters.',
      type: 'warning' as const
    },
    PASSWORD_MISMATCH: {
      title: 'Passwords Don\'t Match',
      message: 'The passwords you entered don\'t match. Please try again.',
      action: 'Make sure both password fields are identical.',
      type: 'warning' as const
    }
  },

  // API Errors
  API: {
    NETWORK_TIMEOUT: {
      title: 'Request Timed Out',
      message: 'The request is taking longer than expected. This might be due to a slow connection.',
      action: 'Please try again or check your internet connection.',
      type: 'warning' as const
    },
    RATE_LIMITED: {
      title: 'Too Many Requests',
      message: 'You\'ve made too many requests in a short time. Please wait a moment before trying again.',
      action: 'Wait 30 seconds before retrying.',
      type: 'warning' as const
    },
    UNAUTHORIZED: {
      title: 'Access Denied',
      message: 'You don\'t have permission to perform this action. Please contact your administrator.',
      action: 'Contact support if you believe this is an error.',
      type: 'error' as const
    },
    NOT_FOUND: {
      title: 'Resource Not Found',
      message: 'The requested information could not be found. It may have been moved or deleted.',
      action: 'Try refreshing the page or contact support.',
      type: 'error' as const
    },
    CONFLICT: {
      title: 'Conflict Detected',
      message: 'This action conflicts with existing data. Please review and try again.',
      action: 'Check for duplicate entries or conflicting information.',
      type: 'warning' as const
    }
  },

  // Project Management Errors
  PROJECTS: {
    CREATE_FAILED: {
      title: 'Project Creation Failed',
      message: 'We couldn\'t create your project request. This might be due to missing information or a server issue.',
      action: 'Please review your project details and try again.',
      type: 'error' as const
    },
    UPDATE_FAILED: {
      title: 'Project Update Failed',
      message: 'We couldn\'t save your project changes. Your data is safe and hasn\'t been modified.',
      action: 'Please try again or contact support if the problem persists.',
      type: 'error' as const
    },
    DELETE_FAILED: {
      title: 'Project Deletion Failed',
      message: 'We couldn\'t delete the project. It may be in use or you may not have permission.',
      action: 'Contact support if you need to delete this project.',
      type: 'error' as const
    }
  },

  // Messaging Errors
  MESSAGES: {
    SEND_FAILED: {
      title: 'Message Not Sent',
      message: 'We couldn\'t send your message. Please check your connection and try again.',
      action: 'Your message has been saved as a draft.',
      type: 'error' as const
    },
    REPLY_FAILED: {
      title: 'Reply Not Sent',
      message: 'We couldn\'t send your reply. The original message is still available.',
      action: 'Try sending your reply again.',
      type: 'error' as const
    },
    LOAD_FAILED: {
      title: 'Messages Not Loaded',
      message: 'We couldn\'t load your messages. This might be a temporary connection issue.',
      action: 'Try refreshing the page or contact support.',
      type: 'error' as const
    }
  },

  // File Upload Errors
  FILES: {
    TOO_LARGE: {
      title: 'File Too Large',
      message: 'The file you\'re trying to upload is too large. Maximum size is 10MB.',
      action: 'Try compressing the file or choose a smaller file.',
      type: 'warning' as const
    },
    INVALID_TYPE: {
      title: 'Invalid File Type',
      message: 'This file type is not supported. Please use PDF, DOC, DOCX, or image files.',
      action: 'Convert your file to a supported format.',
      type: 'warning' as const
    },
    UPLOAD_FAILED: {
      title: 'Upload Failed',
      message: 'We couldn\'t upload your file. This might be due to a connection issue.',
      action: 'Try uploading again or contact support.',
      type: 'error' as const
    }
  },

  // General System Errors
  SYSTEM: {
    UNEXPECTED_ERROR: {
      title: 'Unexpected Error',
      message: 'Something went wrong that we didn\'t expect. Our team has been notified.',
      action: 'Please try again or contact support if the problem continues.',
      type: 'error' as const
    },
    MAINTENANCE: {
      title: 'System Maintenance',
      message: 'We\'re currently performing scheduled maintenance. The system will be back online shortly.',
      action: 'Please try again in a few minutes.',
      type: 'info' as const
    },
    FEATURE_UNAVAILABLE: {
      title: 'Feature Temporarily Unavailable',
      message: 'This feature is currently being updated and is temporarily unavailable.',
      action: 'Please try again later or use an alternative method.',
      type: 'info' as const
    }
  }
} as const

/**
 * Get user-friendly error message based on error type and context
 */
export function getErrorMessage(error: Error | string, context?: string): ErrorMessage {
  const errorString = typeof error === 'string' ? error : error.message
  const errorLower = errorString.toLowerCase()

  // Network/Connection errors
  if (errorLower.includes('network') || errorLower.includes('fetch') || errorLower.includes('connection')) {
    return ERROR_MESSAGES.AUTH.NETWORK_ERROR
  }

  // Authentication errors
  if (errorLower.includes('unauthorized') || errorLower.includes('401')) {
    return ERROR_MESSAGES.AUTH.TOKEN_EXPIRED
  }

  if (errorLower.includes('invalid') && (errorLower.includes('credentials') || errorLower.includes('password'))) {
    return ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
  }

  // Rate limiting
  if (errorLower.includes('rate limit') || errorLower.includes('429')) {
    return ERROR_MESSAGES.API.RATE_LIMITED
  }

  // Server errors
  if (errorLower.includes('500') || errorLower.includes('server error')) {
    return ERROR_MESSAGES.AUTH.SERVER_ERROR
  }

  // Not found errors
  if (errorLower.includes('not found') || errorLower.includes('404')) {
    return ERROR_MESSAGES.API.NOT_FOUND
  }

  // Timeout errors
  if (errorLower.includes('timeout') || errorLower.includes('timed out')) {
    return ERROR_MESSAGES.API.NETWORK_TIMEOUT
  }

  // Context-specific errors
  if (context === 'login') {
    return ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
  }

  if (context === 'message') {
    return ERROR_MESSAGES.MESSAGES.SEND_FAILED
  }

  if (context === 'project') {
    return ERROR_MESSAGES.PROJECTS.CREATE_FAILED
  }

  // Default fallback
  return ERROR_MESSAGES.SYSTEM.UNEXPECTED_ERROR
}

/**
 * Get error message with retry suggestion
 */
export function getErrorMessageWithRetry(error: Error | string, maxRetries: number = 3): ErrorMessage {
  const baseMessage = getErrorMessage(error)
  
  return {
    ...baseMessage,
    action: `${baseMessage.action} You can try again up to ${maxRetries} times.`
  }
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: Error | string): boolean {
  const errorString = typeof error === 'string' ? error : error.message
  const errorLower = errorString.toLowerCase()

  return (
    errorLower.includes('network') ||
    errorLower.includes('timeout') ||
    errorLower.includes('connection') ||
    errorLower.includes('500') ||
    errorLower.includes('502') ||
    errorLower.includes('503')
  )
}
