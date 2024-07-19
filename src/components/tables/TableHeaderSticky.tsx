"use client"
import { useRef, useState, useEffect } from "react";
import { TableHeader, TableRow } from "../ui/table"
import { is } from "date-fns/locale";

type TableHeaderProps = {
    children?: React.ReactNode
    className?: string
}

export function TableHeaderSticky( {children, className}:TableHeaderProps ){
    const ref = useRef<HTMLTableRowElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>{
			setIntersecting(entry.isIntersecting)}
  );
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [ref.current]);

    return(
        <TableHeader  className={`sticky top-0 transition-all ${!isIntersecting?"dark:bg-gray-800/0 border-transparent": "dark:bg-gray-800/70 border-gray-700"}`}>
      <TableRow ref={ref}>

            {children}
        </TableRow>

        </TableHeader>
    )
}