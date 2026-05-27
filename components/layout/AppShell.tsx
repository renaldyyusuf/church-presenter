"use client"

import { Sidebar }        from "./Sidebar"
import { BottomBar }      from "./BottomBar"
import { RightPanel }     from "./RightPanel"
import { ToastContainer } from "@/components/ui/Toast"
import { GlobalSearch }   from "@/components/ui/GlobalSearch"

interface AppShellProps { children: React.ReactNode }

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-surface-0)" }}>
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden ml-[52px]">
        <GlobalSearch />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto pb-12">
            {children}
          </div>
          <RightPanel />
        </div>
        <BottomBar />
      </main>
      <ToastContainer />
    </div>
  )
}
