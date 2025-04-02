"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const TravelPackagesMedia = ({
  images,
}: {
  images: { src: string; alt: string }[];
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleMediaNavigation = (direction: "prev" | "next") => {
    const imagesLength = images.length;

    if (direction === "next") {
      setCurrentMediaIndex((prev) => (prev + 1) % imagesLength);
    } else {
      setCurrentMediaIndex((prev) => (prev - 1 + imagesLength) % imagesLength);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images, currentMediaIndex]);
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full sm:w-[500px] md:w-[600px] lg:w-[782px] h-[300px] sm:h-[400px] md:h-[484.89px] rounded-[20px] overflow-hidden"
    >
      {/* Gallery Images */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full h-full"
      >
        <Image
          src={images[currentMediaIndex]?.src || images[0]?.src}
          alt={images[currentMediaIndex]?.alt || images[0]?.alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={100}
          unoptimized
        />
      </motion.div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex gap-[8px] sm:gap-[10px]">
        <button
          onClick={() => handleMediaNavigation("prev")}
          className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-[8px] p-[10px] sm:p-[12px] bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.8333 10H4.16667M4.16667 10L10 15.8333M4.16667 10L10 4.16667"
              stroke="#1976D2"
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={() => handleMediaNavigation("next")}
          className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-[8px] p-[10px] sm:p-[12px] bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333"
              stroke="#1976D2"
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default TravelPackagesMedia;
