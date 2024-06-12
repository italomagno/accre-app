import Link from 'next/link';
import {Logo} from '@/src/components/icons';
import { User } from './user';
import { NavMenu } from './NavMenu';
import { TriggerButton } from './TriggerButton';
import { ToggleThemeProviderButton } from '@/src/components/theme/toggleThemeProviderButton';
import React, { Suspense } from 'react';
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

            <div className="grid min-h-screen w-dvw max-w-dvw lg:grid-cols-[280px_1fr]">
              <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2">
                  <div className="flex h-[60px] items-center border-b px-5">
                    <Link
                      className="flex items-center gap-2 font-semibold"
                      href="/"
                    >
                      <Logo
                      />
                      <span className="">Shift-App</span>
                    </Link>
                  </div>
                  <NavMenu/>
                </div>
              </div>
              <div className="flex flex-col">
                <header>
                  <div className=" flex h-14 lg:h-[60px] duration-200 inset-x-0  border-b top-0 items-center gap-4   px-6 dark:bg-gray-800/40 justify-between lg:justify-end ">
                  <div className='hidden lg:block'>
                  <ToggleThemeProviderButton />
                  </div>
    
                <div className='flex gap-2 items-center justify-center lg:hidden'>                    
                        <Logo />
                        <span className="">Shift-App</span></div>
                <div> 
                  <div className='flex gap-2 items-center justify-center lg:hidden'>
                  <User />
                  <ToggleThemeProviderButton />
    
                <TriggerButton 
                  children={
                    <NavMenu/>
                  }
                  />
                    </div> 
                </div>
                  </div>
                </header>
                {children}
              </div>
            </div>
            
          }
            </>
            )



}