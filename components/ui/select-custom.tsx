"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface CustomSelectProps {
  items: string[];
  placeholder: string;
  onChange?: (value: string) => void; // Make onChange optional
  isMainPage?: boolean;
}

const SelectCustom: React.FC<CustomSelectProps> = ({
  items,
  placeholder,
  onChange,
  isMainPage,
}) => {
  var selectTriggerClass = "w-full border border-primary";
  if (isMainPage) {
    selectTriggerClass = "w-full border border-secondary";
  }
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className={selectTriggerClass}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align="end">
        {items.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export { SelectCustom };
