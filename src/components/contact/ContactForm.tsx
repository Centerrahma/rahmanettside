'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import Button from '@/components/ui/Button';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  topic: z.string().min(1, 'Please select a topic'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormState = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof FormState, string>>;
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const t = useTranslations('contact');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    topic: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const topics = [
    { value: 'general', label: t('topicGeneral') },
    { value: 'tours', label: t('topicTours') },
    { value: 'school', label: t('topicSchool') },
    { value: 'nikah', label: t('topicNikah') },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage('');

    const result = contactSchema.safeParse(formData);
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', topic: '', message: '' });

      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)] mb-4">
          {t('directInquiry')}
        </h2>
        <p className="text-[var(--color-text-muted)] leading-relaxed">
          {t('inquiryDesc')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name Input */}
        <div className="relative">
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={`floating-input block px-4 py-4 w-full text-[var(--color-text)] bg-[var(--color-bg)] border ${errors.name ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary peer placeholder-transparent`}
            placeholder=" "
          />
          <label
            htmlFor="name"
            className="absolute text-sm text-[var(--color-text-muted)] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--color-bg)] px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
          >
            {t('fullName')}
          </label>
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email Input */}
        <div className="relative">
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`floating-input block px-4 py-4 w-full text-[var(--color-text)] bg-[var(--color-bg)] border ${errors.email ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary peer placeholder-transparent`}
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-[var(--color-text-muted)] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--color-bg)] px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
          >
            {t('email')}
          </label>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Topic Select */}
        <div className="relative">
          <select
            name="topic"
            id="topic"
            value={formData.topic}
            onChange={handleChange}
            className={`floating-input block px-4 py-4 w-full text-[var(--color-text)] bg-[var(--color-bg)] border ${errors.topic ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary peer`}
          >
            <option value="" disabled>
              {t('selectTopic')}
            </option>
            {topics.map(topic => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
          <label
            htmlFor="topic"
            className="absolute text-sm text-primary duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--color-bg)] px-2 left-3"
          >
            {t('selectTopic')}
          </label>
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
            expand_more
          </span>
          {errors.topic && <p className="text-xs text-red-500 mt-1">{errors.topic}</p>}
        </div>

        {/* Message Textarea */}
        <div className="relative">
          <textarea
            name="message"
            id="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className={`floating-input block px-4 py-4 w-full text-[var(--color-text)] bg-[var(--color-bg)] border ${errors.message ? 'border-red-500' : 'border-[var(--color-border)]'} rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary peer placeholder-transparent resize-none`}
            placeholder=" "
          />
          <label
            htmlFor="message"
            className="absolute text-sm text-[var(--color-text-muted)] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--color-bg)] px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
          >
            {t('yourMessage')}
          </label>
          {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Message sent successfully!</span>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              <span>{errorMessage || 'Failed to send message. Please try again.'}</span>
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
              <span className="material-symbols-outlined animate-spin">refresh</span>
              Sending...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">send</span>
              {tCommon('sendMessage')}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
