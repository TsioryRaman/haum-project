import axios from "axios";
const APP_ID = "0b2914d9b7e6fe86f5ca50f813afc0c0"

export const getMeteoForCityFake = (city) => {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            const ret = {
                weather:[
                    {
                        main:"Pluvieux",
                        description: "Forte précipitations",
                    }
                ],
                main:{
                    temp: 25,
                },
                name:city
            }
            resolve(ret);
        },5000)
    })
}

export const getMeteoForCity = (city) => {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APP_ID}&lang=fr`)
}