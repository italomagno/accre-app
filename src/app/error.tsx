'use client';

import { useEffect } from 'react';
import { LayoutComponent } from './LayoutComponent';
import Link from 'next/link';
import { Button } from '../components/ui/button';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <LayoutComponent>
    <main className="flex items-center justify-center w-dvw h-dvh text-3xl font-bold">
      <div>
          Desculpe o Transtorno, ocorreu um erro inesperado.
      </div>
      <Button  variant={"link"}>
        <Link  href={"/settings/contato"}>Reporte Aqui por gentileza.</Link>
      </Button>
    </main>
    </LayoutComponent>
  );
}
