import ContactInfoCard from './ContactInfoCard';

export default function MapHero() {
  const mapImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBecMwP1M_1vmn-nHFdZuzzG_GFFCU9IC4WyTy2ROy1oW1QY0tE0i-VCPKacSkhwXvNws35w-DzZmYrq_viUeCbBvGjOzJ0XsR6q0I-WZQpiL_ea7cn4WFr5eOkrCSOU4uM0w-XSF9V4hLaH-q_LMV0ieIYXsC0mfgkq6xIAouttuJrgCsSTYnWj0_6j2AhkyryRL_-hU-CJYFZQxJXD3c8sVkTJmePJPstC7PiV5LvbAckQbzBTd0VIm9uhSzw0S4xJU8j4zwJoTg';

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      {/* Map Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter grayscale contrast-125 brightness-50"
        style={{ backgroundImage: `url(${mapImageUrl})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent" />

      {/* Pulse Ring Animation - positioned center-right */}
      <div className="absolute top-1/2 right-1/3 -translate-y-1/2">
        <div className="pulse-ring" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--color-primary-val)]" />
      </div>

      {/* Contact Info Card - positioned left side */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <ContactInfoCard />
        </div>
      </div>
    </section>
  );
}
