"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
  disabled?: boolean
}

export function DatePicker({ date, onSelect, className, disabled }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)

  const handleSelect = (day: Date | undefined) => {
    setSelectedDate(day)
    if (onSelect) {
      onSelect(day)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker mode="single" selected={selectedDate} onSelect={handleSelect} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  )
}
