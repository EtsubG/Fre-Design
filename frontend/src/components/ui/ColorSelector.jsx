import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLOR_SWATCHES } from '../../constants';

function ColorSelector({ selected, onChange, availableColors }) {
  const swatches = availableColors
    ? COLOR_SWATCHES.filter((c) => availableColors.includes(c.id))
    : COLOR_SWATCHES;

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-brown-800">Color</span>
      <div className="flex flex-wrap gap-2.5">
        {swatches.map((color) => {
          const isSelected = selected === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onChange(color.id)}
              className="group relative flex items-center gap-2 rounded-full p-0.5 transition-all"
              aria-pressed={isSelected}
              aria-label={color.label}
            >
              <motion.span
                whileTap={{ scale: 0.9 }}
                className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-white transition-all ${
                  isSelected ? 'ring-gold-500' : 'ring-brown-200 group-hover:ring-gold-300'
                }`}
                style={{ backgroundColor: color.value }}
              >
                {isSelected && (
                  <Check
                    className="h-4 w-4"
                    style={{
                      color: ['#ivory', 'gold'].includes(color.id) ? '#4a2e24' : '#fff',
                    }}
                  />
                )}
              </motion.span>
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="mt-2 text-xs text-brown-500">
          Selected: {swatches.find((c) => c.id === selected)?.label}
        </p>
      )}
    </div>
  );
}

export default ColorSelector;
