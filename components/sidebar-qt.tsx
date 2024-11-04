import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"  
import { Button } from "./ui/button"
import { DateTimePicker } from "./ui/date-time-picker"

const algorithms = ["SMA", "EMA", "Pair", "Bollinger", "RSI"]
const intervals = ["1m", "5m", "15m", "30m", "1h", "4h", "1d"]

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Parameter</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
                <SidebarMenuItem key="title">
                    <label>Parameters</label>
                </SidebarMenuItem>
                <SidebarMenuItem key="algorithms">
                    <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                        {algorithms.map((algorithm) => (
                        <SelectItem key={algorithm} value={algorithm}>
                            {algorithm}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </SidebarMenuItem>
                <SidebarMenuItem key="interval">
                    <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Time Interval" />
                    </SelectTrigger>
                    <SelectContent>
                        {intervals.map((interval) => (
                        <SelectItem key={interval} value={interval}>
                            {interval}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </SidebarMenuItem>
                <SidebarMenuItem key="time-select">
                    <DateTimePicker />
                    <DateTimePicker />
                </SidebarMenuItem>
                <SidebarMenuItem key="submit">
                    <Button>Go</Button>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
