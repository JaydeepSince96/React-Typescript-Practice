import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";

// A well-styled custom input for the date picker
const CustomDateInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; placeholder?: string }
>(({ value, onClick, placeholder }, ref) => (
  <button
    type="button" // Prevents the button from submitting the form
    onClick={onClick}
    ref={ref}
    className="flex w-full items-center justify-between gap-2 rounded-md border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white shadow-sm transition-colors hover:bg-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
  >
    <span className="text-ellipsis overflow-hidden whitespace-nowrap">
      {value || placeholder}
    </span>
    <FaRegCalendarAlt className="text-amber-400 text-lg ml-auto shrink-0" />
  </button>
));
CustomDateInput.displayName = 'CustomDateInput';


type SingleDatePickerProps = {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText: string;
  minDate?: Date;
  maxDate?: Date;
};

const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
  selected,
  onChange,
  placeholderText,
  minDate,
  maxDate,
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      dateFormat="dd/MM/yyyy"
      placeholderText={placeholderText}
      customInput={<CustomDateInput />}
      popperPlacement="bottom-start"
      popperClassName="react-datepicker-popper-dark-theme" // This class is for the dark theme styles in your App.css
      className="w-full"
    />
  );
};

export default SingleDatePicker;