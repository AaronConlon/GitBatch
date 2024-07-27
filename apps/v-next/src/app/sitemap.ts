import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://batch-manage-github-repos.i5lin.top/',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1
    },
    {
      url: 'https://batch-manage-github-repos.i5lin.top/action',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8
    },
    {
      url: 'https://batch-manage-github-repos.i5lin.top/about',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5
    }
  ];
}
