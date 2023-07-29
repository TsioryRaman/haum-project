export enum HTTP_METHOD  {
    POST = "POST",
    GET = "GET",
    PUT = "PUT",
    DELETE = "DELETE"
}
export const ApiFetch = async (url:string,method:HTTP_METHOD,json?:any) => {
    try{
        var response = await fetch(url,{
            method:method,
            body:method === HTTP_METHOD.POST ? JSON.stringify(json) : null,
            headers: {
                "content-type":"application/json"
            },
            credentials:"include"
        })
        if(response.ok){
            return response.json()
        }
        console.log(response)
        throw new ApiFetchError("Une erreur s'est produite",response)
    }catch(e){
        throw e
    }
}
class ApiFetchError extends Error {
    constructor(message:string,cause:any){
        super(message)
    }
}