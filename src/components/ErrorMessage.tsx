import { HTMLAttributes, ReactNode } from 'react'

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  message: string | ReactNode
  title?: string
  onDismiss?: () => void
}

export function ErrorMessage({
  message,
  title = 'Error',
  onDismiss,
  className = '',
  ...props
}: ErrorMessageProps) {
  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      role="alert"
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-red-900">{title}</h3>
          <div className="text-red-800 text-sm mt-1">
            {message}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-red-600 hover:text-red-800 transition-colors"
            aria-label="Dismiss error"
          >
            <span className="text-xl">×</span>
          </button>
        )}
      </div>
    </div>
  )
}

