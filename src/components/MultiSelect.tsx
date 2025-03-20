"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SelectOptions } from "@/interfaces/multiselect";
import { X } from "lucide-react";
import { useRef, useState } from "react";

type MultiSelectProps = {
  options: SelectOptions[];
  selected: SelectOptions[];
  onChange: (selected: SelectOptions[]) => void;
  placeholder?: string;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Seleccione opciones...",
}: MultiSelectProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // 🔥 Fix: Compare using `option.id` directly
  const handleUnselect = (option: SelectOptions) => {
    onChange(
      selected.filter(
        (s) => JSON.stringify(s.id) !== JSON.stringify(option.id)
      )
    );
  };

  // 🔥 Fix: Proper filtering for selectable options
  const selectables = options.filter(
    (option) =>
      !selected.some(
        (s) => JSON.stringify(s.id) === JSON.stringify(option.id)
      )
  );

  if (!options) return null;

  return (
    <Command className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((option: SelectOptions) => (
            <Badge
              key={option.id ? option.id.toString() : option.name}
              variant="secondary"
            >
              {option.name}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(option);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(option)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option: SelectOptions) => (
                  <CommandItem
                    key={option.id ? option.id.toString() : option.name}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      onChange([...selected, option]); // ✅ Fix: Ensure correct selection update
                    }}
                    className="cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onChange([...selected, option]);
                        setInputValue("");
                      }
                    }}
                  >
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
