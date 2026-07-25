import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { MEASUREMENT_FIELDS, FABRIC_OPTIONS, COLOR_SWATCHES } from '../../constants';
import { formatCurrency } from '../../utils';

function ReviewStep({ form, product, price, onEdit }) {
  const fabric = FABRIC_OPTIONS.find((f) => f.id === form.fabric);
  const color = COLOR_SWATCHES.find((c) => c.id === form.color);

  const sections = [
    {
      title: 'Contact & Shipping',
      onEdit: () => onEdit(1),
      rows: [
        ['Name', form.fullName],
        ['Email', form.email],
        ['Phone', form.phone],
        ['Address', `${form.address}, ${form.city}, ${form.country}`],
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {product && (
        <div className="flex items-center gap-4 rounded-2xl bg-cream-100 p-5">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-20 w-20 rounded-xl object-cover"
            loading="lazy"
          />
          <div className="flex-1">
            <p className="font-serif text-lg text-brown-900">{product.name}</p>
            <p className="text-sm text-brown-500">Based on this design</p>
          </div>
          <p className="font-serif text-xl text-brown-900">{formatCurrency(price)}</p>
        </div>
      )}

      {sections.map((section) => (
        <div key={section.title} className="rounded-2xl border border-brown-100 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-brown-900">{section.title}</h3>
            <button
              onClick={section.onEdit}
              className="text-sm text-gold-700 hover:underline"
            >
              Edit
            </button>
          </div>
          <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {section.rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wider text-brown-400">{label}</dt>
                <dd className="mt-0.5 text-sm text-brown-800">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      <div className="rounded-2xl border border-brown-100 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-brown-900">Measurements</h3>
          <button onClick={() => onEdit(2)} className="text-sm text-gold-700 hover:underline">
            Edit
          </button>
        </div>
        <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-3">
          {MEASUREMENT_FIELDS.map((field) => (
            <div key={field.key}>
              <dt className="text-xs uppercase tracking-wider text-brown-400">{field.label}</dt>
              <dd className="mt-0.5 text-sm text-brown-800">
                {form[field.key] ? `${form[field.key]} ${field.unit}` : '—'}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-2xl border border-brown-100 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-brown-900">Customization</h3>
          <button onClick={() => onEdit(3)} className="text-sm text-gold-700 hover:underline">
            Edit
          </button>
        </div>
        <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-brown-400">Fabric</dt>
            <dd className="mt-0.5 text-sm text-brown-800">{fabric?.label || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-brown-400">Color</dt>
            <dd className="mt-0.5 flex items-center gap-2 text-sm text-brown-800">
              {color && (
                <span className="h-4 w-4 rounded-full ring-1 ring-brown-200" style={{ backgroundColor: color.value }} />
              )}
              {color?.label || '—'}
            </dd>
          </div>
          {form.designNotes && (
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wider text-brown-400">Design Notes</dt>
              <dd className="mt-0.5 text-sm text-brown-800">{form.designNotes}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
        <Check className="h-5 w-5 shrink-0" />
        <p>By submitting, you confirm your measurements and details are accurate. Our atelier will contact you to confirm.</p>
      </div>
    </motion.div>
  );
}

export default ReviewStep;
