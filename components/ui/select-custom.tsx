"use client"

import { Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem  
} from "@/components/ui/select"

interface CustomSelectProps {
  items: string[];
  placeholder: string;
}

const SelectCustom: React.FC<CustomSelectProps> = ({ items, placeholder }) => {
  return (
    <Select>
      <SelectTrigger className="w-full border border-secondary">
          <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align='end'>
          {items.map((item) => (
          <SelectItem key={item} value={item}>
              {item}
          </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}
export {
  SelectCustom
}
