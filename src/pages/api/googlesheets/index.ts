import { NextApiRequest, NextApiResponse } from "next";
import { GoogleSpreadsheet } from "google-spreadsheet";

interface RowData {
  [key: string]: any;
}

export function javaScriptObjectToSheetModel(javaScriptObj: any) {
  if (javaScriptObj) {
    const header = Object.keys(javaScriptObj[0])

    const bodySheet = []
    javaScriptObj.forEach((row: any) => {
      let newRow: any[] = []
      header.forEach((h) => {
        newRow = [...newRow, row[h]]
      })
      bodySheet.push(newRow)
    })
    bodySheet.unshift(header)
    return bodySheet
  }
}
import Cors from "nextjs-cors"
import { google } from "googleapis";
import { encrypt } from "@/utils/crypto";
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
        const leadsSheet = doc.sheetsByTitle["users"]
        const tabsShifts = await Promise.all(Object.keys(doc.sheetsByTitle).filter(tab => tab.includes("/")).map(async tab => {
          const monthYear = ((tab.split("-"))[1]).split("/")
          const leadsSheet = doc.sheetsByTitle[tab]
          const rows = (await leadsSheet.getRows())
          const headers = leadsSheet.headerValues;
          const dataFromSheets = rows.map(row => {
            const obj: any = {}
            headers.forEach((header, i) => {
              obj[header] = row["_rawData"][i] === undefined? "" : row["_rawData"][i]
            })

            return obj
          })


          const tabObject = {
            name: tab,
            month: monthYear[0],
            year: monthYear[1],
            militaries: dataFromSheets
          }

          return tabObject
        }))




        const rows = (await leadsSheet.getRows())
        const headers = leadsSheet.headerValues;
        const dataFromSheets = rows.map(row => {
          const obj: any = {}
          headers.forEach((header, i) => {
            obj[header] = row["_rawData"][i]
          })

          return obj
        }).map(row => {
          const newRow = {
            ...row,
            email: encrypt(String(row.email)),
            saram: encrypt(row.saram.replace(/\D/g, '')),
            cpf: encrypt(row.cpf.replace(/\D/g, ''))
          }
          return newRow
        })


        const newTabshifts = tabsShifts.map(tab =>{
          const newMilitaries = dataFromSheets.map(mil=>{
                const shifts = tab.militaries.filter(milFromTab=>milFromTab.saram.replace(/\D/g, '') === mil.saram)
            return {
              ...mil,
                shifts:shifts
            }
          }).filter(milFromTab=>milFromTab !==undefined)

          return {
            ...tab,
            militaries:newMilitaries
          }
        })



        //console.log("Headers: ", headers);
        //console.log("row1: ",rows[0]["_rawData"])



        // Getting rows data

        // Example of accessing a specific row's data


        //const dataFromSheets = rows.map((row) => row._rawData)
        /* const dataJson = dataFromSheets.map((data) => {
          let object = {}
          headers.forEach((h: any, i: string | number) => {
            //@ts-ignore
            object[h] = data[i]

          })
          
          return object
        })
 */

        // { dataJson }

        const tabsJson = JSON.stringify(newTabshifts)
        const tabsCryp = encrypt(tabsJson)
        res.status(200).json({
          dataFromSheets,
          tabs: tabsCryp
        });
      } catch (err) {
        console.error(err)
      }
      break

    case "POST":
      const { id } = req.query
    /* 
          if (id) {
            try {
              await doc.useServiceAccountAuth({
                client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL as string,
                private_key: (process.env.NEXT_PUBLIC_PRIVATE_KEY as string).replace(/\\n/g, '\n')
              });
              await doc.loadInfo();
              const leadsSheet = doc.sheetsByTitle["Produtos"];
              const data = req.body
    
              const { category, description, image, isAddingToCart, name, productCost, productPrice, stock, uid } = data;
    
              // Busca a linha que contém o ID do produto
              const rows = await leadsSheet.getRows({ offset: 0 });
              const row = rows.find(r => {
                return r.uid === id
              });
              if (row) {
                if (uid) row.uid = uid;
                if (category) row.category = category;
                if (description) row.description = description;
                if (image) row.image = image;
                if (isAddingToCart) row.isAddingToCart = isAddingToCart;
                if (name) row.name = name;
                if (productCost) row.productCost = productCost;
                if (productPrice) row.productPrice = productPrice;
                if (stock) row.stock = stock;
                await row.save();
                res.status(200).json({ message: `Produto com ID ${id} atualizado com sucesso!` });
              } else {
                res.status(404).json({ error: `Não foi possível encontrar o produto com ID ${id}` });
              }
            } catch (err) {
              console.error(err);
              res.status(500).json({ error: "Ocorreu um erro ao atualizar o produto" });
            }
    
          } else {
            try {
              await doc.useServiceAccountAuth({
                client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL as string,
                private_key: (process.env.NEXT_PUBLIC_PRIVATE_KEY as string).replace(/\\n/g, '\n')
              }
              )
              await doc.loadInfo();
              const leadsSheet = doc.sheetsByTitle["Produtos"]
              const data = JSON.parse(req.body)
              const { category, description, image, isAddingToCart, name, productCost, productPrice, stock, uid } = data
              await leadsSheet.addRow([true, uid, category, image, name, description, isAddingToCart, stock, productPrice, productCost, (productPrice / productCost)])
              res.status(200).json({ data })
    
            } catch (err) {
              console.error(err)
            }
          }
          break */

    case "PUT":
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
