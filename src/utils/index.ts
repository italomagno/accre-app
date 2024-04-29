import { BreadCumbItem, Military, Shifts } from "@/types";


export function getDaysInMonthWithWeekends(month: number, year: number) {
  let date = new Date(year, month, 0);
  let days = date.getDate();

  let daysArray = [];
  for (let i = 1; i <= days; i++) {
    let dayDate = new Date(year, month - 1, i); // Ajustando o mês para base zero
    let dayOfWeek = dayDate.getDay();

    // Checar se é fim de semana (0 = Domingo, 6 = Sábado)
    let isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    daysArray.push({ day: i, isWeekend: isWeekend });
  }

  return daysArray;
}

export const chunkArray = (array: Shifts[], size:number) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

export function generateRandomShifts(necessaryShiftsPerDay: Shifts[],month:number,year:number) {
  const randomShifts = getDaysInMonthWithWeekends(month, year).map(day => {
    const shiftHeaders = necessaryShiftsPerDay.map(shift => shift.shiftName)
    shiftHeaders.pop()
    shiftHeaders.pop()
    const shift = "-"
    return {
      day: String(day.day),
      shift
    }
  })

  return randomShifts
}

export function handleQntPerShift(militaries:Military[],necessaryShiftsPerDay:Shifts[],month:number,year:number){
  const qntPerShift: Record<string,Record<string,number>> = {}
getDaysInMonthWithWeekends(month,year).forEach(day=>qntPerShift[day.day]= {})

const days = Object.keys(qntPerShift)

days.forEach(day=>{
  necessaryShiftsPerDay.map(shift=>{
    qntPerShift[day][shift.shiftName] = 0
    return{
      shiftId:shift.shiftId,
      shiftName:shift.shiftName,
      quantityOfMilitary:0
    }
  })
})

militaries.map(mil=>
  mil.shiftsMil.forEach((shift,i)=>{
    
    const shiftToUse = shift.shift
   
    
    if(shiftToUse){
    const hasBar = shiftToUse.includes("/")

    if(hasBar){
      shiftToUse.split("/").forEach(shiftSplitted=>{
        qntPerShift[i+1][shiftSplitted]++
      })
    }else{
    qntPerShift[i+1][shiftToUse]++
    } 

    }
  }))

  const shiftsVector = days.map(day=>{

 
    return necessaryShiftsPerDay.map(shift=>{

      const newShift: Shifts = {
        shiftId: shift.shiftId,
        shiftName: shift.shiftName,
        quantityOfMilitary: qntPerShift[day][shift.shiftName],
      }

      return newShift

    })
   
  })
  return shiftsVector
}

export const breadCumbItens:BreadCumbItem[] = [
  {
    href:"/",
    isCurrentPage:true,
    title:"Escala Mensal"

  },
  {
    href:"/lancamento",
    isCurrentPage:false,
    title:"Lançar Escala"
  },
  {
    href:`${process.env.NEXTAUTH_URL}/api/auth/signout`,
    isCurrentPage:false,
    title:"Sair"
  },

]

export function handleProposeShifts(isExpediente:boolean,minShiftsPerDay:Shifts[],mil:Military){
  if(isExpediente===false){
    const shiftObj = {}
    const minShiftObj = {}

    const shiftsVector = minShiftsPerDay.map(shift=>{
      //@ts-ignore
      shiftObj[shift.shiftId] = 0
      //@ts-ignore
      minShiftObj[shift.shiftId] = shift.minQuantityOfMilitary
      return shift.shiftId
    }
    )

  for(var i = 0 ; i < mil.shiftsMil.length ;  i++){
    const hasBar = mil.shiftsMil[i].shift?.includes("/")
    if(hasBar){
      const shiftSplitted = mil.shiftsMil[i].shift?.split("/")

      //@ts-ignore
        shiftSplitted?.forEach(shift=> shiftObj[shift] ? shiftObj[shift] = shiftObj[shift] +1 : "")

    }else{
      //@ts-ignore
      shiftObj[mil.shiftsMil[i].shift] ? shiftObj[mil.shiftsMil[i].shift] = shiftObj[mil.shiftsMil[i].shift] +1 : ""
    }
  }

      //@ts-ignore
  const isLessThanNecessary = shiftsVector.map(shift=>shiftObj[shift] < minShiftObj[shift]).find(row=>row===true)
  if(isLessThanNecessary === true){ 
    return false
  }else{
    return true
  }
}
}
