import { completeShifts } from 'types';
import { availableShifts } from './../types';
import 'server-only';
import { google } from "googleapis";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { ShiftsStatusProps } from 'types';
import { generateUniqueKey } from './utils';



export async function getDataFromTab(tabName: string, limit: number = 10) {
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
  await doc.loadInfo();

  const leadsSheets = doc.sheetsByTitle
  const leadsSheetKey= Object.keys(leadsSheets).find(key=>key.toLowerCase().includes(tabName.toLowerCase()))
  if (!leadsSheetKey) {
    return []
  }
  
  const leadsSheet = leadsSheets[leadsSheetKey]

  const rows = (await leadsSheet.getRows({ limit: limit })) // Add limit parameter to getRows() method
  const headers = leadsSheet.headerValues;
  //@ts-ignore
  const dataFromSheets = rows.map(row => {
    const obj: any = {}
    //@ts-ignore
    headers.forEach((header, i) => {
      obj[header] = row["_rawData"][i]
    })

    return obj
  })

  return dataFromSheets
}

export async function getUsers(search: string, offset: number) {
  const users = await getDataFromTab("users", offset);
  if (search) {
    const filteredUsers = users.filter((user: any) => {
      return Object.keys(user).some((key) =>
        user[key].toLowerCase().includes(search.toLowerCase())
      );
    });
    const newOffset = null;
    return { users: filteredUsers, newOffset };
  }
  const newOffset = users.length >= offset + 20 ? offset + 20 : null;
  return { users, newOffset };
}
export async function getShiftsControlers() {
  const shiftsControllers = await getDataFromTab("shiftsControl", 1000);
  return shiftsControllers;
}



  
//verificar o counter para aamnhã
export async function getShiftsCounter() {
  const shiftCounter: { [key: string]: number } = {};
  const dataFromControllers = (await getShiftsControlers())
  const shiftsKeys = dataFromControllers.map((controler) => {
    shiftCounter[controler.shiftName] = 0;
    return controler.shiftName;
  }).filter((shift)=>shift!=="");
  const { shifts: ShiftsMil } = await getShiftsMil("", 1000);

  const filteredShifts = ShiftsMil.map(shift=>{
    delete shift["name"]
    delete shift["saram"]
    return shift
  })
  const newVector: { day: number, [key: string]: number }[] = [];
  for (var col = 1; col <= Object.keys(filteredShifts[0]).length; col++) {
    const newArrayObj: { day: number, [key: string]: number } = { day: col, ...shiftCounter };
    newVector.push(newArrayObj);
    filteredShifts.forEach(row => {
      const shift = row[col];
      if (!shift) return;
      const hasBar = shift.includes("/");
      if (hasBar) {
        const shifts = shift.split("/");
        shifts.forEach((s: any) => {
          const hasKeyOfThisShift = shiftsKeys.includes(s);
          if (hasKeyOfThisShift)
            newVector[col - 1][s] += 1;
        });
      } else {
        const hasKeyOfThisShift = shiftsKeys.includes(shift);
        if (hasKeyOfThisShift)
          newVector[col - 1][shift] += 1;
      }
    });
  }

    const vectorToReturn = shiftsKeys.map((shift,i) => {
      //@ts-ignore
      const days: {day:number,color:string}[] = newVector.map((day, i) => {
        const newDay: { day: number, [key: string]: number } = day;
        return newDay[shift]
      });
      return { turno: shift,quantidade:dataFromControllers[i].quantityOfMilitary, ...days };
    });
    const requiredShifts:{[x:string]:string} = {}
    const shiftStatus:ShiftsStatusProps = {
      availableShifts:[],
      completeShifts:[]
    }

    dataFromControllers.forEach(controls=>(requiredShifts[controls.shiftName]=controls.quantityOfMilitary))
    const vectorToReturnWithColors = vectorToReturn.map((shift:any)=>{
      const keys = Object.keys(shift).filter(key=>key!=="turno")
      const necessary = requiredShifts[shift.turno]
      const days = keys.map((key,i)=>{
        let availableShifts:availableShifts | null = null
        let completeShifts:completeShifts | null = null
        var color 
        if(shift[key] > necessary){ 
        
          color = "moreThanNecessary"
          completeShifts = {
            day:i+1,
            id:generateUniqueKey(),
            quantity: shift[key],
            shiftName: shift["turno"]
          }
        }
        if(shift[key] < necessary){ 
          color = "lessThanNecessary"
          availableShifts = {
            day:i+1,
            id:generateUniqueKey(),
            missingQuantity: parseFloat(necessary) - shift[key],
            shiftName: shift["turno"]
          }
        }
        if(shift[key] == necessary){
          color = "hasNecessary"
          completeShifts = {
            day:i+1,
            id:generateUniqueKey(),
            quantity: shift[key],
            shiftName: shift["turno"]
          }
        }

        if(availableShifts)
        shiftStatus.availableShifts.push(availableShifts)
        if(completeShifts)
        shiftStatus.completeShifts.push(completeShifts)

        return {value:shift[key],color}
      })
      return {turno:shift.turno,quantidade:necessary,...days}
    })

return {vectorToReturn,vectorToReturnWithColors,shiftStatus}

}


export async function getShiftsMil(search: string, offset: number) {
  const shiftsOld = await getDataFromTab("escala", offset);
  const shifts = shiftsOld.map((shift: any) => {if(!shift){return "-"}else{return shift}});
  if (search) {
    const filteredShifts = shifts.filter((shift: any) => {
      return Object.keys(shift).some((key) =>
        shift[key] && shift[key].toLowerCase().includes(search.toLowerCase())
      );
    });
    const newOffset = null;
    return { shifts: filteredShifts, newOffset };
  }
  const newOffset = shifts.length >= offset + 20 ? offset + 20 : null;
  return { shifts, newOffset };
}







