import { CreateRosterComponent } from "@/src/components/register/CreateRosterComponent";
import { LayoutComponent } from "../../LayoutComponent";



export default function createRoster() {
    return (
        <LayoutComponent
            isLogin={false}
        >
            <CreateRosterComponent/>
        </LayoutComponent>
    );
}