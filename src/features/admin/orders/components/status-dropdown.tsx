'use client';

import * as React from "react";
import { useState, useEffect } from "react";  // Import useState and useEffect
import { MdKeyboardArrowDown } from 'react-icons/md';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu-custom";
import { Badge } from "@/components/ui/badge";
import { StatusOption } from "@/types/Misc";



type StatusDropdownProps = {
  options: StatusOption[];
  value: string;
  onChange: (value: string) => void;
  align?: "start" | "center" | "end";
}

export function StatusDropdown({ options, value, onChange, align = "center" }: Readonly<StatusDropdownProps>) {
  const [isClient, setIsClient] = useState(false);  // Manage client-side render state

  useEffect(() => {
    setIsClient(true);  // Set to true once the component is mounted on the client
  }, []);

  if (!isClient) return null;  // Prevent rendering on the server side

  const selectedOption = options.find(option => option.value === value);
  // if (!selectedOption) {
  //   console.warn(`No option found for value: ${value}`);
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center gap-1">
          <Badge
            variant={selectedOption?.variant ?? "default"}
            className={cn("min-w-[80px]", selectedOption?.className)}
          >
            {selectedOption?.label ?? value}
          </Badge>
          <MdKeyboardArrowDown className="size-3 opacity-50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[120px]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-center gap-2"
          >
            <Badge
              variant={option.variant ?? "default"}
              className={cn("min-w-[80px]", option.className)}
            >
              {option.label}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
