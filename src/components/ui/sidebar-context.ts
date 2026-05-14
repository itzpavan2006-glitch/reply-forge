import { createContext, useContext } from "react";

export type SidebarState = "expanded" | "collapsed";

export type SidebarContextValue = {
  state: SidebarState;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
