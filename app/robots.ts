import { MetadataRoute } from 'next';

/**
 * Generate robots.txt for The Ace Tour website
 * Allows crawling of public pages and disallows admin and auth pages
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theace.ai';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        // Admin routes
        '/*/admin/',
        '/*/admin/*',
        
        // Auth routes
        '/*/login',
        
        // API routes
        '/api/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}