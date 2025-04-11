"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLocale } from "next-intl";

interface PostImageImage {
  id: string;
  imgPath: string;
  imgENGAlt: string;
  imgKOAlt: string;
}

interface PostImageCarouselProps {
  mainImage: {
    path: string;
    ENGAlt: string;
    KOAlt: string;
  };
  additionalImages?: PostImageImage[];
}

export function PostImageCarousel({ mainImage, additionalImages = [] }: PostImageCarouselProps) {
  const locale = useLocale();
  
  // Combine main image with additional images for the carousel
  const allImages = [
    {
      id: "main",
      imgPath: mainImage.path,
      imgENGAlt: mainImage.ENGAlt,
      imgKOAlt: mainImage.KOAlt,
    },
    ...additionalImages,
  ];

  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent>
        {allImages.map((image) => (
          <CarouselItem key={image.id} className="basis-full">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image
                src={image.imgPath}
                alt={locale === "ko" ? image.imgKOAlt : image.imgENGAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                quality={100}
                priority={image.id === "main"}
                unoptimized
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}