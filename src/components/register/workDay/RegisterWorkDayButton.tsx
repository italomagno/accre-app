"use client"

import { generateUniqueKey } from "@/src/lib/utils"
import { Button } from "../../ui/button"
import { Shift } from "@prisma/client"

type WorkDayButton = {
    shift: Shift

}

export function RegisterWorkDayButton({shift}: WorkDayButton){
//ToDo: implement createWorkDay here and handle Response

    return(
        <Button
            key={generateUniqueKey()}
                        variant="ghost"
                        onClick={async () => {}}
                      >
                        {shift.name}
                      </Button>
    )

}