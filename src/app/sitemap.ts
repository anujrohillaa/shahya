import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shahya.com';

  const cities = [
    'gurgaon',
    'manesar',
    'delhi',
    'noida',
    'faridabad',
    'ghaziabad',
    'bangalore',
    'pune',
    'mumbai',
    'hyderabad',
  ];

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/post`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Programmatic City Rooms & Flatmates Hubs
  const cityRoutes: MetadataRoute.Sitemap = cities.flatMap((city) => [
    {
      url: `${baseUrl}/rooms/${city}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/flatmates/${city}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]);

  // 3. Live Active Listings
  let listingRoutes: MetadataRoute.Sitemap = [];
  try {
    const listings = await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, updatedAt: true },
      take: 1000,
    });

    listingRoutes = listings.map((l) => ({
      url: `${baseUrl}/listing/${l.id}`,
      lastModified: l.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Error fetching listings for sitemap:', err);
  }

  return [...staticRoutes, ...cityRoutes, ...listingRoutes];
}
