import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for
    // - ... if they start with `/trpc`, `/_next`, `/_vercel`, `/admin`, or contain `/api/`
    // - ... the ones containing a dot (e.g. `favicon.ico`)
    "/((?!trpc|_next|_vercel|admin|.*\\..*).)*",
    // Include locale-specific API routes
    "/:locale/api/checkout",
    // Exclude webhook endpoint - Stripe needs direct access without redirects
    // "/api/webhook", - REMOVED
    // Redirect root to default locale
    "/",
  ],
};
