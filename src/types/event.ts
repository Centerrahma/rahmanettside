export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  category: 'youth' | 'halaqa' | 'community' | 'education';
  day: string;
  time: string;
  image?: string;
}
