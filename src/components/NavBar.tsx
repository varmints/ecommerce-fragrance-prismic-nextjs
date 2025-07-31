"use client";

import { useParams } from "next/navigation";
import { Content } from "@prismicio/client";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import {
  HiBars3,
  HiMagnifyingGlass,
  HiShoppingBag,
  HiUser,
  HiXMark,
} from "react-icons/hi2";
import { TransitionLink } from "@/components/TransitionLink";
import {
  LanguageSwitcher,
  type LanguageSwitcherProps,
} from "@/components/LanguageSwitcher";
import { useSearch } from "@/context/SearchContext";
import { SearchModal } from "./SearchModal";
import { useCart } from "@/context/CartContext";

type NavIconsProps = {
  className?: string;
  tabIndex?: number;
  onLinkClick?: () => void;
};

const NavIcons = ({ className = "", tabIndex, onLinkClick }: NavIconsProps) => {
  const { openSearch } = useSearch();
  const params = useParams();
  const lang = params.lang as string;

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openSearch();
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div className={clsx("flex items-center gap-8", className)}>
      <button
        className="cursor-pointer text-white"
        aria-label="Search"
        tabIndex={tabIndex}
        onClick={handleSearchClick}
      >
        <HiMagnifyingGlass size={24} />
      </button>
      <a
        href="#"
        className="text-white"
        aria-label="Account"
        tabIndex={tabIndex}
        onClick={onLinkClick}
      >
        <HiUser size={24} />
      </a>
      <TransitionLink
        href={`/${lang}/cart`}
        className="relative cursor-pointer text-white"
        aria-label="Cart"
        tabIndex={tabIndex}
        onClick={onLinkClick}
      >
        <HiShoppingBag size={24} />
        <CartItemCount />
      </TransitionLink>
    </div>
  );
};

const CartItemCount = () => {
  const { totalItems } = useCart();
  if (totalItems === 0) return null;
  return (
    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
      {totalItems}
    </span>
  );
};

type NavBarProps = {
  settings: Content.SettingsDocument;
  locales: LanguageSwitcherProps["locales"];
};

export const NavBar = ({ settings, locales }: NavBarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { totalItems } = useCart();
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const { lang } = useParams();

  return (
    <>
      <header>
        <div className="navbar fixed top-0 left-0 z-50 w-full bg-black text-white">
          <div className="flex items-center justify-between p-2 md:p-4">
            <button
              onClick={toggleDrawer}
              aria-label="Menu"
              className="relative cursor-pointer p-2 text-white transition-colors duration-300 hover:bg-white/20"
            >
              <HiBars3 size={24} />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1 flex size-3 md:hidden">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-white"></span>
                </span>
              )}
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 transform">
              <TransitionLink href={`/${lang}`}>
                <Image
                  src="/logo.svg"
                  alt="Côte Royale Paris"
                  width={180}
                  height={30}
                  className="w-32 md:w-44"
                />
              </TransitionLink>
            </div>

            <div className="flex">
              <NavIcons className="hidden md:flex" />
              <LanguageSwitcher locales={locales} className="md:ml-8" />
            </div>
          </div>
        </div>

        <div
          className={clsx(
            "nav-drawer-blur fixed inset-0 z-40 bg-black/40 opacity-0 transition-all duration-500",
            isDrawerOpen
              ? "pointer-events-auto opacity-100 backdrop-blur-xs"
              : "pointer-events-none backdrop-blur-none",
          )}
          onClick={toggleDrawer}
          aria-hidden="true"
        />

        <div
          className={clsx(
            "nav-drawer fixed top-0 left-0 z-50 h-full w-72 bg-neutral-900 p-6 transition-transform duration-500",
            isDrawerOpen ? "translate-x-0" : "-translate-x-full",
          )}
          role="dialog"
          aria-modal={isDrawerOpen}
        >
          <div className="mb-6 flex justify-end">
            <button
              className="cursor-pointer p-2 text-white transition-colors duration-300 hover:bg-white/10"
              onClick={toggleDrawer}
              aria-label="Close Menu"
              tabIndex={isDrawerOpen ? 0 : -1}
            >
              <HiXMark size={24} />
            </button>
          </div>

          <nav className="space-y-4" aria-label="Main Navigation">
            {settings.data.navigation_link.map((link) => (
              <TransitionLink
                field={link}
                onClick={() => setIsDrawerOpen(false)}
                key={link.key}
                className="block border-b border-white/10 py-2 text-xl font-semibold tracking-wide text-white uppercase hover:text-gray-300"
                tabIndex={isDrawerOpen ? 0 : -1}
              />
            ))}
            <div className="pt-4 md:hidden">
              <NavIcons
                className="justify-around"
                tabIndex={isDrawerOpen ? 0 : -1}
                onLinkClick={() => setIsDrawerOpen(false)}
              />
            </div>
          </nav>
        </div>
      </header>
      <SearchModal />
    </>
  );
};
