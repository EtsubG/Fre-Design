import { motion } from 'framer-motion';
import Input from '../ui/Input';
import { MEASUREMENT_FIELDS } from '../../constants';
import { isPositiveNumber } from '../../utils';

export function validateMeasurements(form) {
  const errors = {};
  MEASUREMENT_FIELDS.forEach((field) => {
    const value = form[field.key];
    if (value === '' || value == null) {
      errors[field.key] = `${field.label} is required.`;
    } else if (!isPositiveNumber(value)) {
      errors[field.key] = `${field.label} must be a positive number.`;
    }
  });
  return errors;
}

function MeasurementsStep({ form, errors, update }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 flex items-start gap-3 rounded-xl bg-gold-50 p-4 text-sm text-brown-700">
        <span className="mt-0.5 text-gold-600"> ⓘ</span>
        <p>
          Enter your body measurements in centimeters. If you are unsure, visit a local
          tailor or ask a friend to help. Accurate measurements ensure a perfect fit.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MEASUREMENT_FIELDS.map((field) => (
          <Input
            key={field.key}
            label={`${field.label} (${field.unit})`}
            name={field.key}
            type="number"
            min="1"
            required
            value={form[field.key]}
            onChange={update(field.key)}
            error={errors[field.key]}
            placeholder={field.placeholder}
            hint={`in ${field.unit}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default MeasurementsStep;
