import { NextApiRequest, NextApiResponse } from "next";
import { GoogleSpreadsheet } from "google-spreadsheet";
import {Military, MilitaryFromSheet, ShiftsMil} from'@/types'

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
            saram: (row.saram.replace("-", '')),
            cpf: (row.cpf.replace(/\D/g, ''))
          }
          return newRow
        })


        const dataFromShiftsController = (await getDataFromTab("shiftsControl",doc))

        const newTabshifts = tabsShifts.map((tab,i) =>{
          const newMilitaries: Military[] = dataFromSheets.map((mil)=>{
            const saram = (mil.saram)
            const undefindMil:Military = {
              milId:0,
              milName:"",
              shiftsMil:[]
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

          const shiftsKeys = Object.keys(shifts).filter(key=>key!=="saram")
          
          const newShifts: ShiftsMil[] = shiftsKeys.map(key=>{
            return{
              day: key,
              shift: shifts[key]
            }
          })

          const newReturn:Military = {
            milId: Number(mil.saram.replace(/\D/g,"")),
            milName: mil.name,
            shiftsMil: newShifts

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
      const session = await getSession({ req });
      if(!session) res.status(401).send("Usuário não autenticado / User is not logged in");
      
      const  {saram}  = req.query
      /*   const products = req.body;
  
        if (!Array.isArray(products)) {
          res.status(400).json({ error: "O corpo da requisição precisa ser um array de produtos" });
          break;
        }
  
        try {
          await doc.useServiceAccountAuth({
            client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL as string,
            private_key: (process.env.NEXT_PUBLIC_PRIVATE_KEY as string).replace(/\\n/g, '\n')
          });
  
          await doc.loadInfo();
  
          const leadsSheet = doc.sheetsByTitle["Produtos"];
          const rows = await leadsSheet.getRows({ offset: 0 });
  
          for (let product of products) {
  
            const row = rows.find(r => r.name === product.name);
            const hasUpdatedBefore = row?.uid === product.uid
  
       
            if (row && product.uid && !hasUpdatedBefore) {
              row.uid = product.uid;
              await row.save();
            }
            
          }
  
          res.status(200).json({ message: "Produtos atualizados com sucesso!" });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Ocorreu um erro ao atualizar os produtos" });
        } */

      break;


  }




}
