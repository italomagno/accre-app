

import {google as googleApi} from 'googleapis'
import { GoogleSpreadsheet } from 'google-spreadsheet';



let googleSheetsClient: GoogleSpreadsheet | null = null


const getGoogleSheetsClient = async (): Promise<GoogleSpreadsheet> =>{
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
        googleSheetsClient = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_SPREADSHEET_ID as string, authGoogle)
        await googleSheetsClient.loadInfo();
    }

    return googleSheetsClient
}


export default getGoogleSheetsClient