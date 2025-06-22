import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";

type CalendarProps = {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
};

// ForwardRef is required for custom input with react-datepicker
const CalendarButton = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void }
>(({ value, onClick }, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    className="flex items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm text-white shadow-sm hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
  >
    <FaRegCalendarAlt className="text-amber-400" />
    <span>{value || "Date"}</span>
  </button>
));

const CalendarPicker: React.FC<CalendarProps> = ({
  selectedDate,
  onChange,
}) => {
  return (
    <div className="relative z-50">
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        customInput={<CalendarButton />}
      />
    </div>
  );
};

export default CalendarPicker;
