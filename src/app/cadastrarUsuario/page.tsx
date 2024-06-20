import { RegisterUserComponent } from "@/src/components/register/RegisterUserComponent";
import { LayoutComponent } from "../LayoutComponent";
import { getDepartments } from "./actions";

 

export default async function cadastrarUsuario() {
        const departments = await getDepartments();

        return (
                <LayoutComponent
                isLogin={true}
                >
                <RegisterUserComponent departments={departments}/>
                </LayoutComponent>
        );
}