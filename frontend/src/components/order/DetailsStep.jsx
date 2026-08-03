import { motion } from 'framer-motion';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

export function validateDetails(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email.';
  if (form.phone.trim().length < 6) errors.phone = 'Please enter a valid phone number.';
  if (!form.address.trim()) errors.address = 'Please enter your delivery address.';
  if (!form.city.trim()) errors.city = 'Please enter your city.';
  if (!form.country.trim()) errors.country = 'Please enter your country.';
  return errors;
}

function DetailsStep({ form, errors, update }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="grid gap-5 sm:grid-cols-2"
    >
      <Input label="Full Name (ሙሉ ስም)" name="fullName" required value={form.fullName} onChange={update('fullName')} error={errors.fullName} placeholder="Selamawit Bekele" />
      <Input label="Email (ኢሜይል)" name="email" type="email" required value={form.email} onChange={update('email')} error={errors.email} placeholder="you@example.com" />
      <Input label="Phone Number (ስልክ ቁጥር)" name="phone" required value={form.phone} onChange={update('phone')} error={errors.phone} placeholder="+251 91 234 5678" />
      <Input label="Country (ሀገር)" name="country" required value={form.country} onChange={update('country')} error={errors.country} placeholder="Ethiopia" />
      <Input label="City (ከተማ)" name="city" required value={form.city} onChange={update('city')} error={errors.city} placeholder="Addis Ababa" />
      <Input label="Delivery Address (የመላኪያ አድራሻ)" name="address" required value={form.address} onChange={update('address')} error={errors.address} placeholder="Street, building, apartment" className="sm:col-span-2" />
      <Textarea label="Delivery Notes (የመላኪያ ማስታወሻ)" name="notes" rows={3} value={form.notes} onChange={update('notes')} placeholder="Any special delivery instructions…" className="sm:col-span-2" />
    </motion.div>
  );
}

export default DetailsStep;
