import { DateTimePicker } from "@/components/ui/date-time-picker";

interface DateTimePickerCustomProps {
  isMainPage?: boolean; // Make it optional
}

export function DateTimePickerCustom({
  isMainPage = false,
}: DateTimePickerCustomProps) {
  return (
    <>
      <DateTimePicker placeholder="From Time" isMainPage={isMainPage} />
      <DateTimePicker placeholder="To Time" isMainPage={isMainPage} />
    </>
  );
}
