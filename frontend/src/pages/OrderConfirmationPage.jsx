import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Calendar, Home as HomeIcon, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { formatCurrency, formatDate } from '../utils';
import { APP_CONFIG } from '../constants';

function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-20 text-center">
        <p className="font-serif text-3xl text-brown-900">No order to confirm</p>
        <p className="text-brown-500">It looks like you reached this page directly.</p>
        <Button to="/">Return Home</Button>
      </div>
    );
  }

  const deliveryDate = order.estimatedDelivery
    ? formatDate(order.estimatedDelivery)
    : `~${APP_CONFIG.estimatedDeliveryWeeks} weeks from today`;

  return (
    <article className="pt-28">
      <section className="py-16">
        <div className="container-luxury max-w-2xl">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50"
          >
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <h1 className="font-serif text-4xl text-brown-900">Thank You, {order.fullName?.split(' ')[0] || ''}</h1>
            <p className="mt-3 text-brown-600">
              Your custom order has been received. Our atelier will begin crafting your
              Habesha Kemis with the utmost care.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-10 overflow-hidden rounded-2xl border border-brown-100 shadow-soft"
          >
            <div className="bg-brown-900 px-6 py-4 text-cream-100">
              <p className="text-xs uppercase tracking-widest text-gold-400">Order Number</p>
              <p className="font-serif text-2xl">{order.orderNumber}</p>
            </div>
            <dl className="grid gap-x-8 gap-y-4 p-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wider text-brown-400">Product</dt>
                <dd className="mt-0.5 text-sm text-brown-800">{order.productName || 'Custom Habesha Kemis'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-brown-400">Total</dt>
                <dd className="mt-0.5 font-serif text-lg text-brown-900">{formatCurrency(order.price * (order.quantity || 1))}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-brown-400">Status</dt>
                <dd className="mt-0.5 text-sm text-brown-800">{order.status}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-brown-400">Email</dt>
                <dd className="mt-0.5 text-sm text-brown-800">{order.email}</dd>
              </div>
            </dl>
          </motion.div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-cream-100 p-5">
              <Calendar className="h-6 w-6 text-gold-600" />
              <div>
                <p className="text-xs uppercase tracking-wider text-brown-400">Estimated Delivery</p>
                <p className="text-sm font-medium text-brown-800">{deliveryDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-cream-100 p-5">
              <Package className="h-6 w-6 text-gold-600" />
              <div>
                <p className="text-xs uppercase tracking-wider text-brown-400">What Happens Next</p>
                <p className="text-sm font-medium text-brown-800">We will email you a tracking link when your dress ships.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button to="/" variant="outline" leftIcon={<HomeIcon className="h-4 w-4" />}>
              Back to Home
            </Button>
            <Button to="/collections" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}

export default OrderConfirmationPage;
