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

export interface SidebarProviderProps {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export interface SidebarProps {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
  className?: string
  children?: ReactNode
}