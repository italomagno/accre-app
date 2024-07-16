import { RegisterUserComponent } from "@/src/components/register/user/RegisterUserComponent";
import { LayoutComponent } from "../LayoutComponent";
import { getDepartments } from "./actions";

export default async function cadastrarUsuario() {
        const departments = await getDepartments();
        if("code" in departments){
                return (
                        <LayoutComponent
                        isLogin={true}
                        >
                        <RegisterUserComponent 
                        departments={[]}/>
                        </LayoutComponent>
                );
        }

        return (
                <LayoutComponent
                isLogin={true}
                >
                <RegisterUserComponent 

                departments={departments}/>
                </LayoutComponent>
        );
}