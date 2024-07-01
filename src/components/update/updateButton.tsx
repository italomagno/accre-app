 "use client"
import { Edit } from "lucide-react"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { AlertDialogHeader, AlertDialogFooter, AlertDialogOverlay } from "@/src/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { ScrollAreaScrollbar } from "@radix-ui/react-scroll-area";

type UpdateButtonProps = {
    children: React.ReactNode;
}


export function UpdateButton( {children}: UpdateButtonProps) {


    return (
     
      <Popover>
        <PopoverTrigger>
          <Edit/>
        </PopoverTrigger>
        <PopoverContent>
          <ScrollArea className="h-44" >
          {children}
          <ScrollAreaScrollbar orientation="vertical" />
          </ScrollArea>
        </PopoverContent>
      </Popover>
      
    )
}