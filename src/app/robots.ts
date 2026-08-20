import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shahya.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin', '/api/auth'],
      },
      // Explicit access for AI Search Engines & Autonomous Agents
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Anthropic-ai',
          'Google-Extended',
          'Applebot-Extended',
          'Bingbot',
          'CCBot',
        ],
        allow: ['/', '/explore', '/rooms/*', '/flatmates/*', '/listing/*', '/llms.txt', '/llms-full.txt'],
        disallow: ['/admin', '/api/admin'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
