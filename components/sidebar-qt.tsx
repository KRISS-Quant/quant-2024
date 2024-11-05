import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"  
import { Button } from "./ui/button"
import { DateTimePicker } from "./ui/date-time-picker"
import { Label } from "./ui/label"

const algorithms = ["SMA", "EMA", "Pair", "Bollinger", "RSI"]
const intervals = ["1m", "5m", "15m", "30m", "1h", "4h", "1d"]
const QT_BLUE = "#23365C"

export function AppSidebar() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Label className="text-xl qt-blue">Parameters</Label>
        
        <Select>
        <SelectTrigger className="w-[280px] border qt-blue">
            <SelectValue placeholder="Select Algorithm" />
        </SelectTrigger>
        <SelectContent align='end'>
            {algorithms.map((algorithm) => (
            <SelectItem key={algorithm} value={algorithm}>
                {algorithm}
            </SelectItem>
            ))}
        </SelectContent>
        </Select>
        
        <Select>
        <SelectTrigger className="w-[280px] border qt-blue">
            <SelectValue placeholder="Select Time Interval" />
        </SelectTrigger>
        <SelectContent align='end'>
            {intervals.map((interval) => (
            <SelectItem key={interval} value={interval}>
                {interval}
            </SelectItem>
            ))}
        </SelectContent>
        </Select>
        
        <DateTimePicker placeholder="From time" />
        <DateTimePicker placeholder="To time" />
        
        <Button className="w-[280px] qt-blue-btn">GO</Button>
    </div>
  )
}
