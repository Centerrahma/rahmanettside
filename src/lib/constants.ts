import type { DonationProject } from '@/types/donation';
import type { CommunityEvent } from '@/types/event';

export const DONATION_AMOUNTS = [100, 500, 1000] as const;
export const DEFAULT_AMOUNT = 500;
export const CURRENCY = 'nok';

export const PROJECTS: DonationProject[] = [
  {
    id: 'sound-system',
    slug: 'sound-system',
    titleKey: 'donate.soundSystem',
    descKey: 'donate.soundSystemDesc',
    target: 140000,
    raised: 10000,
    donors: 0,
    badge: 'urgent',
    progressType: 'linear',
    percentage: 7,
  },
  {
    id: 'mihrab',
    slug: 'mihrab',
    titleKey: 'donate.mihrab',
    descKey: 'donate.mihrabDesc',
    target: 90000,
    raised: 15000,
    donors: 0,
    badge: 'ongoing',
    progressType: 'circular',
    percentage: 17,
  },
  {
    id: 'wudhu-men',
    slug: 'wudhu-men',
    titleKey: 'donate.wudhuMen',
    descKey: 'donate.wudhuMenDesc',
    target: 250000,
    raised: 15000,
    donors: 0,
    badge: 'ongoing',
    progressType: 'linear',
    percentage: 6,
  },
  {
    id: 'wudhu-women',
    slug: 'wudhu-women',
    titleKey: 'donate.wudhuWomen',
    descKey: 'donate.wudhuWomenDesc',
    target: 250000,
    raised: 5000,
    donors: 0,
    badge: 'ongoing',
    progressType: 'linear',
    percentage: 2,
  },
  {
    id: 'main-door',
    slug: 'main-door',
    titleKey: 'donate.mainDoor',
    descKey: 'donate.mainDoorDesc',
    target: 170000,
    raised: 5000,
    donors: 0,
    badge: 'ongoing',
    progressType: 'circular',
    percentage: 3,
  },
  {
    id: 'classroom',
    slug: 'classroom',
    titleKey: 'donate.classroom',
    descKey: 'donate.classroomDesc',
    target: 90000,
    raised: 15000,
    donors: 0,
    badge: 'ongoing',
    progressType: 'linear',
    percentage: 17,
  },
  {
    id: 'ventilation',
    slug: 'ventilation',
    titleKey: 'donate.ventilation',
    descKey: 'donate.ventilationDesc',
    target: 35000,
    raised: 0,
    donors: 0,
    badge: 'urgent',
    progressType: 'circular',
    percentage: 0,
  },
];

export const EVENTS: CommunityEvent[] = [
  {
    id: 'coding-quran',
    title: 'Coding & Quran Night',
    description: 'Merging spiritual growth with Python basics. Open for ages 12-18.',
    category: 'youth',
    day: 'FRIDAY',
    time: '18:00',
  },
  {
    id: 'ramadan-prep',
    title: 'Ramadan Prep Workshop',
    description: 'Guest speaker Imam Ahmed discussing mental and spiritual readiness.',
    category: 'halaqa',
    day: 'SUNDAY',
    time: '19:30',
  },
];

export const CONTACT_INFO = {
  address: 'Tvetenveien 154',
  city: '0671 Oslo, Norway',
  email: 'post@centerrahma.no',
  hours: 'Daily: 09:00 - 22:00',
};

export const PRAYER_ICONS: Record<string, string> = {
  fajr: 'wb_twilight',
  dhuhr: 'light_mode',
  asr: 'wb_sunny',
  maghrib: 'wb_twilight',
  isha: 'nights_stay',
};

export const MOCK_PRAYER_TIMES: import('@/types/prayer').PrayerSchedule = {
  date: new Date().toISOString().split('T')[0],
  prayers: {
    fajr: { time: '04:12', iqamah: '04:30' },
    dhuhr: { time: '13:15', iqamah: '13:30' },
    asr: { time: '17:45', iqamah: '18:00' },
    maghrib: { time: '21:30', iqamah: '21:35' },
    isha: { time: '23:15', iqamah: '23:30' },
  },
  jummah: {
    khutbah: '13:30',
    prayer: '14:00',
  },
};
