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
                <div className="grid grid-cols-1 min-h-screen lg:grid-cols-[_1fr]">
                  <HeaderComponent>
                    <User />
                    <ToggleThemeProviderButton />
                    <TriggerButton children={<NavMenu />} />
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