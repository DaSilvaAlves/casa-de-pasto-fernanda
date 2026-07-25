"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatPrice } from "@/lib/content";
import { useCart } from "./CartContext";

export default function CartBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { count, total, openCart, ready, isOpen } = useCart();

  if (!ready || count === 0 || isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 pt-2">
      <button
        type="button"
        onClick={openCart}
        className="animate-slide-up flex w-full max-w-md items-center justify-between gap-4 rounded-full bg-gold px-5 py-3.5 text-bg shadow-[0_12px_40px_-8px_rgba(212,175,106,0.55)] transition-transform active:scale-[0.98]"
      >
        <span className="flex items-center gap-3">
          <span key={count} className="animate-badge flex h-7 min-w-7 items-center justify-center rounded-full bg-bg px-1.5 text-sm font-bold text-gold">
            {count}
          </span>
          <span className="font-bold">{dict.cart.viewOrder}</span>
        </span>
        <span className="font-bold tabular-nums">{formatPrice(total, locale)}</span>
      </button>
    </div>
  );
}
