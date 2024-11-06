import { SelectCustom } from "@/components/ui/select-custom"  
import { Button } from "./ui/button"
import { DateTimePickerCustom } from "./ui/date-time-picker-custom"

const algorithms = ["SMA", "EMA", "Pair", "Bollinger", "RSI"]
const intervals = ["1m", "5m", "15m", "30m", "1h", "4h", "1d"]

export function SidebarComponent() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-[80%] mx-auto">
        <SelectCustom items={algorithms} placeholder="Select Algorithm"/>
        <SelectCustom items={intervals} placeholder="Select Time Interval"/>
        
        <DateTimePickerCustom />
        
        <Button className="w-full bg-btn-secondary hover:bg-btn-accent">GO</Button>
    </div>
  )
}
