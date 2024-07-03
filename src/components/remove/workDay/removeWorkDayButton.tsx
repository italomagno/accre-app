
"use client"

import { Button } from "../../ui/button"
type RemoveWorkDayButton = {
    date: Date
}
export function RemoveWorkDayButton({date}: RemoveWorkDayButton){
    //ToDo: implement removeWorkDay here and handle Response

    return (
        <Button
          variant="destructive"
          className="w-full"
          onClick={async () => {
            
          }}
        >
          <span className="w-full">Apagar proposição do dia {date.getDate()}</span>
        </Button>
    )
}