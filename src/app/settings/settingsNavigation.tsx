'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/src/components/ui/accordion';
import { Separator } from '@/src/components/ui/separator';
import { generateUniqueKey } from '@/src/lib/utils';
import { ErrorTypes } from '@/src/types';
import { $Enums } from '@prisma/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SettingsNavigationProps {
  role: $Enums.Role | ErrorTypes;
}
export function SettingsNavigation({ role }: SettingsNavigationProps) {
  const pathName = usePathname();
  const settingsNavigationLinks = [
    {
      href: '/settings',
      label: 'Geral',
      availableFor: 'USER'
    },
    {
      href: '/settings/myAccount',
      label: 'Minha conta',
      availableFor: 'USER'
    },
    {
      href: '/settings/contact',
      label: 'Contato',
      availableFor: 'USER'
    },
   
    {
      href: '/settings/users',
      label: 'Usuários',
      availableFor: 'ADMIN',
      subLinks: [
        {
          href: '/settings/users',
          label: 'Geral',
          availableFor: 'ADMIN'
        },
        {
          href: '/settings/users/createUser',
          label: 'Criar Usuário',
          availableFor: 'ADMIN'
        }
      ]
    },
    {
      href: '/settings/shifts',
      label: 'Turnos',
      availableFor: 'ADMIN',
      subLinks: [
        {
          href: '/settings/shifts',
          label: 'Geral',
          availableFor: 'ADMIN'
        },
        {
          href: '/settings/shifts/createShift',
          label: 'Criar Turno',
          availableFor: 'ADMIN'
        }
      ]
    },
    {
      href: '/settings/roster',
      label: 'Escala Operacional',
      availebleFor: 'ADMIN',
      subLinks: [
        {
          href: '/settings/roster',
          label: 'Geral',
          availebleFor: 'ADMIN'
        },
        {
          href: '/settings/roster/createRoster',
          label: 'Criar Escala Operacional',
          availebleFor: 'ADMIN'
        }
      ]
    },
  
  ];
  return (
    <nav
      className="grid gap-4 text-sm text-muted-foreground"
      x-chunk="dashboard-04-chunk-0"
    >
      {role === 'ADMIN' ? (
        <>
          {settingsNavigationLinks
            .filter((link) => link.availableFor === 'USER')
            .map((link) => (
              <Link
                href={link.href}
                key={generateUniqueKey()}
                className={`${pathName === link.href ? 'font-semibold text-primary' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          <Separator />
          {settingsNavigationLinks
            .filter((link) => link.availableFor !== 'USER')
            .map((link) =>
              link.subLinks ? (
                <Accordion key={generateUniqueKey()} type="single" collapsible>
                  <AccordionItem className=" border-none" value={link.href}>
                    <AccordionTrigger
                      className={`${pathName === link.href ? 'font-semibold text-primary' : ''} cursor-pointer`}
                    >
                      {link.label}
                    </AccordionTrigger>
                    {link.subLinks.map((subLink) => (
                      <AccordionContent key={generateUniqueKey()}>
                        <Link
                          href={subLink.href}
                          className={`${pathName === subLink.href ? 'font-semibold text-primary' : ''}`}
                        >
                          {subLink.label}
                        </Link>
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  href={link.href}
                  key={generateUniqueKey()}
                  className={`${pathName === link.href ? 'font-semibold text-primary' : ''}`}
                >
                  {link.label}
                </Link>
              )
            )}
        </>
      ) : (
        settingsNavigationLinks
          .filter((link) => link.availableFor === 'USER')
          .map((link) => (
            <Link
              href={link.href}
              key={generateUniqueKey()}
              className={`${pathName === link.href ? 'font-semibold text-primary' : ''}`}
            >
              {link.label}
            </Link>
          ))
      )}
    </nav>
  );
}
