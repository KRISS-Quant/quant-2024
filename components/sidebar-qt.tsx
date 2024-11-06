import { Label } from "./ui/label"
import {
    Sidebar,
    SidebarContent
  } from "@/components/ui/sidebar"

import { SidebarComponent } from "@/components/sidebar-comp"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
          <Label className="text-xl text-secondary">Parameters</Label>
          <SidebarComponent/>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
