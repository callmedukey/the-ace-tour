"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useState } from "react";
import Image from "next/image";
import Logo from "@/public/the-ace-logo.webp";
import { cn } from "@/lib/cn";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";

const Header = () => {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const [travelIsOpen, setTravelIsOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const links = [
    {
      href: "/",
      label: t("menu.home"),
    },
    {
      href: "/travel-packages",
      label: t("menu.travel-packages"),
      children: [
        {
          href: "/travel-packages/la-departure",
          label: t("menu.la-departure"),
        },
        {
          href: "/travel-packages/las-vegas-departure",
          label: t("menu.vegas-departure"),
        },
        {
          href: "/travel-packages/semi-package",
          label: t("menu.semi-package"),
        },
      ],
    },
    {
      href: "/shuttle-service",
      label: t("menu.shuttle-service"),
    },
    {
      href: "/mice-solutions",
      label: t("menu.mice-solutions"),
    },
    {
      href: "/support",
      label: t("menu.support"),
    },
  ];

  const generateLinks = ({ isMobile = false }: { isMobile: boolean }) => {
    return links.map((link) => {
      if (!link.children) {
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => {
              if (isMobile) {
                setSheetOpen(false);
              }
            }}
            className={cn(
              pathname === link.href ||
                (pathname.startsWith(link.href) && link.href !== "/")
                ? "text-highlight-blue"
                : null
            )}
          >
            {link.label}
          </Link>
        );
      } else if (!isMobile) {
        return (
          <DropdownMenu
            open={travelIsOpen}
            onOpenChange={setTravelIsOpen}
            key={link.href}
          >
            <DropdownMenuTrigger
              className={cn(
                "focus-within:outline-none flex gap-2 items-center cursor-pointer",
                pathname.startsWith("/travel-packages") && "text-highlight-blue"
              )}
            >
              {link.label}
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-200",
                  travelIsOpen && "transform rotate-180"
                )}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="font-medium mt-2">
              {link.children.map((child) => {
                return (
                  <DropdownMenuItem asChild key={child.href}>
                    <Link
                      href={child.href}
                      className={cn(
                        pathname.startsWith(child.href) && "text-highlight-blue"
                      )}
                    >
                      {child.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      } else if (isMobile) {
        return (
          <Accordion
            type="single"
            collapsible
            key={link.href}
            defaultValue="mobile-nav-menu"
          >
            <AccordionItem value="mobile-nav-menu">
              <AccordionTrigger className="font-semibold text-base py-0">
                <span>{link.label}</span>
              </AccordionTrigger>
              <AccordionContent className="pl-4 flex flex-col gap-2 py-4">
                {link.children.map((child) => {
                  return (
                    <Link
                      href={child.href}
                      key={child.href}
                      className={cn(
                        pathname.startsWith(child.href) && "text-highlight-blue"
                      )}
                      onClick={() => {
                        if (isMobile) {
                          setSheetOpen(false);
                        }
                      }}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      }

      return null;
    });
  };

  return (
    <header className="px-4 max-w-screen-2xl mx-auto py-6 flex relative h-[6.5rem] items-center justify-center isolate">
      <div className="w-28 absolute left-4">
        <Image src={Logo} quality={100} alt="The Ace Logo" priority />
      </div>
      <nav className="hidden gap-12 font-semibold lg:flex">
        {generateLinks({ isMobile: false })}
      </nav>
      <LanguageSwitcher wrapperClassName="absolute right-4 hidden lg:block" />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger
          className="lg:hidden ml-auto"
          aria-label="Mobile Menu Trigger"
        >
          <Menu />
        </SheetTrigger>
        <SheetContent className="w-1/2" draggable>
          <SheetHeader>
            <SheetTitle className="sr-only">Mobile menu</SheetTitle>
            <SheetDescription className="sr-only">
              This is a Mobile only menu. You can use it to navigate the
              website.
            </SheetDescription>
            <LanguageSwitcher wrapperClassName="" />
          </SheetHeader>
          <nav className="flex flex-col gap-4 font-semibold px-6 py-6 relative isolate">
            {generateLinks({ isMobile: true })}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
