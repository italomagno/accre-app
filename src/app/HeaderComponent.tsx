'use client'
import { useRef, useState, useEffect } from "react";
import { Logo } from "../components/ui/icons"

import Link from "next/link";


interface HeaderComponentProps{
    children:React.ReactNode

}
export function HeaderComponent( {children}:HeaderComponentProps ){
    const ref = useRef<HTMLDivElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
  );
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [ref.current]);
    return(
    <header  className="fixed top-0 w-full z-50">
    <div ref={ref} className={`flex h-14 lg:h-[60px] duration-200 inset-x-0 border-b z-[100] backdrop-blur ${!isIntersecting?"dark:bg-gray-800/0 border-transparent": "dark:bg-gray-800/70 border-gray-700"} top-0 items-center gap-4 px-6 dark:bg-gray-800/40 justify-between `}>
    <div className={' w-fit'}>
      <Link href="/">
        <div className="flex gap-2 items-center justify-start">
        <Logo />
        <span className="">Shift-App</span>
        </div>
        </Link>

      </div>
      <div>
        <div className='flex gap-2 items-center justify-center'>
            {children}
        </div>
      </div>
    </div>
  </header>)
}