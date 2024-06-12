import { LayoutComponent } from "@/src/app/LayoutComponent";
import { LoginPageComponent } from "@/src/app/LoginPageComponent";

export default async function login() {
        return (
                <LayoutComponent
                isLogin={true}
                >
                <LoginPageComponent/>
                </LayoutComponent>
        );
}