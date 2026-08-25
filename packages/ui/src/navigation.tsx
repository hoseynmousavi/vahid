"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type MouseEvent,
  type ReactNode,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Navigate = (href: string) => void;
type LinkProps = {
  "aria-label"?: string;
  children: ReactNode;
  className?: string;
  href: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  title?: string;
};
type NavigationContextValue = {
  LinkComponent?: ComponentType<LinkProps>;
  beginNavigation: Navigate;
  completeNavigation: () => void;
  navigate: Navigate;
  pendingHref: string | null;
  search: string | null;
  syncSearch: Navigate;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useSharedNavigate() {
  return useContext(NavigationContext)?.navigate ?? null;
}

export function useSharedSearch() {
  return useContext(NavigationContext)?.search ?? null;
}

export function useSharedPendingNavigation() {
  const navigation = useContext(NavigationContext);

  return {
    completeNavigation: navigation?.completeNavigation,
    pendingHref: navigation?.pendingHref ?? null,
  };
}

export function NavigationProvider({
  children,
  linkComponent,
  navigate,
}: {
  children: ReactNode;
  linkComponent?: ComponentType<LinkProps>;
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
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);

  useEffect(() => {
    function syncFromBrowser() {
      setSearch(window.location.search);
    }

    syncFromBrowser();
    window.addEventListener("popstate", syncFromBrowser);
    return () => window.removeEventListener("popstate", syncFromBrowser);
  }, []);

  const syncSearch = useCallback((href: string) => {
    setSearch(new URL(href, window.location.href).search);
  }, []);
  const beginNavigation = useCallback((href: string) => {
    setPendingHref(href);
  }, []);
  const completeNavigation = useCallback(() => {
    setPendingHref(null);
  }, []);

  useEffect(() => {
    if (!pendingHref) return;

    const timeout = window.setTimeout(completeNavigation, 15_000);
    return () => window.clearTimeout(timeout);
  }, [completeNavigation, pendingHref]);

  const sharedNavigate = useCallback(
    (href: string) => {
      syncSearch(href);
      navigate(href);
    },
    [navigate, syncSearch],
  );

  const value = useMemo(
    () => ({
      LinkComponent: linkComponent,
      beginNavigation,
      completeNavigation,
      navigate: sharedNavigate,
      pendingHref,
      search,
      syncSearch,
    }),
    [
      beginNavigation,
      completeNavigation,
      linkComponent,
      pendingHref,
      search,
      sharedNavigate,
      syncSearch,
    ],
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
}: LinkProps) {
  const navigation = useContext(NavigationContext);
  const LinkComponent = navigation?.LinkComponent;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      !navigation?.navigate ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (LinkComponent) {
      const target = new URL(href, window.location.href);

      if (
        target.origin === window.location.origin &&
        target.pathname !== window.location.pathname
      ) {
        navigation.beginNavigation(href);
      }

      navigation.syncSearch(href);
      return;
    }

    event.preventDefault();
    navigation.navigate(href);
  }

  if (LinkComponent) {
    return (
      <LinkComponent
        aria-label={ariaLabel}
        className={className}
        href={href}
        onClick={handleClick}
        title={title}
      >
        {children}
      </LinkComponent>
    );
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
