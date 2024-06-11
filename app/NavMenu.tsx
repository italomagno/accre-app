import { DashboardLogo } from "@/components/icons";
import { UsersIcon, SettingsIcon } from "lucide-react";
import { NavItem } from "./nav-item";
import { HiOutlineRocketLaunch } from "react-icons/hi2";


export function NavMenu() {
    return (
        <div className="relative flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                  <NavItem href="/">
                    <DashboardLogo className="h-4 w-4" />
                    Escala Geral
                  </NavItem>
                  <NavItem href="/lancamento">
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
                </nav>
                
              </div>
    )
}