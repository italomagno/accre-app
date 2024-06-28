import { LayoutComponent } from "../LayoutComponent";
import { getUserRole } from "./actions";
import { SettingsNavigation } from "./settingsNavigation";


interface SettingsLayoutProps {
    children: React.ReactNode;
}
export default async function SettingsLayout({children}:SettingsLayoutProps){
  const userRole = await getUserRole()
    return(
    <LayoutComponent
    isLogin={false}
    >
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 mt-8">
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        </div>
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Configurações</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsNavigation
            role={userRole}
          />
          <div className="grid gap-6">
            {children}
            </div>
        </div>
    </main>
    </LayoutComponent>

    )
}