import { ErrorComponent } from "@/src/components/errorComponent"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { getDepartmentBySession } from "../../../cadastrarOrgao/actions"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components//ui/tabs"
import { CreateUserComponent } from "@/src/components/register/user/CreateUserComponent"
import { CreateManyUsersComponent } from "@/src/components/register/user/CreateManyUsersComponent"



export default async function createUser(){
        
        const department = await getDepartmentBySession()
        const hasErrorOnDepartment = "code" in department
        if(hasErrorOnDepartment){
          return(
            <ErrorComponent
            error={department}
            />
          )
        }
      
        const pageTitle = `Usuários Cadastrados no ${department.name}`

       
      
        return (
              <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>{pageTitle}</CardTitle>
                <CardDescription>
                </CardDescription>
              </CardHeader>
              <CardContent className='flex flex-wrap flex-col gap-4' >
              <Tabs defaultValue="createManyUsers" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="createSingleUser">Criar um usuário</TabsTrigger>
    <TabsTrigger value="createManyUsers">Criar Vários usuários</TabsTrigger>
  </TabsList>
  <TabsContent value="createSingleUser"><CreateUserComponent department={department}/></TabsContent>
  <TabsContent value="createManyUsers"><CreateManyUsersComponent/></TabsContent>
</Tabs>

                
              </CardContent>
            </Card>
      
        );
      }
      