
"use client"

import { useEffect } from "react"
import { Button } from "../../ui/button"
type RemoveWorkDayButton = {
    date: Date
}
export function RemoveWorkDayButton({date}: RemoveWorkDayButton){


  useEffect(() => {
  },[])

    return (
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
          }}
        >
          <span className="w-full">Apagar proposição do dia {date.getDate()}</span>
        </Button>
    )
}