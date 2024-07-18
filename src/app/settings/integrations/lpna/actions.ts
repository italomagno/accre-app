import { getUserByEmail } from "@/src/app/login/_actions";
import { auth } from "@/src/lib/auth";
import prisma from "@/src/lib/db/prisma/prismaClient";
import { ErrorTypes, LoginLPNAValues, isErrorTypes } from "@/src/types";
import { $Enums, Roster, Shift, User } from "@prisma/client";
import { cookies } from "next/headers";




export async function signInOnLPNA(data: LoginLPNAValues){
    try{
        const session = await auth()
        if(!session){
            return {
                code: 401,
                message: "Usuário não está autenticado"
            }
        }
        const admin = await getUserByEmail(session.user.email)
        const hasErrorOnAdmin = isErrorTypes(admin)
        if(hasErrorOnAdmin){
            return {
                code: admin.code,
                message: admin.message
            }
        }
        if(admin.role !== "ADMIN"){
            return {
                code: 403,
                message: "Usuário não é administrador"
            }
        }

        const response = await fetch("https://api.lpna.com.br/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: data.email,
                senha: data.password
            })
        })
        if(response.status !== 200){
            return {
                code: response.status,
                message: `Erro ao fazer login com a LPNA. O Erro retornado pela lpna foi o seguinte: ${response.statusText}`
            }
        }
        const expires_in = (await response.json()).data.expires_in*1000
        if(data.savePassword){
            cookies().set("lpna", data.password, {
                expires: new Date(expires_in)
            })
        }

        const access_token = (await response.json()).data.access_token
        cookies().set("lpna_access_token", access_token, {
            expires: new Date(expires_in)
        })

        return {
            code: 200,
            message: "Login efetuado com sucesso na LPNA"
        }






    }catch(error){
        return {
            code: 500,
            message: "Erro ao fazer login"
        }
    }

}

export async function removeCookiesLPNA(){
    cookies().delete("lpna_access_token")
}


const ModelresponseFromLPNADepartment = {
    "status": true,
    "message": "",
    "data": {
        "name": "ACC-RE",
        "type": "ATM",
        "class": "2",
        "boss_operation_division": "GUILHERME TOSCANO BARRETO FERREIRA LYRA Ten Cel Av",
        "organ_chief": "STENIO JOS\u00c9 COLA\u00c7O BARROS 2\u00ba Ten QOEA CTA",
        "responsible_for_scale": "PAULO HENRIQUE DE AQUINO SANTOS 3S QSS BCT",
        "workload": 160,
        "workload_base": 130,
        "delegate_swap": "S",
        "scale_proposition": "S",
        "block_days_past": "N"
    }
}
type LPNADepartmentResponse = typeof ModelresponseFromLPNADepartment;

const getLPNADepartmentData = async (access_token: string): Promise<ErrorTypes | LPNADepartmentResponse> => {
    try{
    const responseFromLPNADepartment = await fetch("https://api.decea.mil.br/escala/api/organ", {
        method: "GET",
        headers: {
            " Authorization": `Bearer ${access_token}`
        }
    })
    if(responseFromLPNADepartment.status !== 200){
        return {
            code: responseFromLPNADepartment.status,
            message: `Erro ao buscar dados do departamento na LPNA. O erro retornado pela LPNA foi o seguinte: ${responseFromLPNADepartment.statusText}`
        }
    }
    return await responseFromLPNADepartment.json() as LPNADepartmentResponse

}catch(err){
    return {
        code: 500,
        message: "Erro ao buscar dados do departamento na LPNA"
    }

}

}
const classificationOBJECT = {
    "1": "ONE",
    "2": "TWO",
    "3": "THREE",
    "4": "FOUR",
} as unknown as $Enums.DepartmentClassification;


const ModelresponseFromLPNAbscencesShiftsData = {
    "status": true,
    "message": "",
    "data": [
        {
            "id": "00532da1-fc18-451d-8b9e-79959fd2b0ea",
            "scale_id": null,
            "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
            "name": "Escriv\u00e3o Inqu\u00e9rito",
            "legend": "IMP",
            "workload": 360,
            "type": "PIMO",
            "deleted_at": null,
            "created_at": "2024-07-03T19:14:28.000000Z",
            "updated_at": "2024-07-03T19:14:28.000000Z",
            "event_pimo": {
                "id": "a0228e7a-8344-40f4-a9a3-aee9ca67409d",
                "event_id": "00532da1-fc18-451d-8b9e-79959fd2b0ea",
                "pimo_type_id": "32bf08d3-f374-11ea-b9da-0242ac110003",
                "workload": "360",
                "ead": "N",
                "date_ead_start": null,
                "time_start": "06:00:00",
                "date_ead_end": null,
                "time_end": "12:00:00",
                "deleted_at": null,
                "created_at": "2024-07-03T19:14:29.000000Z",
                "updated_at": "2024-07-03T19:14:29.000000Z",
                "workload_total": "360",
                "type": {
                    "id": "32bf08d3-f374-11ea-b9da-0242ac110003",
                    "name": "Outras julgadas cab\u00edveis pela OM",
                    "created_at": null,
                    "updated_at": null,
                    "deleted_at": null
                }
            }
        },
    ]
}

type LPNAShiftAbscenceResponse = typeof ModelresponseFromLPNAbscencesShiftsData


const getLPNAAbscencesShiftsData = async (access_token: string): Promise<ErrorTypes | LPNAShiftAbscenceResponse> => {
    try{
        const responseFromLPNA = await fetch("https://api.decea.mil.br/escala/api/scale/event/pimo/general/list", {
            method: "GET",
            headers: {
                " Authorization": `Bearer ${access_token}`
            }
        })
        if(responseFromLPNA.status !== 200){
            return {
                code: responseFromLPNA.status,
                message: `Erro ao buscar dados de turnos na LPNA. O erro retornado pela LPNA foi o seguinte: ${responseFromLPNA.statusText}`
            }
        }
        const shifts = await responseFromLPNA.json()

        return shifts as LPNAShiftAbscenceResponse

}catch(err){
    return {
        code: 500,
        message: "Erro ao buscar dados de turnos da LPNA"
    }
}
}

const ModelResponseFromLPNAROsterData = {
    "status": true,
    "message": "",
    "data": [
        {
            "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
            "id": "6b6d4baf-a676-11ee-8c38-02420a000b06",
            "reference_month": "01",
            "reference_year": "2024",
            "habilitation_type": 6,
            "type": "Cumprida",
            "status": "Aprovado",
            "ordenation": "Antiguidade",
            "release_exchanges": 0,
            "on_proposition": "N",
            "rules_checked": "N",
            "created_by_id": "70aa9c74-4dea-11ee-a07a-0242ac640002",
            "deleted_by_id": null,
            "percentage_check_rules": null,
            "percentage_automatic_distribution": null,
            "draft": 0,
            "draft_created": null,
            "scale_reference_id": "2cc8a938-a037-11ee-8c38-02420a000b06",
            "created_at": "2023-12-29T18:16:43.000000Z",
            "updated_at": "2024-02-08T02:46:10.000000Z",
            "deleted_at": null,
            "pastTypes": [
                {
                    "id": "2cc8a938-a037-11ee-8c38-02420a000b06",
                    "type": "Pr\u00e9via"
                },
                {
                    "id": "2cc8a938-a037-11ee-8c38-02420a000b06",
                    "type": "Prevista"
                },
                {
                    "id": "6b6d4baf-a676-11ee-8c38-02420a000b06",
                    "type": "Efetiva"
                }
            ],
            "functions": [
                "Supervisor (SPVS)",
                "Operador (OPE)",
                "Estagi\u00e1rio (EST)"
            ],
            "modelsList": {
                "Supervisor (SPVS)": {
                    "id": "39047526-3966-4962-8422-a4a97a5a8305",
                    "name": "SUP 2023 3.0"
                },
                "Estagi\u00e1rio (EST)": {
                    "id": "7b827cd3-b1e7-438a-b377-9f766226bbf0",
                    "name": "EST MP"
                },
                "Operador (OPE)": {
                    "id": "90ea1562-211e-4cc4-a4ce-bd40f60cb65f",
                    "name": "OPERADOR SALVADOR"
                }
            },
            "reasonReject": "",
            "statusSign": "Assinada",
            "datesSign": {
                "Pr\u00e9via": "2023-12-29",
                "Prevista": {
                    "Chefe de \u00d3rg\u00e3o": null,
                    "Jurisdi\u00e7\u00e3o": null,
                    "Chefe da DO": null
                },
                "Efetiva": "2024-01-01",
                "Cumprida": {
                    "Escalante": "2024-02-06",
                    "Chefe de \u00d3rg\u00e3o": "2024-02-06",
                    "Jurisdi\u00e7\u00e3o": "2024-02-07",
                    "Chefe da DO": "2024-02-08"
                }
            },
            "scaleDraftId": null,
            "canRetryCheckRule": false,
            "observations": [
                {
                    "scale_id": "6b6d4baf-a676-11ee-8c38-02420a000b06",
                    "type": "Cumprida",
                    "observation": "Escala de estagi\u00e1rios: 3S Renata Leite n\u00e3o cumpriu os turnos de 18 a 20 devido dispensa m\u00e9dica. \n3S De Sousa n\u00e3o cumpriu os turnos de 23 a 27 devido dispensa m\u00e9dica."
                }
            ],
            "models": [
                {
                    "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
                    "id": "39047526-3966-4962-8422-a4a97a5a8305",
                    "name": "SUP 2023 3.0",
                    "regime": 24,
                    "status": "Aprovado",
                    "teams": 5,
                    "function": "Supervisor (SPVS)",
                    "archived": 1,
                    "created_at": "2023-07-19T12:46:09.000000Z",
                    "habilitation_type": 6,
                    "updated_at": "2024-01-02T14:02:50.000000Z",
                    "deleted_at": null,
                    "habilitation_type_text": "Controle de \u00c1rea por Vigil\u00e2ncia (ACC VGL)",
                    "pivot": {
                        "scale_id": "6b6d4baf-a676-11ee-8c38-02420a000b06",
                        "scale_model_id": "39047526-3966-4962-8422-a4a97a5a8305",
                        "created_at": "2023-12-29T18:16:43.000000Z",
                        "updated_at": null
                    }
                },
                {
                    "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
                    "id": "7b827cd3-b1e7-438a-b377-9f766226bbf0",
                    "name": "EST MP",
                    "regime": 24,
                    "status": "Aprovado",
                    "teams": 2,
                    "function": "Estagi\u00e1rio (EST)",
                    "archived": 1,
                    "created_at": "2023-05-17T12:59:00.000000Z",
                    "habilitation_type": 6,
                    "updated_at": "2024-01-02T14:02:52.000000Z",
                    "deleted_at": null,
                    "habilitation_type_text": "Controle de \u00c1rea por Vigil\u00e2ncia (ACC VGL)",
                    "pivot": {
                        "scale_id": "6b6d4baf-a676-11ee-8c38-02420a000b06",
                        "scale_model_id": "7b827cd3-b1e7-438a-b377-9f766226bbf0",
                        "created_at": "2023-12-29T18:16:43.000000Z",
                        "updated_at": null
                    }
                },
                {
                    "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
                    "id": "90ea1562-211e-4cc4-a4ce-bd40f60cb65f",
                    "name": "OPERADOR SALVADOR",
                    "regime": 24,
                    "status": "Aprovado",
                    "teams": 10,
                    "function": "Operador (OPE)",
                    "archived": 1,
                    "created_at": "2023-11-16T14:36:36.000000Z",
                    "habilitation_type": 6,
                    "updated_at": "2024-01-02T14:02:51.000000Z",
                    "deleted_at": null,
                    "habilitation_type_text": "Controle de \u00c1rea por Vigil\u00e2ncia (ACC VGL)",
                    "pivot": {
                        "scale_id": "6b6d4baf-a676-11ee-8c38-02420a000b06",
                        "scale_model_id": "90ea1562-211e-4cc4-a4ce-bd40f60cb65f",
                        "created_at": "2023-12-29T18:16:43.000000Z",
                        "updated_at": null
                    }
                }
            ]
        }
            
    ]
}

type LPNARosterResponse = typeof ModelResponseFromLPNAROsterData


const getLPNARosterData = async (access_token: string): Promise<ErrorTypes | LPNARosterResponse> => {
    try{
        const years = [new Date().getFullYear()-1,new Date().getFullYear(), new Date().getFullYear() + 1]
        const [lastYear,thisYear,nextYear] = await Promise.all(years.map(async year => {
            return await fetch(`https://api.decea.mil.br/escala/api/scale/${year}`, {
                method: "GET",
                headers: {
                    " Authorization": `Bearer ${access_token}`
                }
            })}
        ))

        if(lastYear.status !== 200){
            return {
                code: lastYear.status,
                message: `Erro ao buscar dados de escalas na LPNA. O erro retornado pela LPNA foi o seguinte: ${lastYear.statusText}`
            }
        }
        if(thisYear.status !== 200){
            return {
                code: thisYear.status,
                message: `Erro ao buscar dados de escalas na LPNA. O erro retornado pela LPNA foi o seguinte: ${thisYear.statusText}`
            }
        }
        if(nextYear.status !== 200){
            return {
                code: nextYear.status,
                message: `Erro ao buscar dados de escalas na LPNA. O erro retornado pela LPNA foi o seguinte: ${nextYear.statusText}`
            }
        }
        const rosters: LPNARosterResponse = 
            {
                status: true,
                message: "",
                data:[],
            }
        
        await Promise.all([lastYear,thisYear,nextYear].map(async response => {
            const data:LPNARosterResponse = await response.json()
            rosters.data.push(...data.data)
        }))


        return rosters as LPNARosterResponse

    }catch(err){
        return {
            code: 500,
            message: "Erro ao buscar dados de escalas da LPNA"
        }
    }

}
const ModelResponseFromLPNAShiftData = {
        "status": true,
        "message": "",
        "data": [
            {
                "id": "004c188e-93f9-484a-b14a-de385b51649e",
                "name": "ESCALA OP ACC-RE 09\/2022",
                "regime": 24,
                "status": "Aprovado",
                "function": "Operador (OPE)",
                "habilitation_type": 6,
                "archived": 1,
                "reasonReject": "",
                "shifts": [
                    {
                        "id": "5b8875a5-62a2-4b2d-9fb3-183eba3c5924",
                        "scale_model_id": "004c188e-93f9-484a-b14a-de385b51649e",
                        "legend": "M",
                        "period": "Manh\u00e3",
                        "timestamp_start": 1721271600000,
                        "timestamp_finish": 1721271600000,
                        "type": "Diurno",
                        "scale_model": {
                            "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
                            "id": "004c188e-93f9-484a-b14a-de385b51649e",
                            "name": "ESCALA OP ACC-RE 09\/2022",
                            "regime": 24,
                            "status": "Aprovado",
                            "teams": 10,
                            "function": "Operador (OPE)",
                            "archived": 1,
                            "created_at": "2022-08-26T14:02:16.000000Z",
                            "habilitation_type": 6,
                            "updated_at": "2024-02-21T14:40:52.000000Z",
                            "deleted_at": null,
                            "habilitation_type_text": "Controle de \u00c1rea por Vigil\u00e2ncia (ACC VGL)"
                        }
                    },
                    {
                        "id": "af798527-8d99-42eb-ba2a-2cc51a2e4ef2",
                        "scale_model_id": "004c188e-93f9-484a-b14a-de385b51649e",
                        "legend": "R1",
                        "period": "Manh\u00e3",
                        "timestamp_start": 1721271600000,
                        "timestamp_finish": 1721271600000,
                        "type": "Diurno",
                        "scale_model": {
                            "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
                            "id": "004c188e-93f9-484a-b14a-de385b51649e",
                            "name": "ESCALA OP ACC-RE 09\/2022",
                            "regime": 24,
                            "status": "Aprovado",
                            "teams": 10,
                            "function": "Operador (OPE)",
                            "archived": 1,
                            "created_at": "2022-08-26T14:02:16.000000Z",
                            "habilitation_type": 6,
                            "updated_at": "2024-02-21T14:40:52.000000Z",
                            "deleted_at": null,
                            "habilitation_type_text": "Controle de \u00c1rea por Vigil\u00e2ncia (ACC VGL)"
                        }
                    },
                    {
                        "id": "d780d27f-f825-4db2-b6e3-47622d15ee89",
                        "scale_model_id": "004c188e-93f9-484a-b14a-de385b51649e",
                        "legend": "T1",
                        "period": "Tarde",
                        "timestamp_start": 1721271600000,
                        "timestamp_finish": 1721271600000,
                        "type": "Diurno",
                        "scale_model": {
                            "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
                            "id": "004c188e-93f9-484a-b14a-de385b51649e",
                            "name": "ESCALA OP ACC-RE 09\/2022",
                            "regime": 24,
                            "status": "Aprovado",
                            "teams": 10,
                            "function": "Operador (OPE)",
                            "archived": 1,
                            "created_at": "2022-08-26T14:02:16.000000Z",
                            "habilitation_type": 6,
                            "updated_at": "2024-02-21T14:40:52.000000Z",
                            "deleted_at": null,
                            "habilitation_type_text": "Controle de \u00c1rea por Vigil\u00e2ncia (ACC VGL)"
                        }
                    },
                    {
                        "id": "9e1a28cd-1623-40d4-a53e-8de821bc21f8",
                        "scale_model_id": "004c188e-93f9-484a-b14a-de385b51649e",
                        "legend": "T2",
                        "period": "Tarde",
                        "timestamp_start": 1721271600000,
                        "timestamp_finish": 1721271600000,
                        "type": "Diurno",
                        "scale_model": {
                            "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
                            "id": "004c188e-93f9-484a-b14a-de385b51649e",
                            "name": "ESCALA OP ACC-RE 09\/2022",
                            "regime": 24,
                            "status": "Aprovado",
                            "teams": 10,
                            "function": "Operador (OPE)",
                            "archived": 1,
                            "created_at": "2022-08-26T14:02:16.000000Z",
                            "habilitation_type": 6,
                            "updated_at": "2024-02-21T14:40:52.000000Z",
                            "deleted_at": null,
                            "habilitation_type_text": "Controle de \u00c1rea por Vigil\u00e2ncia (ACC VGL)"
                        }
                    },
                    {
                        "id": "98635bf4-23f3-4e3b-92e3-aa8c85707b10",
                        "scale_model_id": "004c188e-93f9-484a-b14a-de385b51649e",
                        "legend": "R2",
                        "period": "Tarde",
                        "timestamp_start": 1721271600000,
                        "timestamp_finish": 1721271600000,
                        "type": "Diurno",
                        "scale_model": {
                            "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
                            "id": "004c188e-93f9-484a-b14a-de385b51649e",
                            "name": "ESCALA OP ACC-RE 09\/2022",
                            "regime": 24,
                            "status": "Aprovado",
                            "teams": 10,
                            "function": "Operador (OPE)",
                            "archived": 1,
                            "created_at": "2022-08-26T14:02:16.000000Z",
                            "habilitation_type": 6,
                            "updated_at": "2024-02-21T14:40:52.000000Z",
                            "deleted_at": null,
                            "habilitation_type_text": "Controle de \u00c1rea por Vigil\u00e2ncia (ACC VGL)"
                        }
                    },
                    {
                        "id": "ab973e34-95fc-466f-844b-bc33d79a2f67",
                        "scale_model_id": "004c188e-93f9-484a-b14a-de385b51649e",
                        "legend": "P1",
                        "period": "Pernoite",
                        "timestamp_start": 1721271600000,
                        "timestamp_finish": 1721271600000,
                        "type": "Diurno",
                        "scale_model": {
                            "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
                            "id": "004c188e-93f9-484a-b14a-de385b51649e",
                            "name": "ESCALA OP ACC-RE 09\/2022",
                            "regime": 24,
                            "status": "Aprovado",
                            "teams": 10,
                            "function": "Operador (OPE)",
                            "archived": 1,
                            "created_at": "2022-08-26T14:02:16.000000Z",
                            "habilitation_type": 6,
                            "updated_at": "2024-02-21T14:40:52.000000Z",
                            "deleted_at": null,
                            "habilitation_type_text": "Controle de \u00c1rea por Vigil\u00e2ncia (ACC VGL)"
                        }
                    },
                    {
                        "id": "a4add3c0-17b7-4c90-811d-1bc31bd728aa",
                        "scale_model_id": "004c188e-93f9-484a-b14a-de385b51649e",
                        "legend": "P2",
                        "period": "Pernoite",
                        "timestamp_start": 1721271600000,
                        "timestamp_finish": 1721271600000,
                        "type": "Diurno",
                        "scale_model": {
                            "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
                            "id": "004c188e-93f9-484a-b14a-de385b51649e",
                            "name": "ESCALA OP ACC-RE 09\/2022",
                            "regime": 24,
                            "status": "Aprovado",
                            "teams": 10,
                            "function": "Operador (OPE)",
                            "archived": 1,
                            "created_at": "2022-08-26T14:02:16.000000Z",
                            "habilitation_type": 6,
                            "updated_at": "2024-02-21T14:40:52.000000Z",
                            "deleted_at": null,
                            "habilitation_type_text": "Controle de \u00c1rea por Vigil\u00e2ncia (ACC VGL)"
                        }
                    },
                    {
                        "id": "5e42b111-9d98-4f1a-bce6-6b38f3003a62",
                        "scale_model_id": "004c188e-93f9-484a-b14a-de385b51649e",
                        "legend": "S1",
                        "period": "Manh\u00e3",
                        "timestamp_start": 1721271600000,
                        "timestamp_finish": 1721271600000,
                        "type": "Diurno",
                        "scale_model": {
                            "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
                            "id": "004c188e-93f9-484a-b14a-de385b51649e",
                            "name": "ESCALA OP ACC-RE 09\/2022",
                            "regime": 24,
                            "status": "Aprovado",
                            "teams": 10,
                            "function": "Operador (OPE)",
                            "archived": 1,
                            "created_at": "2022-08-26T14:02:16.000000Z",
                            "habilitation_type": 6,
                            "updated_at": "2024-02-21T14:40:52.000000Z",
                            "deleted_at": null,
                            "habilitation_type_text": "Controle de \u00c1rea por Vigil\u00e2ncia (ACC VGL)"
                        }
                    },
                    {
                        "id": "d9bb29cb-1182-45cb-a254-1f395964b224",
                        "scale_model_id": "004c188e-93f9-484a-b14a-de385b51649e",
                        "legend": "S2",
                        "period": "Tarde",
                        "timestamp_start": 1721271600000,
                        "timestamp_finish": 1721271600000,
                        "type": "Diurno",
                        "scale_model": {
                            "organ_id": "02c620bc-c019-44a2-9732-112cf9ebd957",
                            "id": "004c188e-93f9-484a-b14a-de385b51649e",
                            "name": "ESCALA OP ACC-RE 09\/2022",
                            "regime": 24,
                            "status": "Aprovado",
                            "teams": 10,
                            "function": "Operador (OPE)",
                            "archived": 1,
                            "created_at": "2022-08-26T14:02:16.000000Z",
                            "habilitation_type": 6,
                            "updated_at": "2024-02-21T14:40:52.000000Z",
                            "deleted_at": null,
                            "habilitation_type_text": "Controle de \u00c1rea por Vigil\u00e2ncia (ACC VGL)"
                        }
                    }
                ]
            },
        ]}

        type LPNAShiftResponse = typeof ModelResponseFromLPNAShiftData


const getLPNShiftsData = async (access_token: string):Promise<ErrorTypes | LPNAShiftResponse>=> {
    try{
        const responseFromLPNA = await fetch("https://api.decea.mil.br/escala/api/scale/model", {
            method: "GET",
            headers: {
                " Authorization": `Bearer ${access_token}`
            }
        })
        if(responseFromLPNA.status !== 200){
            return {
                code: responseFromLPNA.status,
                message: `Erro ao buscar dados de turnos na LPNA. O erro retornado pela LPNA foi o seguinte: ${responseFromLPNA.statusText}`
            }
        }
        const shifts = (await responseFromLPNA.json() as LPNAShiftResponse).data.filter(shift=>shift.archived === 0 && (shift.function.toLowerCase().includes("ope") && shift.habilitation_type !== 29) && shift.function.toLowerCase().includes("sup"))
        const response:LPNAShiftResponse = {
            status: false,
            message: "",
            data: shifts
        }
        return response

    }catch(err){
        return {
            code: 500,
            message: "Erro ao buscar dados de turnos da LPNA"
        }
    }
}


export async function getLPNAData(): Promise<ErrorTypes | {users: User[], shifts: Shift[], rosters: Roster[]}>{
    try{
        const session = await auth()
        if(!session){
            return {
                code: 401,
                message: "Usuário não está autenticado"
            }
        }
        const admin = await getUserByEmail(session.user.email)
        const hasErrorOnAdmin = isErrorTypes(admin)
        if(hasErrorOnAdmin){
            return {
                code: admin.code,
                message: admin.message
            }
        }
        if(admin.role !== "ADMIN"){
            return {
                code: 403,
                message: "Usuário não é administrador"
            }
        }

        const access_token = cookies().get("lpna_access_token")?.value
        if(!access_token){
            return {
                code: 401,
                message: "Token de acesso não encontrado"
            }
        }
        const [lpnaDepartmentData,lpnaShiftAbcesesData, lpnaRosterData, lpnaShiftsData ] = await Promise.all([await getLPNADepartmentData(access_token), await getLPNAAbscencesShiftsData(access_token), await getLPNARosterData(access_token), await getLPNShiftsData(access_token)])
        const hasErrorOnLPNADepartment = isErrorTypes(lpnaDepartmentData)
        if(hasErrorOnLPNADepartment){
            return {
                code: lpnaDepartmentData.code,
                message: lpnaDepartmentData.message
            }
        }
       const updatedDepartment =  await prisma.department.update({
            where: {
                id: admin.departmentId
            },
            data:{
                name: lpnaDepartmentData.data.name,
                classification: classificationOBJECT[parseFloat(lpnaDepartmentData.data.class)] as $Enums.DepartmentClassification,
            }
        })
        const hasErrorOnLPNAAbcenses = isErrorTypes(lpnaShiftAbcesesData)
        if(hasErrorOnLPNAAbcenses){
            return {
                code: lpnaShiftAbcesesData.code,
                message: lpnaShiftAbcesesData.message
            }
        }
        const hasErrorOnlpnaShiftsData = isErrorTypes(lpnaShiftsData)
        if(hasErrorOnlpnaShiftsData){
            return {
                code: lpnaShiftsData.code,
                message: lpnaShiftsData.message
            }
        }
        const hasErrorOnLPNARoster = isErrorTypes(lpnaRosterData)
        if(hasErrorOnLPNARoster){
            return {
                code: lpnaRosterData.code,
                message: lpnaRosterData.message
            }
        }
        const convertReferenceMonthToRosterMonth = {
            "01": "JAN",
            "02": "FEB",
            "03": "MAR",
            "04": "APR",
            "05": "MAY",
            "06": "JUN",
            "07": "JUL",
            "08": "AUG",
            "09": "SEP",
            "10": "OCT",
            "11": "NOV",
            "12": "DEC",
        } as unknown as $Enums.Months;
        const rosters= lpnaRosterData.data.map(roster => {
            const Roster = {
                month:  convertReferenceMonthToRosterMonth[parseFloat(roster.reference_month)] as $Enums.Months,
                year: parseFloat(roster.reference_year),
                minWorkingHoursPerRoster: lpnaDepartmentData.data.workload_base,
                maxWorkingHoursPerRoster: lpnaDepartmentData.data.workload,
                departmentId: admin.departmentId,
                blockChanges: roster.type !== "Pr\u00e9via",
            }
            return Roster
        }
        )
        const abscences = lpnaShiftAbcesesData.data.map(abscence => {
            var start
            var end
            const workloadInHoursInMiliseconds = (abscence.workload ?? 0 )* 60 * 1000
            const workLoadInhours = Math.floor(workloadInHoursInMiliseconds / 60)
            const checkifworkloadInhourInMilisecondsIsMoreThanOneDay = Math.floor(workloadInHoursInMiliseconds / 60 / 60 / 1000) >= 24
            const howManyDaysHasInthisWorkload = Math.floor(workloadInHoursInMiliseconds / 60 / 60 / 1000 / 24)
            const time_start = abscence.event_pimo.time_start
            if(time_start){
                const startHour = parseFloat(time_start.split(":")[0] ?? "0")
                const startMinutes = parseFloat(time_start.split(":")[1] ?? "0")
                start = new Date(0,0,0,startHour,startMinutes)
                const endHour = startHour + Math.floor(workloadInHoursInMiliseconds / 60 / 60 / 1000)
                const endMinutes = startMinutes + Math.floor(workloadInHoursInMiliseconds / 60 / 1000) % 60

                end = new Date(0,0,checkifworkloadInhourInMilisecondsIsMoreThanOneDay ? howManyDaysHasInthisWorkload : 0,endHour,endMinutes)
            }else{
                start = new Date(0,0,0,0,0)
                end = new Date(0,0,checkifworkloadInhourInMilisecondsIsMoreThanOneDay ?howManyDaysHasInthisWorkload : 0,(workLoadInhours ?? 0 ),workloadInHoursInMiliseconds %60)
            }

            return{
                name: abscence.legend,
                type: abscence.type,
                workload: abscence.workload,
                legend: abscence.legend,
                createdAt: new Date(abscence.created_at),
                departmentId: admin.departmentId,
                isAbscence: true,
                quantity:0,
                minQuantity:0,
                isOnlyToSup:false,
                isAvailable:true,
                start,
                end,
            }
        })
        const shiftsFromOpe = lpnaShiftsData.data.filter(shift=>shift.function.toLowerCase().includes("ope")).map(shift =>{ 
            const AllShiftsFromOperator = shift.shifts.map(shiftData => {
                const newShift = {
                    name: shiftData.legend,
                    isOnlyToSup: false,
                    isAvailable: true,
                    departmentId: admin.departmentId,
                    isAbscence: false,
                    minQuantity: 0,
                    quantity: 0,
                    start: new Date(shiftData.timestamp_start),
                    end: new Date(shiftData.timestamp_finish),

                }
                return newShift
            })
            return [...AllShiftsFromOperator]
        })
        const shiftsFromSup = lpnaShiftsData.data.filter(shift=>shift.function.toLowerCase().includes("sup")).map(shift =>{
            const AllShiftsFromSupervisor = shift.shifts.map(shiftData => {
                const newShift = {
                    name: shiftData.legend,
                    isOnlyToSup: true,
                    isAvailable: true,
                    departmentId: admin.departmentId,
                    isAbscence: false,
                    minQuantity: 0,
                    quantity: 0,
                    start: new Date(shiftData.timestamp_start),
                    end: new Date(shiftData.timestamp_finish),
                }
                return newShift

            })
            return [...AllShiftsFromSupervisor]
        }
        )

        const onlyShifts = [...shiftsFromOpe, ...shiftsFromSup].flat()
        const shifts = [...onlyShifts, ...abscences]
        
        //ToDo getUsersFromLPNA
        //alo
       

    }catch(error){
        console.log("getLPNADataError: ",error)
        return {
            code: 500,
            message: `Erro ao buscar dados da LPNA. `
        }
    }


}
