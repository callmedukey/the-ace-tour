import { getPostById } from "./queries/getPostById";
import { PostImageCarousel } from "./components/post-image-carousel";
import { HtmlContent } from "./components/html-content";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import PatternBG from "@/public/mice-solutions/pattern.png";

import { Link, redirect } from "@/i18n/navigation";
import * as motion from "motion/react-client";
import { getDB } from "@/db";
import { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

export const revalidate = 604800; // 1 week

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export const generateStaticParams = async () => {
  const db = await getDB();
  const posts = await db.query.posts.findMany({
    with: {
      postImageImages: {
        columns: {
          id: true,
          imgPath: true,
          imgENGAlt: true,
          imgKOAlt: true,
        },
      },
    },
  });

  const locales = ["ko", "en"];
  const postsWithLocales = [];
  for (const post of posts) {
    for (const locale of locales) {
      postsWithLocales.push({
        id: post.id,
        locale,
      });
    }
  }

  return postsWithLocales;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  try {
    // Safely resolve params with fallback
    const { locale, id } = await params;
    setRequestLocale(locale);
    const post = await getPostById(id);

    if (!post) {
      return {
        title: locale === "ko" ? "페이지를 찾을 수 없습니다" : "Page Not Found",
      };
    }

    const title = locale === "ko" ? post.KOtitle : post.ENGtitle;
    const description = locale === "ko" ? post.KOcontent : post.ENGcontent;
    const imageAlt = locale === "ko" ? post.imgKOAlt : post.imgENGAlt;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://theace.ai";
    const fullImageUrl = post.imgPath.startsWith("http")
      ? post.imgPath
      : `${baseUrl}${post.imgPath}`;

    return {
      title,
      description,
      keywords:
        locale === "ko"
          ? "MICE 솔루션, 비즈니스 이벤트, 회의, 컨퍼런스, 한국"
          : "MICE solutions, business events, meetings, conferences, Korea",
      openGraph: {
        title,
        description,
        type: "article",
        url: `${baseUrl}/${locale}/mice-solutions/${id}`,
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: imageAlt,
          },
        ],
        publishedTime: post.createdAt || undefined,
        modifiedTime: post.updatedAt || undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [fullImageUrl],
      },
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return {
      title: "Error - The Ace Tour",
    };
  }
}

export default async function page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  try {
    // Safely resolve params with fallback
    const resolvedParams = (await params) || { locale: "en", id: "" };
    const localeToUse = resolvedParams.locale || "en";
    const idToUse = resolvedParams.id || "";
    // Set the locale for the request
    setRequestLocale(localeToUse);

    // Get locale and translations
    const locale = await getLocale();
    const t = await getTranslations("MiceCTA");

    // Fetch the post data
    const post = await getPostById(idToUse);

    if (!post) {
      return redirect({
        href: "/mice-solutions",
        locale: resolvedParams.locale,
      });
    }

    return (
      <main className="relative">
        {/* Pattern Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
          <Image
            src={PatternBG}
            alt="Background pattern"
            fill
            className="object-cover opacity-60"
            sizes="100vw"
            priority
          />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12">
              {locale === "ko" ? post.KOtitle : post.ENGtitle}
            </h1>

            {/* Date */}
            <p className="text-gray-600 mb-8 text-center">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString(
                    locale === "ko" ? "ko-KR" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )
                : new Date().toLocaleDateString(
                    locale === "ko" ? "ko-KR" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
            </p>

            {/* Image Carousel */}
            <div className="w-full max-w-5xl mx-auto mb-12">
              <PostImageCarousel
                mainImage={{
                  path: post.imgPath,
                  ENGAlt: post.imgENGAlt,
                  KOAlt: post.imgKOAlt,
                }}
                additionalImages={post.postImageImages}
              />
            </div>

            {/* Short Content */}
            <div className="max-w-5xl mx-auto mb-8 text-lg text-center">
              <p>{locale === "ko" ? post.KOcontent : post.ENGcontent}</p>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto w-full bg-white/80 backdrop-blur-sm p-6 md:p-8 lg:p-10 rounded-lg shadow-sm">
              <HtmlContent
                html={
                  locale === "ko" ? post.mainKOContent : post.mainENGContent
                }
                className="text-gray-800"
              />
            </div>

            {/* Buttons Container */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
              {/* Back to MICE Solutions Button */}
              <Link
                href="/mice-solutions"
                className="inline-flex items-center justify-center h-12 w-[251px] rounded-[10px] text-white bg-highlight-blue hover:bg-highlight-blue/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight-blue"
              >
                <span className="text-base font-medium leading-6">
                  ← Back to MICE Solutions
                </span>
              </Link>

              {/* CTA Button */}
              <Link
                href="/support"
                className="group inline-flex h-12 w-[251px] items-center justify-between rounded-[10px] bg-highlight-blue hover:bg-highlight-blue/80 pl-5 pr-1 text-white transition-all"
              >
                <span className="text-base font-medium leading-6">
                  {t("button")}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white">
                  <svg
                    className="h-5 w-5 transform text-[#1976D2] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-105"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.83331 14.1667L14.1666 5.83334M14.1666 5.83334H6.66665M14.1666 5.83334V13.3333"
                      stroke="currentColor"
                      strokeWidth="1.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error in mice-solutions/[id]/page:", error);
    notFound();
  }
}
