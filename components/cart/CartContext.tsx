"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { LocalizedString } from "@/lib/content";

export type CartLine = {
  key: string;
  nome: LocalizedString;
  preco: number;
  qty: number;
  nota: string;
};

export type Extra = { id: string; text: string };

type AddPayload = { key: string; nome: LocalizedString; preco: number };

type CartContextValue = {
  lines: CartLine[];
  extras: Extra[];
  count: number;
  total: number;
  isOpen: boolean;
  ready: boolean;
  add: (item: AddPayload) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  remove: (key: string) => void;
  setNote: (key: string, nota: string) => void;
  addExtra: (text: string) => void;
  removeExtra: (id: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  qtyOf: (key: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "pedido:casa-fernanda:v1";
const STORAGE_KEY_EXTRAS = "pedido:casa-fernanda:extras:v1";

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
      const rawExtras = localStorage.getItem(STORAGE_KEY_EXTRAS);
      if (rawExtras) setExtras(JSON.parse(rawExtras));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      localStorage.setItem(STORAGE_KEY_EXTRAS, JSON.stringify(extras));
    } catch {
      /* ignore */
    }
  }, [lines, extras, ready]);

  const api = useMemo<CartContextValue>(() => {
    const add = ({ key, nome, preco }: AddPayload) =>
      setLines((prev) => {
        const found = prev.find((l) => l.key === key);
        if (found) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l));
        return [...prev, { key, nome, preco, qty: 1, nota: "" }];
      });

    const inc = (key: string) =>
      setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)));

    const dec = (key: string) =>
      setLines((prev) =>
        prev
          .map((l) => (l.key === key ? { ...l, qty: l.qty - 1 } : l))
          .filter((l) => l.qty > 0),
      );

    const remove = (key: string) => setLines((prev) => prev.filter((l) => l.key !== key));

    const setNote = (key: string, nota: string) =>
      setLines((prev) => prev.map((l) => (l.key === key ? { ...l, nota } : l)));

    const addExtra = (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setExtras((prev) => [...prev, { id: makeId(), text: trimmed }]);
    };

    const removeExtra = (id: string) => setExtras((prev) => prev.filter((e) => e.id !== id));

    const clear = () => {
      setLines([]);
      setExtras([]);
    };

    const count = lines.reduce((sum, l) => sum + l.qty, 0) + extras.length;
    const total = lines.reduce((sum, l) => sum + l.qty * l.preco, 0);
    const qtyOf = (key: string) => lines.find((l) => l.key === key)?.qty ?? 0;

    return {
      lines,
      extras,
      count,
      total,
      isOpen,
      ready,
      add,
      inc,
      dec,
      remove,
      setNote,
      addExtra,
      removeExtra,
      clear,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      qtyOf,
    };
  }, [lines, extras, isOpen, ready]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
