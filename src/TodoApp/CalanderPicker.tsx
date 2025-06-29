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
    // Premium styling: darker background, subtle border, rounded, accent hover
    className="flex items-center gap-2 rounded-md border border-neutral-600 bg-neutral-700 px-3 py-1.5 text-sm text-white shadow-sm hover:bg-neutral-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 transition-colors"
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
    // Z-index for the date picker overlay to appear above other content
    <div className="relative z-50">
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        customInput={<CalendarButton />}
        // You might need to add global CSS for react-datepicker popup styles
        // Example: .react-datepicker { background-color: #333; border: 1px solid #555; }
        // .react-datepicker__header { background-color: #444; } etc.
      />
    </div>
  );
};

export default CalendarPicker;
