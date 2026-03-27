'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { CheckCircle2, Info, Lock, AlertCircle, Loader2, UserPlus } from 'lucide-react';
import Button from '@/components/ui/Button';

const membershipSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().min(1, 'Address is required'),
  postalCode: z.string().regex(/^\d{4}$/, 'Must be 4 digits'),
  city: z.string().min(1, 'City is required'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  email: z.string().email('Please enter a valid email address'),
  fodselsnummer: z.string().regex(/^\d{11}$/, 'Must be exactly 11 digits'),
});

type FormState = z.infer<typeof membershipSchema>;
type FormErrors = Partial<Record<keyof FormState, string>>;
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function MembershipForm() {
  const t = useTranslations('membership');

  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    email: '',
    fodselsnummer: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage('');

    const result = membershipSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormState;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit application');
      }

      setStatus('success');
      setFormData({
        fullName: '',
        address: '',
        postalCode: '',
        city: '',
        phone: '',
        email: '',
        fodselsnummer: '',
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClass = (field: keyof FormState) =>
    `floating-input block px-4 py-4 w-full text-[var(--color-text)] bg-[var(--color-bg)] border ${errors[field] ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary peer placeholder-transparent`;

  const labelClass =
    'absolute text-sm text-[var(--color-text-muted)] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--color-bg)] px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3';

  if (status === 'success') {
    return (
      <div className="p-8 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mb-4 mx-auto" />
        <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{t('successTitle')}</h3>
        <p className="text-[var(--color-text-muted)]">{t('successMessage')}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Important notice about checking existing membership */}
      <div className="mb-8 p-5 rounded-lg bg-amber-500/10 border border-amber-500/30">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-[var(--color-text)] leading-relaxed">
            Før du registrerer deg, ber vi deg logge inn på &quot;Min side&quot; hos Brønnøysundregistrene (
            <a
              href="https://person.brreg.no/nb/minside"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary-val)] underline hover:no-underline"
            >
              person.brreg.no/nb/minside
            </a>
            ) for å sjekke om du allerede står oppført som medlem av et annet tros- eller livssynssamfunn. Hvis du er registrert et annet sted, må du melde deg ut der før du kan melde deg inn hos oss.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)] mb-4">
          {t('formTitle')}
        </h2>
        <p className="text-[var(--color-text-muted)] leading-relaxed">
          {t('formDescription')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="relative">
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={inputClass('fullName')}
            placeholder=" "
          />
          <label htmlFor="fullName" className={labelClass}>
            {t('fullName')}
          </label>
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        {/* Address */}
        <div className="relative">
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className={inputClass('address')}
            placeholder=" "
          />
          <label htmlFor="address" className={labelClass}>
            {t('address')}
          </label>
          {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
        </div>

        {/* Postal Code + City (side by side) */}
        <div className="grid grid-cols-3 gap-4">
          <div className="relative col-span-1">
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={4}
              className={inputClass('postalCode')}
              placeholder=" "
            />
            <label htmlFor="postalCode" className={labelClass}>
              {t('postalCode')}
            </label>
            {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
          </div>
          <div className="relative col-span-2">
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass('city')}
              placeholder=" "
            />
            <label htmlFor="city" className={labelClass}>
              {t('city')}
            </label>
            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
          </div>
        </div>

        {/* Phone */}
        <div className="relative">
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass('phone')}
            placeholder=" "
          />
          <label htmlFor="phone" className={labelClass}>
            {t('phone')}
          </label>
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass('email')}
            placeholder=" "
          />
          <label htmlFor="email" className={labelClass}>
            {t('email')}
          </label>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Fødselsnummer */}
        <div className="relative">
          <input
            type="text"
            name="fodselsnummer"
            id="fodselsnummer"
            value={formData.fodselsnummer}
            onChange={handleChange}
            inputMode="numeric"
            autoComplete="off"
            maxLength={11}
            className={inputClass('fodselsnummer')}
            placeholder=" "
          />
          <label htmlFor="fodselsnummer" className={labelClass}>
            {t('fodselsnummer')}
          </label>
          {errors.fodselsnummer && <p className="text-xs text-red-500 mt-1">{errors.fodselsnummer}</p>}
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            <Lock className="w-3 h-3 inline align-middle mr-1" />
            {t('privacyNote')}
          </p>
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage || t('errorGeneral')}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              {t('submitButton')}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
