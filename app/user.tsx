import { ToggleThemeProviderButton } from '@/components/theme/toggleThemeProviderButton';
import { Button } from '@/components/ui/button';
import { auth, signIn, signOut } from 'lib/auth';
import Image from 'next/image';
import { NavMenu } from './NavMenu';
import { TriggerButton } from './TriggerButton';

export async function User() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex items-center gap-4">
      <ToggleThemeProviderButton />
     {/*  <form
        action={async () => {
          'use server';
          await signIn('github');
        }}
        >
        <Button variant="outline">Sign In</Button>
      </form> */}

      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <ToggleThemeProviderButton />
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <Button variant="outline">Sign Out</Button>
      </form>
      <Image
        className="h-8 w-8 rounded-full"
        src={user.image!}
        height={32}
        width={32}
        alt={`${user.name} avatar`}
      />
     
    </div>
  );
}
