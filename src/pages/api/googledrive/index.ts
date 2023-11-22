import { google, drive_v3 } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: (process.env.NEXT_PUBLIC_CLIENT_EMAIL as string),
      private_key: (process.env.NEXT_PUBLIC_PRIVATE_KEY as string)
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({
    version: 'v3',
    auth,
  });

  // Lista todos os arquivos no Drive
  drive.files.list({}, (err: any, res: any) => {
    if (err) throw err;
    const files = res.data?.files;
    if (files && files.length) {
      files.forEach((file: drive_v3.Schema$File) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}
