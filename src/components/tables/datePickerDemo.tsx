import { cn } from "@/src/lib/utils"
import { format } from "date-fns"
import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Button } from "../ui/button"
import { CalendarIcon } from "lucide-react"
import { SelectSingleEventHandler } from "react-day-picker"

type DatePickerDemoProps = {
    date: Date | undefined
    setDate: SelectSingleEventHandler
}

export function DatePickerDemo( {date, setDate}: DatePickerDemoProps) {
   
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Selecione uma data Pra ver a Escala Geral</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
          lang="pt"
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  }