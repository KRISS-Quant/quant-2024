"use client";
import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export interface CustomSelectProps {
  items: string[];
  placeholder: string;
  onChange?: (value: string) => void; // Make onChange optional
  isMainPage?: boolean;
}

const SelectCustom: React.FC<CustomSelectProps> = ({
  items,
  placeholder,
  onChange,
  isMainPage = false,
}) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger
        className={
          isMainPage
            ? "w-full border border-primary"
            : "w-full border border-secondary"
        }
      >
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
