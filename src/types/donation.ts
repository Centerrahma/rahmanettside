export type DonationFrequency = 'one_time' | 'monthly';

export interface DonationProject {
  id: string;
  slug: string;
  titleKey: string;
  descKey: string;
  target: number;
  raised: number;
  donors: number;
  badge: 'urgent' | 'ongoing';
  progressType: 'linear' | 'circular';
  percentage: number;
}

export interface DonationFormData {
  amount: number;
  frequency: DonationFrequency;
  project: string;
  paymentMethod: 'card' | 'apple_pay' | 'vipps';
}
