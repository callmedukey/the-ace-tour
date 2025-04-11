import { MetadataRoute } from "next";
import { routing } from "../i18n/routing";
import { getMiceWithPosts } from "@/actions/mice";
import { getPackagesWithImages } from "@/actions/packages";

// Define valid change frequency values
type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

/**
 * Generate sitemap for The Ace Tour website
 * Includes all routes for both EN and KO locales
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://theace.ai";
  const { locales } = routing;

  // Define the routes without locale prefix
  const routes = [
    // Main pages
    "", // Home page
    "/mice-solutions", // MICE Solutions main page
    "/shuttle-service", // Shuttle Service page
    "/support", // Support page
    "/travel-packages", // Travel Packages main page
  ];

  // Create sitemap entries for all static routes in all locales
  const staticRoutes = locales.flatMap((locale) => {
    return routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === "" ? "daily" : "weekly") as ChangeFrequency,
      priority: route === "" ? 1.0 : 0.8,
    }));
  });

  // Fetch MICE solution posts from database
  const miceResult = await getMiceWithPosts();
  let miceSitemapEntries: MetadataRoute.Sitemap = [];
  
  if (miceResult.success && miceResult.mice) {
    // Create sitemap entries for each MICE solution post in each locale
    miceSitemapEntries = locales.flatMap(locale => {
      return miceResult.mice.flatMap(mice => 
        mice.posts?.map(post => ({
          url: `${baseUrl}/${locale}/mice-solutions/${post.id}`,
          lastModified: new Date(post.updatedAt || new Date()),
          changeFrequency: "weekly" as ChangeFrequency,
          priority: 0.7,
        })) || []
      );
    });
  }
  
  // Fetch travel packages from database
  const packagesResult = await getPackagesWithImages();
  let packageSitemapEntries: MetadataRoute.Sitemap = [];
  
  if (packagesResult.success && packagesResult.packages) {
    // Create sitemap entries for each travel package in each locale
    packageSitemapEntries = locales.flatMap(locale => {
      return packagesResult.packages.map(pkg => ({
        url: `${baseUrl}/${locale}/travel-packages/${pkg.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as ChangeFrequency,
        priority: 0.7,
      }));
    });
  }
  
  // Combine all routes for the sitemap
  return [
    ...staticRoutes,
    ...miceSitemapEntries,
    ...packageSitemapEntries
  ];
}
