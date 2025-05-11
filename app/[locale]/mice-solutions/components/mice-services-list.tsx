"use client";

import { cn } from "@/lib/cn";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MiceServicesList = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const list = [
    {
      title: "전략적 전시 기획 및 관리",
      description:
        "저희의 종합적인 기획 방식은 고객님의 구체적인 비즈니스 목표와 전시회 타깃 관객을 이해하는 것부터 시작합니다. 경쟁사 현황을 분석하고, 맞춤형 목표를 개발하며, 상세한 일정표를 작성하고, 투자 수익률을 추적하기 위한 측정 전략을 구현합니다. 저희 경험 많은 팀은 문제가 발생하기 전에 미리 예측하고, 모든 계획에 유연성을 구축하며, 전시회 참가가 고객님의 더 넓은 마케팅 및 비즈니스 개발 전략과 완벽하게 일치하도록 보장합니다. 결과적으로? 고객님 팀의 스트레스는 최소화하면서 최대의 효과를 얻을 수 있습니다.",
    },
    {
      title: "맞춤형 부스 디자인 및 제작",
      description:
        "저희의 종합적인 기획 방식은 고객님의 구체적인 비즈니스 목표와 전시회 타깃 관객을 이해하는 것부터 시작합니다. 경쟁사 현황을 분석하고, 맞춤형 목표를 개발하며, 상세한 일정표를 작성하고, 투자 수익률을 추적하기 위한 측정 전략을 구현합니다. 저희 경험 많은 팀은 문제가 발생하기 전에 미리 예측하고, 모든 계획에 유연성을 구축하며, 전시회 참가가 고객님의 더 넓은 마케팅 및 비즈니스 개발 전략과 완벽하게 일치하도록 보장합니다. 결과적으로? 고객님 팀의 스트레스는 최소화하면서 최대의 효과를 얻을 수 있습니다.",
    },
    {
      title: "마케팅 자료 및 홍보",
      description:
        "저희의 종합적인 기획 방식은 고객님의 구체적인 비즈니스 목표와 전시회 타깃 관객을 이해하는 것부터 시작합니다. 경쟁사 현황을 분석하고, 맞춤형 목표를 개발하며, 상세한 일정표를 작성하고, 투자 수익률을 추적하기 위한 측정 전략을 구현합니다. 저희 경험 많은 팀은 문제가 발생하기 전에 미리 예측하고, 모든 계획에 유연성을 구축하며, 전시회 참가가 고객님의 더 넓은 마케팅 및 비즈니스 개발 전략과 완벽하게 일치하도록 보장합니다. 결과적으로? 고객님 팀의 스트레스는 최소화하면서 최대의 효과를 얻을 수 있습니다.",
    },
    {
      title: "행사장 선정 및 물류 지원",
      description:
        "저희의 종합적인 기획 방식은 고객님의 구체적인 비즈니스 목표와 전시회 타깃 관객을 이해하는 것부터 시작합니다. 경쟁사 현황을 분석하고, 맞춤형 목표를 개발하며, 상세한 일정표를 작성하고, 투자 수익률을 추적하기 위한 측정 전략을 구현합니다. 저희 경험 많은 팀은 문제가 발생하기 전에 미리 예측하고, 모든 계획에 유연성을 구축하며, 전시회 참가가 고객님의 더 넓은 마케팅 및 비즈니스 개발 전략과 완벽하게 일치하도록 보장합니다. 결과적으로? 고객님 팀의 스트레스는 최소화하면서 최대의 효과를 얻을 수 있습니다.",
    },
    {
      title: "스폰서십 조율",
      description:
        "저희의 종합적인 기획 방식은 고객님의 구체적인 비즈니스 목표와 전시회 타깃 관객을 이해하는 것부터 시작합니다. 경쟁사 현황을 분석하고, 맞춤형 목표를 개발하며, 상세한 일정표를 작성하고, 투자 수익률을 추적하기 위한 측정 전략을 구현합니다. 저희 경험 많은 팀은 문제가 발생하기 전에 미리 예측하고, 모든 계획에 유연성을 구축하며, 전시회 참가가 고객님의 더 넓은 마케팅 및 비즈니스 개발 전략과 완벽하게 일치하도록 보장합니다. 결과적으로? 고객님 팀의 스트레스는 최소화하면서 최대의 효과를 얻을 수 있습니다.",
    },
  ];

  const handlePrev = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? list.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === list.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="grid sm:grid-cols-8 max-w-screen-xl mt-16 mx-auto rounded-2xl overflow-clip border-[#D4D4D4] border">
      {/* List items carousel for small screens */}
      <div className="sm:hidden col-span-full bg-[#F5F5F5] p-4 border-b border-[#D4D4D4] flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Previous item"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <div className="font-bold text-center flex-grow px-2 truncate">
          {list[selectedIndex].title}
        </div>
        <button
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Next item"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      </div>

      {/* List items for medium screens and up */}
      <ul className={cn("col-span-3 hidden sm:block")}>
        {list.map((item, i) => (
          <li
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={cn(
              "bg-[#F5F5F5] p-4 font-bold not-last:border-b border-[#D4D4D4] cursor-pointer border-r transition-all duration-300",
              selectedIndex === i && "bg-white border-r-0"
            )}
          >
            {item.title}
          </li>
        ))}
      </ul>
      <div className="col-span-full sm:col-span-5 flex justify-center px-8 py-4 flex-col gap-4 bg-white relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-2xl lg:text-4xl font-bold">
              {list[selectedIndex].title}
            </h3>
            <p className="text-sm">{list[selectedIndex].description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MiceServicesList;
