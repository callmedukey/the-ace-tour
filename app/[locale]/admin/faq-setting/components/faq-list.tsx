"use client";

import { useState } from "react";
import { FaqForm } from "./faq-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FaqListProps {
  faqs: {
    id: number;
    KOquestion: string;
    ENGquestion: string;
    KOanswer: string;
    ENGanswer: string;
  }[];
}

export function FaqList({ faqs }: FaqListProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleAccordionChange = (value: string) => {
    const faqId = parseInt(value);
    setExpandedFaq(faqId === expandedFaq ? null : faqId);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Existing FAQs ({faqs.length})</h2>
      
      {faqs.length > 0 ? (
        <Accordion 
          type="single" 
          collapsible 
          className="w-full space-y-4"
          value={expandedFaq ? expandedFaq.toString() : undefined}
          onValueChange={handleAccordionChange}
        >
          {faqs.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id.toString()}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <AccordionTrigger className="text-lg font-medium">
                <div className="text-left">
                  <div>{faq.ENGquestion}</div>
                  <div className="text-gray-500 text-sm mt-1">{faq.KOquestion}</div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <FaqForm 
                  faqData={faq} 
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-white">
          <p className="text-gray-500">No FAQs found. Create your first FAQ using the form above.</p>
        </div>
      )}
    </div>
  );
}