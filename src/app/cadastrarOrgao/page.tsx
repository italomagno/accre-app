import { DepartmentFormComponent } from "@/src/components/register/department/departmentFormComponent";
import { LayoutComponent } from "../LayoutComponent";




export default function createDepartmentPage(){
    return (
        <LayoutComponent
            isLogin={true}
        >
        <main className="flex flex-1 flex-col  w-dvw">
            <div className='mx-auto'>
                <DepartmentFormComponent />
            </div>
        </main>
        </LayoutComponent>

    );
}