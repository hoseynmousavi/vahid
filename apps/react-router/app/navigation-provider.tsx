import { NavigationProvider } from "@stack/ui";
import { useNavigate } from "react-router";
import type { ReactNode } from "react";

export function AppNavigationProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <NavigationProvider navigate={(href) => navigate(href)}>
      {children}
    </NavigationProvider>
  );
}
