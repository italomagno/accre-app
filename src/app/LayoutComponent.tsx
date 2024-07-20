
"use client"
import { NavMenu } from './NavMenu';
import React from 'react';
import { HeaderComponent } from './HeaderComponent';
import { ToggleThemeProviderButton } from '../components/theme/toggleThemeProviderButton';
import { TriggerButton } from './TriggerButton';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/src/components/ui/dropdown-menu';
import { CircleUser } from 'lucide-react';
import { Button } from '../components/ui/button';
import { LogOutButton } from '../components/ui/LogOutButton';
import Link from 'next/link';
import { NotificationsComponent } from './NotificationsComponent';
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
                    {/* <GoogleTranslate prefLangCookie={'pt'}  /> */}
                    <NotificationsComponent />
                    <ToggleThemeProviderButton />
                   
                    <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" >
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel><Link href="/settings/myAccount">Minha Conta</Link></DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Link href="/settings">Configurações</Link></DropdownMenuItem>
              <DropdownMenuItem><Link href="/settings/contact">Contato</Link></DropdownMenuItem>
              <DropdownMenuSeparator/>
              <DropdownMenuItem>
                <LogOutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TriggerButton >
                      <NavMenu />
                    </TriggerButton>
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