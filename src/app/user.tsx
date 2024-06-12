
import { auth, signOut } from '@/src/app/auth';

export async function User() {
  const session = await auth();
  const user = session?.user;


  return (
    <div className="flex items-center gap-4">
      
      {
        //@ts-ignore
      `Olá, ${user.name}` 
      }
     
    </div>
  );
}
