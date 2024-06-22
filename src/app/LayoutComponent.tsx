
import { NavMenu } from './NavMenu';
import React from 'react';
import { HeaderComponent } from './HeaderComponent';
import { ToggleThemeProviderButton } from '../components/theme/toggleThemeProviderButton';
import { TriggerButton } from './TriggerButton';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/src/components/ui/dropdown-menu';
import { CircleUser } from 'lucide-react';
import { Button } from '../components/ui/button';
import { handleLogOut } from './login/_actions';
import { LogOutButton } from '../components/ui/LogOutButton';
type LayoutComponentProps={
    children:React.ReactNode
    isLogin?:boolean
}
export function LayoutComponent({children,isLogin = false}:LayoutComponentProps){
  
    return(
           <>
            {
            isLogin?
              children
                :
                <div className="grid grid-cols-1 min-h-screen lg:grid-cols-1fr">
                  <HeaderComponent>
                    <ToggleThemeProviderButton />
                    <TriggerButton children={<NavMenu />} />
                    <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" >
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Contato</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
                  </HeaderComponent>
                  <div className="flex flex-col">
                  <div className='overflow-x-auto mt-14'>
                      {children}
                  </div>
                </div>

              </div>
             
          }
            </>
            )



}