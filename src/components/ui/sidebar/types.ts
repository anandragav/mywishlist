import type { ReactNode } from "react"

export type SidebarState = "expanded" | "collapsed"

export interface SidebarContext {
  state: SidebarState
  open: boolean
  setOpen: (value: boolean | ((value: boolean) => boolean)) => void
  isMobile: boolean
  openMobile: boolean
  setOpenMobile: (value: boolean) => void
  toggleSidebar: () => void
}

export interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}