import React from "react"
import clsx from "clsx"


const variantClasses = {
  primary:
    "border border-gray-600 bg-[#252525] text-white hover:bg-gray-700 hover:text-gray-100",
  danger:
    "border border-red-600 bg-red-600 text-white hover:bg-red-700",
}

const sizeClasses = {
  sm: "px-1 py-1.5 text-xs",
  lg: "px-4 py-2.5 text-sm",
}

export const Button = React.forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      fullWidth = false,
      className,
      loadingText = "Submitting",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex items-center justify-center rounded font-sm transition focus:outline-none",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          (disabled || loading) && "opacity-60 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <span>
          {loading ? loadingText : children}
        </span>
         {loading && (
          <span className="h-4 w-4 ml-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
      </button>
    )
  }
)

