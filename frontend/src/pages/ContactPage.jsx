import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/ui/Breadcrumb';
import { APP_CONFIG } from '../constants';
import { isValidEmail } from '../utils';
import { sendMessage } from '../services/messageService';
import { useToast } from '../context/ToastContext';

const CONTACT_INFO = [
  { Icon: MapPin, label: 'Visit Us', value: APP_CONFIG.address },
  { Icon: Phone, label: 'Call Us', value: APP_CONFIG.phone, href: `tel:${APP_CONFIG.phone}` },
  { Icon: Mail, label: 'Email Us', value: APP_CONFIG.email, href: `mailto:${APP_CONFIG.email}` },
  { Icon: Clock, label: 'Opening Hours', value: APP_CONFIG.hours },
];

function ContactPage() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!isValidEmail(form.email)) next.email = 'Please enter a valid email.';
    if (!form.subject.trim()) next.subject = 'Please add a subject.';
    if (form.message.trim().length < 10) next.message = 'Message must be at least 10 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await sendMessage(form);
      toast.success('Your message has been sent. We will reply within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Could not send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="pt-28">
      <section className="py-12">
        <div className="container-luxury">
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Contact' }]} />
          <div className="mt-8 max-w-3xl">
            <SectionTitle
              eyebrow="Get in Touch"
              title="We Would Love to Hear From You"
              subtitle="Whether you have a question about a custom order, a collaboration idea, or simply want to say hello — our atelier is here for you."
              align="left"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-luxury grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {CONTACT_INFO.map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5 }}
                  className="card-luxury p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                    <item.Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg text-brown-900">{item.label}</h3>
                  {item.href ? (
                    <a href={item.href} className="mt-1 block text-sm text-brown-600 hover:text-gold-700">
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-brown-600">{item.value}</p>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl shadow-soft">
              <iframe
                title="FRE-DESIGN atelier location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=38.76%2C8.97%2C38.80%2C9.01&layer=mapnik"
                className="h-56 w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={onSubmit} className="card-luxury flex flex-col gap-5 p-8" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  name="name"
                  required
                  value={form.name}
                  onChange={update('name')}
                  error={errors.name}
                  placeholder="Selamawit Bekele"
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={update('email')}
                  error={errors.email}
                  placeholder="you@example.com"
                />
              </div>
              <Input
                label="Subject"
                name="subject"
                required
                value={form.subject}
                onChange={update('subject')}
                error={errors.subject}
                placeholder="Custom bridal consultation"
              />
              <Textarea
                label="Message"
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={update('message')}
                error={errors.message}
                placeholder="Tell us about the dress you envision…"
              />
              <Button type="submit" loading={submitting} size="lg" leftIcon={<Send className="h-4 w-4" />}>
                {submitting ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </article>
  );
}

export default ContactPage;
