import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Ensure this is imported globally, e.g., in App.css or index.css, for best results
import { FaRegCalendarAlt } from "react-icons/fa";

type DateRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
};

// Custom button for react-datepicker input
const CustomDateInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; placeholder?: string }
>(({ value, onClick, placeholder }, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    // Make buttons compact and align items. Reduced width for compactness.
    className="flex items-center justify-between gap-1 rounded-md border border-neutral-600 bg-neutral-700 px-2 py-1 text-xs text-white shadow-sm hover:bg-neutral-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 transition-colors w-[90px] min-w-[90px]"
  >
    <FaRegCalendarAlt className="text-amber-400 text-sm" /> {/* Smaller icon */}
    {/* Text alignment and overflow handling for compact button */}
    <span className="text-right text-ellipsis overflow-hidden whitespace-nowrap">{value || placeholder}</span>
  </button>
));

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    // This div needs to be a horizontal flex container for the two DatePickers
    <div className="flex gap-2 relative z-50 flex-wrap justify-end"> {/* Use flex-wrap to ensure they stack on very small screens if needed */}
      {/* From Date */}
      <DatePicker
        selected={startDate}
        onChange={onStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        dateFormat="dd/MM/yyyy"
        placeholderText="From Date"
        customInput={<CustomDateInput />}
        popperPlacement="bottom-start"
        popperClassName="react-datepicker-popper-dark-theme"
      />

      {/* To Date */}
      <DatePicker
        selected={endDate}
        onChange={onEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate} // Ensures end date is not before start date
        dateFormat="dd/MM/yyyy"
        placeholderText="To Date"
        customInput={<CustomDateInput />}
        popperPlacement="bottom-start"
        popperClassName="react-datepicker-popper-dark-theme"
      />
    </div>
  );
};

export default DateRangePicker;