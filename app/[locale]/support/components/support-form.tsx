"use client";

import { createInquiry } from "@/actions/inquiries";
import { Button } from "@/components/ui/button";
import { CreateInquiryType } from "@/db/schemas";
import { cn } from "@/lib/cn";
import { ActionResponse } from "@/types/actions";
import { useActionState } from "react";
import { useLocale } from "next-intl";
const initialState: ActionResponse<CreateInquiryType & { locale: string }> = {
  success: false,
  message: "",
};

export function SupportForm({ className }: { className?: string }) {
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(
    createInquiry,
    initialState
  );

  return (
    <div className="relative w-full max-w-[560px] mx-auto px-4 sm:px-6 lg:px-0 h-auto sm:h-[634px] rounded-lg">
      <form action={formAction} className={cn("space-y-6", className)}>
        <input type="hidden" name="locale" value={locale} />
        <div>
          <label
            htmlFor="type"
            className="text-base font-medium leading-6 tracking-[0] text-[#262626]"
          >
            Inquiry Type
          </label>
          <div className="mt-[16px]">
            <select
              id="type"
              name="type"
              required
              defaultValue={state?.inputs?.type}
              className="w-full border border-[#E5E7EB] rounded-[22px] px-[16px] py-[24px] bg-white focus:border-transparent placeholder:text-[#D4D4D4] placeholder:text-base placeholder:font-medium placeholder:leading-6 placeholder:tracking-normal"
            >
              <option value="">-Select-</option>
              <option value="Travel Consultion">Travel Consultation</option>
              <option value="Shuttle Service">Shuttle Service</option>
              <option value="MICE Service">MICE Service</option>
            </select>
            {state?.errors?.type && (
              <div className="text-red-500 text-sm mt-1">
                {state.errors.type[0]}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="name"
            className="text-base font-medium leading-6 tracking-[0] text-[#262626]"
          >
            Full Name
          </label>
          <div className="mt-[16px]">
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={state?.inputs?.name}
              placeholder="e.g Daisy Daisies"
              className="w-full border border-[#E5E7EB] rounded-[22px] px-[16px] py-[24px] bg-white focus:border-transparent placeholder:text-[#D4D4D4] placeholder:text-base placeholder:font-medium placeholder:leading-6 placeholder:tracking-normal"
            />
            {state?.errors?.name && (
              <div className="text-red-500 text-sm mt-1">
                {state.errors.name[0]}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="text-base font-medium leading-6 tracking-[0] text-[#262626]"
          >
            Email address
          </label>
          <div className="mt-[16px]">
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={state?.inputs?.email}
              placeholder="e.g Daisy@gmail.com"
              className="w-full border border-[#E5E7EB] rounded-[22px] px-[16px] py-[24px] bg-white focus:border-transparent placeholder:text-[#D4D4D4] placeholder:text-base placeholder:font-medium placeholder:leading-6 placeholder:tracking-normal"
            />
            {state?.errors?.email && (
              <div className="text-red-500 text-sm mt-1">
                {state.errors.email[0]}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="text-base font-medium leading-6 tracking-[0] text-[#262626]"
          >
            Your inquiry
          </label>
          <div className="mt-[16px]">
            <textarea
              id="message"
              name="message"
              required
              defaultValue={state?.inputs?.message}
              placeholder="Type your message..."
              className="w-full h-[150px] border border-[#E5E7EB] rounded-[22px] px-4 pt-[15px] pb-8 bg-white focus:border-transparent resize-none placeholder:text-[#D4D4D4] placeholder:text-base placeholder:font-medium placeholder:leading-6 placeholder:tracking-normal"
            />
            {state?.errors?.message && (
              <div className="text-red-500 text-sm mt-1">
                {state.errors.message[0]}
              </div>
            )}
          </div>
        </div>
        {state?.success && (
          <div className="text-highlight-blue text-base mt-1 font-bold">
            {state.message}
          </div>
        )}
        <Button
          type="submit"
          className="relative w-full h-[48px] rounded-[8px] bg-[#3B82F6] text-white text-xl font-medium leading-6 tracking-[0] cursor-pointer z-10 hover:bg-[#2563EB] flex items-center justify-between px-6"
          disabled={isPending}
        >
          <span>{isPending ? "Sending..." : "Send Inquiry"}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <svg
              className="h-5 w-5 transform text-[#3B82F6] transition-transform duration-200 group-hover:translate-x-1"
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
        </Button>
      </form>
    </div>
  );
}
