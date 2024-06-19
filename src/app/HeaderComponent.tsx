'use client'
import { useRef, useState, useEffect } from "react";
import { Logo } from "../components/icons"
import { ToggleThemeProviderButton } from "../components/theme/toggleThemeProviderButton"
import { intersection } from "zod";


interface HeaderComponentProps{
    children:React.ReactNode

}
export function HeaderComponent( {children}:HeaderComponentProps ){
    const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);
    return(
    <header ref={ref} className="fixed top-0 w-full">
    <div className={`flex h-14 lg:h-[60px] duration-200 inset-x-0 border-b z-30 ${!isIntersecting?"dark:bg-gray-800/0 border-transparent": "dark:bg-gray-800/70 border-gray-700"} top-0 items-center gap-4 px-6 dark:bg-gray-800/40 justify-between  lg:justify-end`}>
    <div className={'hidden w-full lg:block'}>
        <div className="flex gap-2 items-center justify-start">
        <Logo />
        <span className="">Shift-App</span>
        </div>
      </div>
      <div className='hidden lg:block'>
        <div className="flex gap-2 items-center justify-center">
        <ToggleThemeProviderButton />
        </div>
      </div>
      <div className={'flex gap-2 items-center justify-center lg:hidden'}>
        <Logo />
        <span className="">Shift-App</span>
      </div>
      <div>
        <div className='flex gap-2 items-center justify-center lg:hidden'>
            {children}
        </div>
      </div>
    </div>
  </header>)
}