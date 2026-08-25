"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Navigate = (href: string) => void;
type NavigationContextValue = {
  navigate: Navigate;
  search: string | null;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useSharedNavigate() {
  return useContext(NavigationContext)?.navigate ?? null;
}

export function useSharedSearch() {
  return useContext(NavigationContext)?.search ?? null;
}

export function NavigationProvider({
  children,
  navigate,
}: {
  children: ReactNode;
  navigate: Navigate;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
          },
        },
      }),
  );
  const [search, setSearch] = useState<string | null>(null);

  useEffect(() => {
    function syncFromBrowser() {
      setSearch(window.location.search);
    }

    syncFromBrowser();
    window.addEventListener("popstate", syncFromBrowser);
    return () => window.removeEventListener("popstate", syncFromBrowser);
  }, []);

  const sharedNavigate = useCallback(
    (href: string) => {
      setSearch(new URL(href, window.location.href).search);
      navigate(href);
    },
    [navigate],
  );

  const value = useMemo(
    () => ({ navigate: sharedNavigate, search }),
    [search, sharedNavigate],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContext.Provider value={value}>
        {children}
      </NavigationContext.Provider>
    </QueryClientProvider>
  );
}

export function SharedLink({
  "aria-label": ariaLabel,
  children,
  className,
  href,
  title,
}: {
  "aria-label"?: string;
  children: ReactNode;
  className?: string;
  href: string;
  title?: string;
}) {
  const navigate = useSharedNavigate();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      !navigate ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(href);
  }

  return (
    <a
      aria-label={ariaLabel}
      className={className}
      href={href}
      onClick={handleClick}
      title={title}
    >
      {children}
    </a>
  );
}
