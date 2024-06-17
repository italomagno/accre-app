"use server"
import { ErrorTypes } from "@/src/types"
import { GoogleSpreadsheet} from 'google-spreadsheet';
import { auth } from "../auth";
import { cookies } from 'next/headers';




/* 
export const updateUserShifts = async (
  saram: string,
  shifts: string
): Promise<ErrorTypes> => {
    if (!saram) {
        return {
            message:"Saram não informado.",
            code:400
        }
    }
    if (!shifts) {
        return {
            message:"Turnos não informados.",
            code:400
        }
    }
    const daysOfMonth = []
    for (let i = 1; i <= 31; i++) {
        daysOfMonth.push({ day: i, shift: "" })
    }
    const shiftsSplitted = shifts.split(",").map((shift) => {
        const [day, shiftName] = shift.split(":");
        return { day: parseInt(day), shift: shiftName };
    });

    const shiftsProposal = daysOfMonth.map((day) => {
        const shift = shiftsSplitted.find((shift) => shift.day === day.day)?.shift;
        return shift || "";
    });

  try {
    const client_email = (process.env.NEXT_PUBLIC_CLIENT_EMAIL as string).replace(/\\n/g, '\n')
  const private_key = (process.env.NEXT_PUBLIC_PRIVATE_KEY as string).replace(/\\n/g, '\n')
  const auth:any | null = cookies().get("google")? JSON.parse(cookies().get("google")?.value as string):null

  
  const doc = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_SPREADSHEET_ID as string, auth)

    await doc.loadInfo();
    const sheetShiftsMonth = Object.keys(doc.sheetsByTitle).find((title) =>
      title.includes('escala')
    );
    if (!sheetShiftsMonth) {
      console.error("Sheet with 'escala' in the title not found.");
      return {
        message:"Não foi encontrado a aba de escala no arquivo de planilha.",
        code:404
      
      }; 
    }

    const leadsSheet = doc.sheetsByTitle[sheetShiftsMonth];

    // Find the row matching the 'saram'
    const rows = await leadsSheet.getRows({ offset: 0 });
    const rowDataIndex = rows.findIndex(
      (r) => r.get('saram')?.replace(/\D/g, '') === saram.replace(/\D/g, '')
    );
    const rowData = rows[rowDataIndex];

    if (!rowData) {
      return {
        message:`Não foi encontrado a linha com o saram ${saram}.`,
        code:404
      } 
    }

    // Update the row data
    const saramFromRow = rowData.get('saram');
    const nameFromRow = rowData.get('name');
    const newRawData = [nameFromRow, saramFromRow, ...shiftsProposal];

    rowData['_rawData'] = newRawData;
    await rowData.save();

    return {
      code:200,
      message:`Turnos salvos com sucesso.`
    } 
  } catch (error) {
    return {
        message:"Ocorreu um erro ao atualizar os turnos.",
        code:500
    }
  }
};


export async function handleSaveShifts(proposal:string): Promise<ErrorTypes| ErrorTypes[]> {
  const session = await auth();
    if (!session) {
      return {
        message: "Usuário não autenticado.",
        code: 401 
      };
    }
    const user = session.user as unknown as User;
    const controls = await getDataFromTab("shiftsControl", 1000) as unknown as {shiftName:string,abscences_without_restrictions:string,minQuantityOfMilitary:number,block_changes:boolean | "TRUE" | "FALSE"}[];
    
    const minShiftsPerDay = controls.map((control) => ({shift:control.shiftName,minimunQnt:control.minQuantityOfMilitary}));
    const block_changes = controls[0].block_changes;
    const [abscences_without_restrictions] = controls.reduce(
        (acc: string[], controller) => {
            controller.abscences_without_restrictions && acc.push(controller.abscences_without_restrictions);
            return acc;
        },
        []
    );
    // Check for global block
    if (block_changes === true || block_changes === "TRUE") {
        return{
            message:"Proposição de escala travada!",
            code:400
        }
    }
    // Check for individual block
    
    if (user.block_changes as unknown as string === "TRUE" || user.block_changes === true) {
        return{
            message:"Adição de turnos Travadas!",
            code:400
        }
    }
  

    //@ts-ignore
    if(user.is_expediente === "TRUE" || user.isOffice === true){
    
        const result = await updateUserShifts(user.saram, proposal);
        return result;
    }
    const proposalSplitted = proposal.split(",").map((shift) => {
        const [day, shiftName] = shift.split(":");
        return { day: parseInt(day), shift: shiftName };
    })
    const hasAbscence = proposalSplitted.some((shift) => abscences_without_restrictions.includes(shift.shift));

    if (hasAbscence) {
    
        const result = await updateUserShifts(user.saram, proposal);
        return result;
    }

    const qntOfEveryShiftsOnProposal:{[key:string]:number} = proposalSplitted.reduce((acc: {[key:string]:number}, shift) => {
        
        if(!acc[shift.shift]){
            acc[shift.shift] = 1;
        }else{
            acc[shift.shift] += 1;
        }
        return acc;
    },{});
    const hasLessShiftsThanMin = minShiftsPerDay.map((shift) => {
        const hasLess = qntOfEveryShiftsOnProposal[shift.shift] < shift.minimunQnt;
        if(hasLess){
            return {
              code: 400,
                message: `O turno ${shift.shift} não atingiu a quantidade mínima de ${shift.minimunQnt} turnos. ${shift.minimunQnt - qntOfEveryShiftsOnProposal[shift.shift] > 1 ? `Faltam ${shift.minimunQnt - qntOfEveryShiftsOnProposal[shift.shift]} turnos` : `Falta ${shift.minimunQnt - qntOfEveryShiftsOnProposal[shift.shift]} turno`}`,
            }
        }
    }).filter((shift)=>shift !== undefined);

    if(hasLessShiftsThanMin.length > 0){
        return hasLessShiftsThanMin as ErrorTypes[]; 
    }


    
    const result = await updateUserShifts(user.saram, proposal);
    return result;

}
  

export async function handleSaveProposal(proposal:string){
  "use server"
  cookies().set("proposal",proposal)
}

export async function getProposalFromCookies(){
  "use server"
  return cookies().get("proposal")?.value
}
    

   */




