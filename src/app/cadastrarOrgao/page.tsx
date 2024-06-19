import { LayoutComponent } from "../LayoutComponent";
import { DepartmentFormComponent } from "../departmentFormComponent";



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