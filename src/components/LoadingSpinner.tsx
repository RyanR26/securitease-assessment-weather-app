import { HTMLAttributes } from 'react'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
  message?: string
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
}

export function LoadingSpinner({
  size = 'md',
  message,
  className = '',
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      {...props}
    >
      <div
        className={`${sizeStyles[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-4 text-gray-600 text-sm">{message}</p>
      )}
    </div>
  )
}

