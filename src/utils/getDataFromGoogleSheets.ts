import { GoogleSpreadsheet } from "google-spreadsheet";




export async function getDataFromTab(tabName:string,doc:GoogleSpreadsheet){
  const leadsSheet = doc.sheetsByTitle[tabName]
        const rows = (await leadsSheet.getRows())
        const headers = leadsSheet.headerValues;
        const dataFromSheets = rows.map(row => {
          const obj: any = {}
          headers.forEach((header, i) => {
            obj[header] = row["_rawData"][i]
          })

          return obj
        })

        return dataFromSheets
}