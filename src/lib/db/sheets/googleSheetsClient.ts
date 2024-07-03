/* "use server"
import { auth } from '@/src/app/auth';


import {google as googleApi} from 'googleapis'
import { GoogleSpreadsheet } from 'google-spreadsheet';
import prismaClientSingleton from '../prisma/prismaClient';



let googleSheetsClient: GoogleSpreadsheet | null = null


const getGoogleSheetsClient = async (): Promise<GoogleSpreadsheet> =>{
    const session = await auth()
    const prisma = prismaClientSingleton
    const user = await prisma.user.findUnique({
        where:{
            email:session?.user.email as string
        }
    })
    const department = await prisma.department.findUnique({
        where:{
            id:user?.departmentId as string
        }
    })
    

    if(!googleSheetsClient){
        const client_email = (process.env.NEXT_PUBLIC_CLIENT_EMAIL as string).replace(/\\n/g, '\n')
        const private_key = (process.env.NEXT_PUBLIC_PRIVATE_KEY as string).replace(/\\n/g, '\n')
        const authGoogle = new googleApi.auth.GoogleAuth({
            credentials: {
                client_email: client_email,
                private_key: private_key,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        googleSheetsClient = new GoogleSpreadsheet(department?.spreadSheetId as string, authGoogle)
        await googleSheetsClient.loadInfo();
    }

    return googleSheetsClient
}


export default getGoogleSheetsClient */