import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

function Stepper({ steps, currentStep }) {
  return (
    <ol className="flex w-full items-center">
      {steps.map((step, index) => {
        const isComplete = index < currentStep - 1;
        const isActive = index === currentStep - 1;
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.id}
            className={`flex items-center ${isLast ? '' : 'flex-1'}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  backgroundColor: isComplete || isActive ? '#c4902a' : '#e4d3c2',
                }}
                transition={{ duration: 0.3 }}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isComplete || isActive ? 'text-white' : 'text-brown-500'
                }`}
              >
                {isComplete ? <Check className="h-5 w-5" /> : step.id}
              </motion.div>
              <div className="hidden text-center sm:block">
                <p className={`text-xs font-medium ${isActive ? 'text-gold-700' : isComplete ? 'text-brown-800' : 'text-brown-400'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-brown-400">{step.description}</p>
              </div>
            </div>
            {!isLast && (
              <div className="mx-2 h-px flex-1 bg-brown-200 sm:mx-4">
                <motion.div
                  initial={false}
                  animate={{ width: isComplete ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-gold-gradient"
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default Stepper;
