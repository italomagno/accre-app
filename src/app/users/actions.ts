import { getShiftsControlers, getShiftsMil } from "@/src/lib/db/sheets/googleSheetsDataSource";
import { generateUniqueKey } from "@/src/lib/utils";
import { ShiftsStatusProps } from "@/src/types";
import { completeShifts } from '@/src/types';
import { availableShifts } from '../../types';

export async function getShiftsCounter() {
    const shiftCounter: { [key: string]: number } = {};
    const dataFromControllers = (await getShiftsControlers())
  
    const shiftsKeys = dataFromControllers.map((controler) => {
      shiftCounter[controler.shiftName] = 0;
      return controler.shiftName;
    }).filter((shift)=>shift!=="");
    const { shifts: ShiftsMil } = await getShiftsMil("", 1000);
  
    const filteredShifts = ShiftsMil.map((shift: { [x: string]: any; })=>{
      delete shift["name"]
      delete shift["saram"]
      return shift
    })
    const newVector: { day: number, [key: string]: number }[] = [];
    for (var col = 1; col <= Object.keys(filteredShifts[0]).length; col++) {
      const newArrayObj: { day: number, [key: string]: number } = { day: col, ...shiftCounter };
      newVector.push(newArrayObj);
      filteredShifts.forEach((row) => {
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