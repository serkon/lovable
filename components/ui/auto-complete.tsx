"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AutoCompleteProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AutoComplete({
  options,
  value,
  onChange,
  placeholder,
  className,
}: AutoCompleteProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filteredOptions, setFilteredOptions] = React.useState<string[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (value) {
      const filtered = options.filter(
        (opt) => opt.toLowerCase().includes(value.toLowerCase()) && opt !== value
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  }, [value, options]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full"
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="bg-popover text-popover-foreground scrollbar-hide absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-md">
          {filteredOptions.map((option) => (
            <button
              key={option}
              className="hover:bg-accent hover:text-accent-foreground w-full px-3 py-2 text-left text-sm transition-colors"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
