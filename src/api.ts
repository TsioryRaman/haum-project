export enum HTTP_METHOD  {
    POST = "POST",
    GET = "GET",
    PUT = "PUT",
    DELETE = "DELETE"
}
export const ApiFetch = async (url:string,method:HTTP_METHOD,json?:any) => {
    try{
        console.log(JSON.stringify(json))
        var response = await fetch(url,{
            method:method,
            body:method === HTTP_METHOD.POST ? JSON.stringify(json) : null,
            headers: {
                "content-type":"application/json"
            },
            credentials:"include"
        })
        if(response.ok){
            return response
        }
        throw response
    }catch(e){
        throw e
    }
}
class ApiFetchError extends Error {
    constructor(message:string,cause:any){
        super(message)
    }
}