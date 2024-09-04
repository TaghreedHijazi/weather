import request from "request";

const openWeatherMap ={
    BASE_URL: "http://api.openweathermap.org/data/2.5/weather?q=",
    SECRET_KEY:"f4d33b1060df0b4aa4125dcd265fbecb"
}

const weatherData = (address, callback) =>{
    const url = openWeatherMap.BASE_URL + encodeURIComponent(address) + "&APPID="+ openWeatherMap.SECRET_KEY;
    console.log(url);
    request({url, json:true}, (error,data) =>{
        if(error){
            callback(true, "unable to fetch data, please try again" + error);
        }
        callback(false, data?.body)
    });
};

export default weatherData;