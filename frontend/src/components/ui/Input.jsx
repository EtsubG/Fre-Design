import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    name,
    type = 'text',
    error,
    hint,
    required = false,
    className = '',
    ...rest
  },
  ref,
) {
  const id = useId();
  const inputId = rest.id || id;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-brown-800"
        >
          {label}
          {required && <span className="ml-0.5 text-gold-600">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={`input-luxury ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''} ${className}`}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-brown-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
