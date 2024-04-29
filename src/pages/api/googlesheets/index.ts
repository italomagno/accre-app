import { NextApiRequest, NextApiResponse } from "next";
import { GoogleSpreadsheet } from "google-spreadsheet";
import {Military, MilitaryFromSheet, Shifts, ShiftsMil} from'@/types'

interface RowData {
  [key: string]: any;
}


import Cors from "nextjs-cors"
import { google } from "googleapis";
import {  encrypt } from "@/utils/crypto";
import { getDataFromTab } from "@/utils/getDataFromGoogleSheets";
import { getSession } from "next-auth/react";
const client_email = (process.env.NEXT_PUBLIC_CLIENT_EMAIL as string).replace(/\\n/g, '\n')
const private_key = (process.env.NEXT_PUBLIC_PRIVATE_KEY as string).replace(/\\n/g, '\n')
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: client_email,
    private_key: private_key,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_SPREADSHEET_ID as string, auth)


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', "*");
  await Cors(req, res, {
    allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowOrigin: ['https://pleasure-v1-5f3ruyf7z-italomagno.vercel.app', 'www.upleasure.com.br', 'pleasure-v1.vercel.app', 'pleasure-v1-git-tester-italomagno.vercel.app', "pleasure-v1-7kfv3hasl-italomagno.vercel.app"],
    allowCredentials: true, // Allow CORS with cookies
  });
  const { method } = req

  const session = await getSession({ req });




  switch (method) {
    case "GET":
      
      try {
        await doc.loadInfo();
        const tabsShifts = await Promise.all(Object.keys(doc.sheetsByTitle).filter(tab => tab.includes("/")).map(async tab => {
          const monthYear = ((tab.split("-"))[1]).split("/")
          const dataFromSheets = (await getDataFromTab(tab,doc)).map(row=>{
            const keys = Object.keys(row)

            keys.map((key,i)=>{
              row[key] === undefined? row[key] = "" : row[key]
            })

            return row
          })

          const tabObject = {
            name: tab,
            month: monthYear[0],
            year: monthYear[1],
            militaries: dataFromSheets
          }

          return tabObject
        }))
        
        const dataFromSheets:MilitaryFromSheet[] = (await getDataFromTab("users",doc)).map(row => {
          const newRow = {
            ...row,
            email: (String(row.email)),
            saram: (row.saram.replace(/\D/g, '')),
            cpf: (row.cpf.replace(/\D/g, '')),
            block_changes: row.block_changes === "TRUE" ? true : false,
            is_expediente: row.is_expediente === 'FALSE' ? false : true
          }

          if(newRow.cpf === "") return
          return newRow
        }).filter(row=> row !== undefined)

        const dataFromShiftsController = (await getDataFromTab("shiftsControl",doc))

        const newTabshifts = tabsShifts.map((tab,i) =>{
          const newMilitaries: Military[] = dataFromSheets.map((mil)=>{
            const saram = (mil.saram)
            const undefindMil:Military = {
              milId:0,
              milName:"",
              shiftsMil:[],

            }

            if(!saram || saram === ""){
              return undefindMil
            }
           const shifts = tab.militaries.find((milFromTab,j)=>{
            const findedMil = milFromTab["saram"].replace(/\D/g,"") === saram
           // if(findedMil===true) {console.log("findedMil",findedMil,"milFromTab: ",milFromTab)} 
            return findedMil
          })
          if(!shifts) return undefindMil

          const shiftsKeys = Object.keys(shifts).filter(key=>isNaN(parseFloat(key)) !== true)
          
          const newShifts: ShiftsMil[] = shiftsKeys.map(key=>{
            return{
              day: key,
              shift: shifts[key]
            }
          })

          const newReturn:Military = {
            milId: Number(mil.saram.replace(/\D/g,"")),
            milName: mil.name,
            shiftsMil: newShifts,

          }
               // const shifts = (.filter(milFromTab=>milFromTab.saram === saram))[0]

            return newReturn
          })

          return {
            ...tab,
            militaries:newMilitaries,
            controlers:dataFromShiftsController
          }
        })


        const dataToReturn = {
          dataFromSheets,
          tabs: newTabshifts
        }

        const jsonToReturn = JSON.stringify(dataToReturn)

        const dataCrypted = encrypt(jsonToReturn)

        res.status(200).json(dataCrypted);
      } catch (err) {
        console.error(err)
      }
      break

    case "POST":
      const { id } = req.query
      res.status(400)

    case "PUT":

      const  {saram} = req.query
      const dataFromForms = req.body;
      const data:ShiftsMil[] = JSON.parse(dataFromForms)


      //pegar o nome da planilha do body
      await doc.loadInfo();
      const sheetShiftsMonth = Object.keys(doc.sheetsByTitle).find(title=>title.includes("escala"));
      if(!sheetShiftsMonth){
        return res.status(404)
      }
      const leadsSheet = doc.sheetsByTitle[sheetShiftsMonth];
      
      const rows = await leadsSheet.getRows({ offset: 0 });
      const rowDataIndex = rows.findIndex((r) => r.get("saram") ? r.get("saram").replace(/\D/g,"") === saram : false);
      const rowData = rows[rowDataIndex];


      if(!rowData){
         return res.status(404)
      }else{
      const saramFromRow = rowData.get("saram")
      const nameFromRow = rowData.get("name")
      const newData = data.map(r=>r.shift)
      const newRawData =[nameFromRow,saramFromRow,
        ...newData]
        rowData["_rawData"] = newRawData
     await rowData.save()

    return res.status(200).json("deu certo")
     
    }

    return res.status(401)


  }




}
