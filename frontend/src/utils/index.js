import { APP_CONFIG } from '../constants';

export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;
  return `${APP_CONFIG.currencySymbol}${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

export const truncate = (text, length = 120) =>
  text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;

export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPositiveNumber = (value) => {
  const n = Number(value);
  return !Number.isNaN(n) && n > 0;
};
