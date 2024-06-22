"use client"
import Link from "next/link"
import { usePathname } from "next/navigation";


export function SettingsNavigation() {
    const pathName = usePathname();
    const settingsNavigationLinks = [
        {
            href: "/settings/createRoster",
            label: "Criar Escala Operacional",
        },
        {
            href: "/settings/integrations",
            label: "Integrations",
        },
        {
            href: "/settings/support",
            label: "Support",
        },
        {
            href: "/settings/organizations",
            label: "Organizations",
        },
        {
            href: "/settings/advanced",
            label: "Advanced",
        },
    ]
    return (
        <nav
        className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
        >
            {
                settingsNavigationLinks.map((link) => (
                    <Link href={link.href} key={link.href} className={`${pathName === link.href ? "font-semibold text-primary" : ""}`}>
                        {link.label}
                    </Link>
                ))
            }
      </nav>
    );
}