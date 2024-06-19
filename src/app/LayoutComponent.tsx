import Link from 'next/link';
import {Logo} from '@/src/components/icons';
import { User } from './user';
import { NavMenu } from './NavMenu';

import React from 'react';
import { HeaderComponent } from './HeaderComponent';
import { ToggleThemeProviderButton } from '../components/theme/toggleThemeProviderButton';
import { TriggerButton } from './TriggerButton';
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
                <div className="grid grid-cols-1 min-h-screen lg:grid-cols-[280px_1fr]">
                  <HeaderComponent>
                    <User />
                    <ToggleThemeProviderButton />
                    <TriggerButton children={<NavMenu />} />
                  </HeaderComponent>
                  
                <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
                  <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-5">
                      <Link className="flex items-center gap-2 font-semibold" href="/">
                        <Logo />
                        <span className="">Shift-App</span>
                      </Link>
                    </div>
                    <NavMenu />
                  </div>
                </div>
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