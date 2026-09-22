import type { DonationProject } from '@/types/donation';
import type { CommunityEvent } from '@/types/event';

export const DONATION_AMOUNTS = [100, 500, 1000] as const;
export const DEFAULT_AMOUNT = 500;
export const CURRENCY = 'nok';

export const PROJECTS: DonationProject[] = [
  {
    id: 'classroom',
    slug: 'classroom',
    titleKey: 'donate.classroom',
    descKey: 'donate.classroomDesc',
    target: 90000,
    raised: 30600,
    donors: 0,
    badge: 'ongoing',
    progressType: 'linear',
    percentage: 34,
  },
  {
    id: 'bonneteppe',
    slug: 'bonneteppe',
    titleKey: 'donate.bonneteppe',
    descKey: 'donate.bonneteppeDesc',
    target: 250000,
    raised: 100000,
    donors: 0,
    badge: 'ongoing',
    progressType: 'circular',
    percentage: 40,
  },
  {
    id: 'wudhu',
    slug: 'wudhu',
    titleKey: 'donate.wudhu',
    descKey: 'donate.wudhuDesc',
    target: 500000,
    raised: 70000,
    donors: 0,
    badge: 'ongoing',
    progressType: 'linear',
    percentage: 14,
  },
  {
    id: 'main-door',
    slug: 'main-door',
    titleKey: 'donate.mainDoor',
    descKey: 'donate.mainDoorDesc',
    target: 170000,
    raised: 34000,
    donors: 0,
    badge: 'ongoing',
    progressType: 'circular',
    percentage: 20,
  },
  {
    id: 'sound-system',
    slug: 'sound-system',
    titleKey: 'donate.soundSystem',
    descKey: 'donate.soundSystemDesc',
    target: 140000,
    raised: 16800,
    donors: 0,
    badge: 'urgent',
    progressType: 'linear',
    percentage: 12,
  },
  {
    id: 'mihrab',
    slug: 'mihrab',
    titleKey: 'donate.mihrab',
    descKey: 'donate.mihrabDesc',
    target: 90000,
    raised: 57600,
    donors: 0,
    badge: 'ongoing',
    progressType: 'circular',
    percentage: 64,
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

// Membership sign-up is handled by StyreWeb (the mosque's membership system).
// Replace with the organisation's own innmelding link from StyreWeb:
// https://<organisasjon>.portal.styreweb.com/arrangement/Register?ID=<skjema-id>
export const MEMBERSHIP_SIGNUP_URL = 'REPLACE_WITH_STYREWEB_INNMELDING_URL';

export const CONTACT_INFO = {
  address: 'Tvetenveien 152A',
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
