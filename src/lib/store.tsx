"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { CartLine } from "@/lib/types";
import { getProduct } from "@/lib/data/products";

/* ------------------------------------------------------------------
   A single client-side store standing in for the eventual backend.
   Cart, wishlist and recently-viewed persist to localStorage; nothing
   leaves the browser.
------------------------------------------------------------------ */

const STORAGE_KEY = "ritza.store.v1";

export type Customer = { name: string; email: string };

type State = {
  cart: CartLine[];
  wishlist: string[];
  recent: string[];
  customer: Customer | null;
  hydrated: boolean;
};

type Action =
  | { type: "hydrate"; payload: Partial<State> }
  | { type: "cart/add"; line: CartLine }
  | { type: "cart/remove"; slug: string; size?: string }
  | { type: "cart/qty"; slug: string; size: string | undefined; quantity: number }
  | { type: "cart/clear" }
  | { type: "wishlist/toggle"; slug: string }
  | { type: "recent/push"; slug: string }
  | { type: "auth/in"; customer: Customer }
  | { type: "auth/out" };

const initial: State = { cart: [], wishlist: [], recent: [], customer: null, hydrated: false };

const sameLine = (a: CartLine, slug: string, size?: string) =>
  a.slug === slug && (a.size ?? "") === (size ?? "");

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.payload, hydrated: true };

    case "cart/add": {
      const existing = state.cart.find((l) => sameLine(l, action.line.slug, action.line.size));
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((l) =>
            sameLine(l, action.line.slug, action.line.size)
              ? { ...l, quantity: Math.min(10, l.quantity + action.line.quantity) }
              : l,
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.line] };
    }

    case "cart/remove":
      return { ...state, cart: state.cart.filter((l) => !sameLine(l, action.slug, action.size)) };

    case "cart/qty":
      return {
        ...state,
        cart: state.cart
          .map((l) =>
            sameLine(l, action.slug, action.size)
              ? { ...l, quantity: Math.max(0, Math.min(10, action.quantity)) }
              : l,
          )
          .filter((l) => l.quantity > 0),
      };

    case "cart/clear":
      return { ...state, cart: [] };

    case "wishlist/toggle":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.slug)
          ? state.wishlist.filter((s) => s !== action.slug)
          : [action.slug, ...state.wishlist],
      };

    case "recent/push":
      return {
        ...state,
        recent: [action.slug, ...state.recent.filter((s) => s !== action.slug)].slice(0, 8),
      };

    case "auth/in":
      return { ...state, customer: action.customer };

    case "auth/out":
      return { ...state, customer: null };

    default:
      return state;
  }
}

export type Toast = { id: number; title: string; body?: string; image?: string };

type StoreValue = {
  cart: CartLine[];
  wishlist: string[];
  recent: string[];
  customer: Customer | null;
  hydrated: boolean;
  count: number;
  subtotal: number;
  addToCart: (line: CartLine, opts?: { silent?: boolean; openDrawer?: boolean }) => void;
  removeFromCart: (slug: string, size?: string) => void;
  setQuantity: (slug: string, size: string | undefined, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  inWishlist: (slug: string) => boolean;
  pushRecent: (slug: string) => void;
  signIn: (customer: Customer) => void;
  signOut: () => void;
  /* overlays */
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  toasts: Toast[];
  dismissToast: (id: number) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      dispatch({ type: "hydrate", payload: raw ? JSON.parse(raw) : {} });
    } catch {
      dispatch({ type: "hydrate", payload: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          cart: state.cart,
          wishlist: state.wishlist,
          recent: state.recent,
          customer: state.customer,
        }),
      );
    } catch {
      /* private mode, quota — the session still works, it just won't persist */
    }
  }, [state.cart, state.wishlist, state.recent, state.customer, state.hydrated]);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++toastId.current;
      setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
      setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast],
  );

  const addToCart = useCallback<StoreValue["addToCart"]>(
    (line, opts) => {
      dispatch({ type: "cart/add", line });
      const product = getProduct(line.slug);
      if (!opts?.silent && product) {
        toast({ title: "Added to bag", body: product.name, image: product.images[0] });
      }
      if (opts?.openDrawer) setCartOpen(true);
    },
    [toast],
  );

  const removeFromCart = useCallback((slug: string, size?: string) => {
    dispatch({ type: "cart/remove", slug, size });
  }, []);

  const setQuantity = useCallback((slug: string, size: string | undefined, quantity: number) => {
    dispatch({ type: "cart/qty", slug, size, quantity });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "cart/clear" }), []);

  const toggleWishlist = useCallback(
    (slug: string) => {
      const adding = !state.wishlist.includes(slug);
      dispatch({ type: "wishlist/toggle", slug });
      const product = getProduct(slug);
      if (product) {
        toast({
          title: adding ? "Saved to wishlist" : "Removed from wishlist",
          body: product.name,
          image: product.images[0],
        });
      }
    },
    [state.wishlist, toast],
  );

  const pushRecent = useCallback((slug: string) => dispatch({ type: "recent/push", slug }), []);

  const signIn = useCallback((customer: Customer) => dispatch({ type: "auth/in", customer }), []);
  const signOut = useCallback(() => dispatch({ type: "auth/out" }), []);

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const line of state.cart) {
      const product = getProduct(line.slug);
      if (!product) continue;
      count += line.quantity;
      subtotal += product.price * line.quantity;
    }
    return { count, subtotal };
  }, [state.cart]);

  /* One overlay at a time. */
  useEffect(() => {
    if (cartOpen) {
      setSearchOpen(false);
      setNavOpen(false);
    }
  }, [cartOpen]);
  useEffect(() => {
    if (searchOpen) {
      setCartOpen(false);
      setNavOpen(false);
    }
  }, [searchOpen]);
  useEffect(() => {
    if (navOpen) {
      setCartOpen(false);
      setSearchOpen(false);
    }
  }, [navOpen]);

  const value: StoreValue = {
    cart: state.cart,
    wishlist: state.wishlist,
    recent: state.recent,
    customer: state.customer,
    hydrated: state.hydrated,
    count,
    subtotal,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
    toggleWishlist,
    inWishlist: (slug) => state.wishlist.includes(slug),
    pushRecent,
    signIn,
    signOut,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    navOpen,
    setNavOpen,
    toasts,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

/* Header inverts over dark hero sections; pages declare which they are. */
type HeaderTone = "light" | "dark";
const HeaderToneContext = createContext<{
  tone: HeaderTone;
  setTone: (t: HeaderTone) => void;
}>({ tone: "dark", setTone: () => {} });

export function HeaderToneProvider({ children }: { children: React.ReactNode }) {
  const [tone, setTone] = useState<HeaderTone>("dark");
  return (
    <HeaderToneContext.Provider value={{ tone, setTone }}>{children}</HeaderToneContext.Provider>
  );
}

export const useHeaderTone = () => useContext(HeaderToneContext);

/** Drop into any page whose hero is dark, so the header renders in ivory. */
export function HeaderTone({ tone }: { tone: HeaderTone }) {
  const { setTone } = useHeaderTone();
  useEffect(() => {
    setTone(tone);
    return () => setTone("dark");
  }, [tone, setTone]);
  return null;
}
