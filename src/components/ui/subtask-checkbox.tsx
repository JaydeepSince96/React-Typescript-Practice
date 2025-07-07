import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubtaskCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  subtaskId?: string; // For debugging
}

export const SubtaskCheckbox: React.FC<SubtaskCheckboxProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  subtaskId
}) => {
  const handleClick = () => {
    console.log(`🎯 SubtaskCheckbox ${subtaskId}: Click detected, current state: ${checked}`);
    if (!disabled) {
      console.log(`🎯 SubtaskCheckbox ${subtaskId}: Calling onCheckedChange with: ${!checked}`);
      onCheckedChange(!checked);
    }
  };

  console.log(`🎨 SubtaskCheckbox ${subtaskId}: Rendering with checked=${checked}, disabled=${disabled}`);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "relative h-5 w-5 rounded border-2 transition-all duration-200 flex items-center justify-center",
        "hover:scale-105 active:scale-95",
        checked 
          ? "bg-sky-500 border-sky-500 text-white" 
          : "bg-transparent border-neutral-400 hover:border-sky-400",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
      aria-checked={checked}
      role="checkbox"
    >
      {checked && (
        <Check className="h-3 w-3" strokeWidth={3} />
      )}
    </button>
  );
};
