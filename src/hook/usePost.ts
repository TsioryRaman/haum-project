import { useState } from "react"
import { ApiFetch, HTTP_METHOD } from "../api"

type PostType = [data:Object,loadData: (url:string,method:HTTP_METHOD,json?:any) => void]

export const usePost = () : PostType => {
    const [data,setData] = useState<any>({}) 
    
    const loadData = async (url:string,method:HTTP_METHOD,json?:any) => {
        try{
            const _response = await ApiFetch(url,method,json)

            setData(_response)
        }catch(e){
            throw e
        }
    }

    return [
        data,
        loadData
    ]

}