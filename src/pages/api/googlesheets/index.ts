import { NextApiRequest, NextApiResponse } from "next";
import { GoogleSpreadsheet } from "google-spreadsheet";

type Product = {
  
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

const doc = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_SPREADSHEET_ID as string)
const client_email = (process.env.NEXT_PUBLIC_CLIENT_EMAIL as string).replace(/\\n/g, '\n')
const private_key = (process.env.NEXT_PUBLIC_PRIVATE_KEY as string).replace(/\\n/g, '\n')
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', "*");
  
  const { method } = req

  switch (method) {
    case "GET":
      try {
        await doc.useServiceAccountAuth({
          client_email,
          private_key
        })
        await doc.loadInfo();
        const leadsSheet = doc.sheetsByTitle["Produtos"]
        const rows = (await leadsSheet.getRows())
        const headers: (keyof Product)[] = rows[0]._sheet.headerValues as (keyof Product)[];
        const dataFromSheets = rows.map((row) => row._rawData)
        const dataJson = dataFromSheets.map((data) => {
          let object = {}
          headers.forEach((h: any, i: string | number) => {
            //@ts-ignore
            object[h] = data[i]

          })
          
          return object
        })



        res.status(200).json({ dataJson });
      } catch (err) {
        console.error(err)
      }
      break

    case "POST":
      const { id } = req.query

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
      break

    case "PUT":
      const products = req.body;

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
      }

      break;


  }




}
