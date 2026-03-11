import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://masjidrahma.no';
  const pages = ['', '/new-mosque', '/contact', '/become-member', '/heritage', '/rahma-skole', '/ung-rahma'];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: (page === '' ? 'daily' : 'weekly') as
      | 'daily'
      | 'weekly',
    priority: page === '' ? 1 : 0.8,
  }));
}
