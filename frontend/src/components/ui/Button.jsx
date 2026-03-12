import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Button component with multiple variants and sizes
 */
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'bg-transparent border border-border text-white hover:bg-surface-light focus:ring-primary',
    icon: 'bg-transparent text-muted hover:text-white hover:bg-surface-light rounded-full p-2',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Icon button size override
  const iconSizeStyles = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };
  
  // Loading spinner
  const Spinner = () => (
    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  // Determine which size style to use
  const getSizeStyle = () => {
    if (variant === 'icon') {
      return iconSizeStyles[size] || iconSizeStyles.md;
    }
    return sizeStyles[size] || sizeStyles.md;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.primary}
        ${getSizeStyle()}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'icon']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.string,
  className: PropTypes.string,
};

export default Button;