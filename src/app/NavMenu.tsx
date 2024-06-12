import { DashboardLogo } from "@/src/components/icons";
import { UsersIcon, SettingsIcon ,Power} from "lucide-react";
import { NavItem } from "./nav-item";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { signOut } from "./auth";
import { cookies } from "next/headers";
import { Button } from "../components/ui/button";


export function NavMenu() {

    return (
        <div className="relative flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                  <NavItem href="/">
                    <DashboardLogo className="h-4 w-4" />
                    Escala Geral
                  </NavItem>
                  <NavItem href={`/lancamento`}>
                    <HiOutlineRocketLaunch  className="h-4 w-4" />
                    Lançamento
                  </NavItem>
                  <NavItem href="/users">
                    <UsersIcon className="h-4 w-4" />
                    Usuários
                  </NavItem>
                  <NavItem href="/settings">
                    <SettingsIcon className="h-4 w-4" />
                    Settings
                  </NavItem>
                  <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <Button variant="link" className='flex items-center gap-3 rounded-lg  px-3 py-2 text-gray-900  transition-all hover:text-gray-900  dark:text-gray-50 dark:hover:text-gray-50'>
        <Power className="h-4 w-4" />
          Logout
          </Button>
      </form>
                </nav>
              </div>
    )
}