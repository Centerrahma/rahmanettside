import { useTranslations } from 'next-intl';
import { MapPin, Mail } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function ContactInfoCard() {
  const t = useTranslations('contact');

  const contactItems = [
    {
      icon: MapPin,
      label: t('address'),
      value: `${CONTACT_INFO.address}, ${CONTACT_INFO.city}`,
    },
    {
      icon: Mail,
      label: t('inquiries'),
      value: CONTACT_INFO.email,
    },
  ];



  return (
    <div className="glass-panel border-l-4 border-primary p-8 max-w-md">
      <span className="text-[var(--color-primary-val)] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
        {t('locationHub')}
      </span>

      <h1 className="text-4xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)] mb-4">
        {t('visitUs')}
      </h1>

      <p className="text-[var(--color-text-muted)] mb-8 leading-relaxed">
        {t('visitDesc')}
      </p>

      <div className="space-y-6 mb-8">
        {contactItems.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary-val)]/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-[var(--color-primary-val)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1 uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-[var(--color-text)] font-medium">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}
