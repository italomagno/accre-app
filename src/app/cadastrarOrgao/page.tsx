import { LayoutComponent } from "../LayoutComponent";
import { DepartmentFormComponent } from "../departmentFormComponent";



export default function createDepartmentPage(){
    return (
        <LayoutComponent
            isLogin={true}
        >
        <main className="flex flex-1 flex-col p-4 md:p-6 w-dvw">
            <div className="flex items-center mb-8">
                <h1 className="font-semibold text-lg md:text-2xl">Cadastrar Orgão</h1>
            </div>
            <div className='mx-auto'>
                <DepartmentFormComponent />
            </div>
        </main>
        </LayoutComponent>

    );
}