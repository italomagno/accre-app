import { LayoutComponent } from "app/LayoutComponent";
import { LoginPageComponent } from "app/LoginPageComponent";

export default async function login() {
        return (
                <LayoutComponent
                isLogin={true}
                >
                <LoginPageComponent/>
                </LayoutComponent>
        );
}