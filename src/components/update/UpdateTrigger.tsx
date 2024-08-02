 "use client"
import { Edit } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { ScrollBar } from "@/src/components/ui/scroll-area";

type UpdateTriggerProps = {
    children: React.ReactNode;
}


export function UpdateTrigger( {children}: UpdateTriggerProps) {


    return (
     
      <Popover>
        <PopoverTrigger>
          <Edit/>
        </PopoverTrigger>
        <PopoverContent className="w-dvw lg:w-fit">
          <ScrollArea className="h-96 mx-auto">
          {children}
          <ScrollBar orientation="vertical" />
          </ScrollArea>
        </PopoverContent>
      </Popover>
      
    )
}