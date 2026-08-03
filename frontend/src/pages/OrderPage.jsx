import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Stepper from '../components/ui/Stepper';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/ui/Breadcrumb';
import SectionTitle from '../components/ui/SectionTitle';
import DetailsStep, { validateDetails } from '../components/order/DetailsStep';
import MeasurementsStep, { validateMeasurements } from '../components/order/MeasurementsStep';
import CustomizationStep, { validateCustomization } from '../components/order/CustomizationStep';
import ReviewStep from '../components/order/ReviewStep';
import { ORDER_STEPS } from '../constants';
import { createOrder } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import { useFetch } from '../hooks/useFetch';
import { getProductById } from '../services/productService';

const INITIAL_FORM = {
  fullName: '', email: '', phone: '', country: '', city: '', address: '', notes: '',
  bust: '', waist: '', hips: '', shoulderWidth: '', dressLength: '', sleeveLength: '',
  armCircumference: '', neckCircumference: '', height: '',
  fabric: '', designNotes: '', referenceImage: null,
};

function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const passedState = location.state || {};

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { data: product } = useFetch(
    () => getProductById(passedState.productId),
    [passedState.productId],
  );

  const price = passedState.price || product?.price || 0;

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validators = useMemo(
    () => ({
      1: validateDetails,
      2: validateMeasurements,
      3: validateCustomization,
    }),
    [],
  );

  const next = () => {
    const validate = validators[step];
    if (validate) {
      const stepErrors = validate(form);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        toast.error('Please complete the required fields before continuing.');
        return;
      }
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, ORDER_STEPS.length));
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        productId: passedState.productId || product?.id,
        productName: passedState.productName || product?.name,
        price,
        quantity: passedState.qty || 1,
        referenceImage: form.referenceImage?.url || null,
      };
      const { data: order } = await createOrder(payload);
      toast.success('Your order has been placed!');
      navigate('/order/confirmation', { state: { order } });
    } catch (err) {
      toast.error(err.message || 'Could not place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onUpload = (file) => {
    setForm((prev) => ({ ...prev, referenceImage: { url: URL.createObjectURL(file), name: file.name } }));
  };

  return (
    <article className="pt-28">
      <section className="py-10">
        <div className="container-luxury">
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Custom Order' }]} />
          <div className="mt-8">
            <SectionTitle
              eyebrow="Bespoke Tailoring"
              title="Create Your Custom Order"
              subtitle="Four simple steps stand between you and a Habesha Kemis tailored to your exact measurements."
              align="left"
            />
          </div>

          <div className="mt-12 max-w-3xl">
            <Stepper steps={ORDER_STEPS} currentStep={step} />
          </div>

          <div className="mt-12 max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-gradient text-sm font-semibold text-white">
                {step}
              </span>
              <h2 className="font-serif text-2xl text-brown-900">
                {ORDER_STEPS[step - 1].label}
              </h2>
            </div>

            {step === 1 && <DetailsStep form={form} errors={errors} update={update} />}
            {step === 2 && <MeasurementsStep form={form} errors={errors} update={update} />}
            {step === 3 && (
              <CustomizationStep form={form} errors={errors} update={update} onUpload={onUpload} />
            )}
            {step === 4 && (
              <ReviewStep form={form} product={product} price={price} onEdit={setStep} />
            )}

            <div className="mt-10 flex items-center justify-between border-t border-brown-100 pt-6">
              <Button
                variant="ghost"
                onClick={back}
                disabled={step === 1}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>

              {step < ORDER_STEPS.length ? (
                <Button onClick={next} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={submit}
                  loading={submitting}
                  leftIcon={<Check className="h-4 w-4" />}
                  size="lg"
                >
                  {submitting ? 'Placing Order…' : 'Place Order'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

export default OrderPage;
