import { forwardRef, useId } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, name, error, hint, required = false, rows = 4, className = '', ...rest },
  ref,
) {
  const id = useId();
  const inputId = rest.id || id;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-brown-800">
          {label}
          {required && <span className="ml-0.5 text-gold-600">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        name={name}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`input-luxury resize-none ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''} ${className}`}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-600">
          {error}
        </p>
      )}
      {hint && !error && <p className="text-xs text-brown-400">{hint}</p>}
    </div>
  );
});

export default Textarea;
