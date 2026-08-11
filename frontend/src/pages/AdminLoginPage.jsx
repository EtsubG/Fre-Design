import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { login } from '../services/authService';
import { isValidEmail } from '../utils';
import { useToast } from '../context/ToastContext';

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!isValidEmail(form.email)) next.email = 'Please enter a valid email.';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await login(form);
      toast.success('Welcome back, Administrator.');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brown-950 px-4 py-20">
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.pexels.com/photos/30985153/pexels-photo-30985153.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md rounded-2xl bg-cream-50 p-8 shadow-luxury sm:p-10"
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brown-900 text-gold-400">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-5 font-serif text-3xl text-brown-900">Admin Access</h1>
          <p className="mt-2 text-sm text-brown-500">Sign in to manage albums, products, and orders.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
          <Input
            label="Email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            error={errors.email}
            placeholder="admin@fere-design.com"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={update('password')}
            error={errors.password}
            placeholder="••••••••"
          />
          <Button type="submit" loading={submitting} fullWidth size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 rounded-xl bg-gold-50 p-3 text-center text-xs text-brown-600">
          Demo credentials: <span className="font-medium">admin@fere-design.com</span> / <span className="font-medium">admin123</span>
        </div>

        <Link to="/" className="mt-6 block text-center text-sm text-brown-500 hover:text-gold-700">
          ← Back to website
        </Link>
      </motion.div>
    </section>
  );
}

export default AdminLoginPage;
