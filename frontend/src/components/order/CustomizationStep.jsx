import { motion } from 'framer-motion';
import Textarea from '../ui/Textarea';
import ReceiptUpload from '../ReceiptUpload';
import { FABRIC_OPTIONS } from '../../constants';

export function validateCustomization(form) {
  const errors = {};
  if (!form.fabric) errors.fabric = 'Please select a fabric.';
  return errors;
}

function CustomizationStep({ form, errors, update, onUpload }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <span className="mb-3 block text-sm font-medium text-brown-800">
          Fabric <span className="text-gold-600">*</span>
        </span>
        <div className="grid gap-3 sm:grid-cols-2">
          {FABRIC_OPTIONS.map((fabric) => (
            <button
              key={fabric.id}
              type="button"
              onClick={() => update('fabric')({ target: { value: fabric.id } })}
              className={`rounded-xl border p-4 text-left transition-all ${
                form.fabric === fabric.id
                  ? 'border-gold-500 bg-gold-50 ring-2 ring-gold-200'
                  : 'border-brown-200 hover:border-gold-300'
              }`}
              aria-pressed={form.fabric === fabric.id}
            >
              <p className="font-medium text-brown-900">{fabric.label}</p>
              <p className="mt-0.5 text-xs text-brown-500">{fabric.description}</p>
            </button>
          ))}
        </div>
        {errors.fabric && <p className="mt-2 text-xs text-red-600">{errors.fabric}</p>}
      </div>

      <Textarea
        label="Design Notes (የዲዛይን ማስታወሻ)"
        name="designNotes"
        rows={4}
        value={form.designNotes}
        onChange={update('designNotes')}
        placeholder="Describe any specific embroidery patterns, neckline preferences, or details you envision…"
      />

      <div>
        <span className="mb-2 block text-sm font-medium text-brown-800">
          Reference Image (optional)
        </span>
        <ReceiptUpload onUpload={onUpload} />
      </div>
    </motion.div>
  );
}

export default CustomizationStep;
