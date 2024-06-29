"use client"

import { useEffect, useState } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { CheckCheck, Pen } from "lucide-react"
import { Label } from "../../ui/label"
import { updateSpreadSheetId } from "@/src/app/settings/integrations/actions"
import { extractSpreadSheetId } from "@/src/lib/utils"
import { useToast } from "../../ui/use-toast";
import React from "react"


interface SpreadSheetIdButtonProps{
  
    spreadSheetId?:string
}

export function SpreadSheetIdButton(
    {spreadSheetId}:SpreadSheetIdButtonProps
){
    const {toast} = useToast()
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [isDisabled,setIsDisabled] = useState(true)
    const [stringValue,setStringValue] = useState("")

    function handleChange(event:React.ChangeEvent<HTMLInputElement>){
        setStringValue(event.target.value)
    }
    async function handleEditSpreadSheetId( spreadSheetId: string){
        const updatedSpreadSheetId = await updateSpreadSheetId(spreadSheetId)
        
        toast({
            title: updatedSpreadSheetId.message,
            description: updatedSpreadSheetId.code === 200 ? "SpreadSheet do Órgão atualizado com sucesso!" : "Erro ao atualizar SpreadSheet do Órgão",
          
        })
    }

    function handleToggleDisabled(){
        if(!isDisabled){
            const spreadsheetID = extractSpreadSheetId(stringValue);
            if(!spreadsheetID){
                toast({
                    title: "Erro ao cadastrar SpreadSheet do Órgão",
                    description: "Verifique a URL da planilha e tente novamente.",
                  })
                  return;
            }
         handleEditSpreadSheetId(stringValue)
        }
        setIsDisabled(!isDisabled)
    }
    useEffect(()=>{
            const handleClickOutside = (event:MouseEvent) => {
        if (isDisabled === false) {
            if(inputRef && inputRef.current){
            //add focust to input if button is clicked
            inputRef.current.focus({
                preventScroll: true
            })

                if (buttonRef.current && !buttonRef.current.contains(event.target as Node) && !inputRef.current.contains(event.target as Node) ){
                    toast({
                        title: "Erro ao atualizar SpreadSheet do Órgão",
                        description: "Verifique a URL da planilha e tente novamente.",
                    });
                    setIsDisabled(true);
                }
            }

            }
            };
            
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };

    }
    ,
    [buttonRef,isDisabled])
    
    return(
        <div className="flex  flex-col justify-left  gap-4">
            <Label>
                <span>Id da planilha Google</span>
            </Label>
            <div className="flex gap-4 items-center justify-center">
            <Input ref={inputRef} defaultValue={spreadSheetId?? ""} onChange={handleChange} placeholder={spreadSheetId ?? "1Ogks1PSF8THWmV2aKbwYIlO5a5EcLeF-hk-aFf6K9iQ"} disabled={isDisabled}/> {<Button ref={buttonRef} size="icon" variant="outline" onClick={handleToggleDisabled}>{isDisabled? <Pen /> : <CheckCheck/>}</Button>}
            </div>
        </div>
    )
}