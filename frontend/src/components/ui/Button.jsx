import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const VARIANTS = {
  primary:
    'bg-gold-gradient text-white shadow-gold hover:shadow-luxury hover:brightness-105',
  secondary:
    'bg-brown-900 text-cream-50 hover:bg-brown-800 shadow-soft',
  outline:
    'border border-brown-300 text-brown-800 bg-transparent hover:border-gold-500 hover:text-gold-700',
  ghost: 'text-brown-700 hover:bg-brown-100/60',
  light: 'bg-white/90 text-brown-900 hover:bg-white shadow-soft',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  ...rest
}) {
  const classes = [
    'btn-base',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  const content = (
    <>
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {leftIcon && !loading && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
    </>
  );

  const motionProps = {
    whileTap: { scale: disabled || loading ? 1 : 0.97 },
    transition: { duration: 0.15 },
  };

  if (to) {
    return (
      <motion.div {...motionProps} className={fullWidth ? 'w-full' : 'inline-block'}>
        <Link to={to} className={classes} {...rest}>
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a href={href} className={classes} {...motionProps} {...rest}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...motionProps}
      {...rest}
    >
      {content}
    </motion.button>
  );
}

export default Button;
