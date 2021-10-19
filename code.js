
const info ={};

const weatherKey="0411b2d911f6317077f4524e11748c92";

let form=document.getElementById("myForm");
let tempValue=document.getElementById("temp_value");
let tempStatus=document.getElementById("temp_status");
let tempIcon=document.getElementById("temp_icon");
let nationalFlag=document.getElementById("national_flag");
let time=document.getElementById("time");
let capitalCity=document.getElementById("capital_city");
let currency=document.getElementById("currency");
let learn=document.getElementById("learn");
let sign=document.getElementById("sign");
let valueSign=document.getElementById("value_sign");
let currencyValue=document.getElementById("currency_value");
let active=document.getElementById("active");
let confirmed=document.getElementById("confirmed");
let recovered=document.getElementById("recovered");
let deaths=document.getElementById("deaths");
let update=document.getElementById("update");

let peoples=document.getElementById("population");
let rank=document.getElementById("rank");




//collect country name from input form
form.addEventListener("submit",(e)=>{
  e.preventDefault();

  let country=document.getElementById("select_country").value;

  info.country=country;
  
  covidInfo();
})

// collect cordinate from window object
window.addEventListener("load",()=>{
   
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position)=>{

            info.lon = position.coords.longitude;
            info.lat= position.coords.latitude;

            const api=`https://api.openweathermap.org/data/2.5/weather?lat=${info.lat}&lon=${info.lon}&appid=${weatherKey}`;
  
            fetch(api)
            .then(response=>response.json())
            .then(data=>{
              info.country=data.sys.country;
              covidInfo();
            })
            .catch(error => console.log('error', error));
          })
        }
})

function setData(){


  //set flag
  nationalFlag.innerHTML =`<img src="https://www.countryflags.io/${info.countryCode}/flat/64.png">`;

  //set capital
  capitalCity.innerHTML=info.capital;

  //set currency
   currency.innerHTML=info.currency;
    sign.innerHTML=info.currencySymbol;
    currencyValue.innerHTML=info.currencyValue;
    valueSign.innerHTML=info.currency;

  // population

  peoples.innerHTML=info.population
  rank.innerHTML=info.rank;

  //corona update 

  active.innerHTML=info.active;
  confirmed.innerHTML=info.confirmed;
  recovered.innerHTML=info.recovered;
  deaths.innerHTML=info.deaths;
  update.innerHTML=info.date;

  
  //set temparature
  tempValue.textContent=Math.round(info.temparature)-273;
  tempStatus.textContent=info.condition;
   
  if(info.id>=200 && info.id<=232){
    tempIcon.innerHTML=`<img src="icons/thunderstorms.png" width="64" height="64"/>`;
  }

  else if(info.id>=300 && info.id<=321){
    tempIcon.innerHTML=`<img src="icons/drizzle.png" width="64" height="64"/>`;
  }

  else if(info.id>=500 && info.id<=531){
    tempIcon.innerHTML=`<img src="icons/raining.png" width="64" height="64"/>`;
  }

  else if(info.id>=600 && info.id<=622){
    tempIcon.innerHTML=`<img src="icons/snow.png" width="64" height="64"/>`;
  }
  else if(info.id>=300 && info.id <=321){
    tempIcon.innerHTML=`<img src="icons/atmosphere.png" width="64" height="64"/>`;
  }
  else if(info.id==800){
    tempIcon.innerHTML=`<img src="icons/clear-sky.png" width="64" height="64"/>`;
  }
  else if(info.id>=801 && info.id<=804){
    tempIcon.innerHTML=`<img src="icons/cloud.png" width="64" height="64"/>`;
  }
}

function weatherApiByAxis(){

  const api=`https://api.openweathermap.org/data/2.5/weather?lat=${info.lat}&lon=${info.lon}&appid=${weatherKey}`;

  fetch(api)
  .then(response=>response.json())
  .then(data=>{
    // console.log(data);
    
    info.temparature=data.main.feels_like;
    info.id=data.weather[0].id;
    info.condition=data.weather[0].main;

    mapShowing(info.lat, info.lon);
  })
  .catch(error => console.log('error', error));
}


//function for displaying map according to latitude and longitude

function mapShowing(lat,long){

  let map=document.getElementById("map");
 
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWthc2g5ODg4IiwiYSI6ImNrczVvYWpxMjFkb3QydnJ3d2pqM200NWUifQ.Gxxd9ss4eieo-gN5nWGecw';
  map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center:[`${long}`,`${lat}`],
  zoom:4
  });

  currencyConversion();

}

// function for fetching additionalInfo(capital,currency and currency symbol)

function additionalInfo(){
    
  var headers = new Headers();
  headers.append("X-CSCAPI-KEY", "bFlPNVpEbGxJTUlUa0JXTHZ0eXRmcXNaV3Y2a1lWMXJJc09qeHM2Yg==");
  
  var requestOptions = {
   method: 'GET',
   headers: headers,
   redirect: 'follow'
  };

  
  fetch(`https://api.countrystatecity.in/v1/countries/${info.countryCode}`, requestOptions)
  
  .then(response => response.json())
  .then(data => {

    info.name=data.name;
    info.capital=data.capital;
    info.currency=data.currency;
    info.currencySymbol=data.currency_symbol;
    info.lon=data.longitude;
    info.lat=data.latitude;

    weatherApiByAxis();
  })
  .catch(error => console.log('error', error));

}

// function for fetching data from covid api
function covidInfo(){

    const covidApi=`https://api.covid19api.com/live/country/`+`${info.country}`+`/status/confirmed`;
    fetch(covidApi)
    .then(response => response.json())
    .then(data=>{
      
      let index=data.length-1;

      info.active=new Intl.NumberFormat('en-IN').format(data[index].Active);
      info.confirmed=new Intl.NumberFormat('en-IN').format(data[index].Confirmed);
      info.countryCode=data[index].CountryCode;
      info.deaths=new Intl.NumberFormat('en-IN').format(data[index].Deaths);;
      info.recovered=new Intl.NumberFormat('en-IN').format(data[index].Recovered);;
      info.date=data[index].Date;

      additionalInfo();
    })
    .catch(error => console.log('error', error));
}

// function for fetching currency calue against euro 
function currencyConversion(){

  fetch(`http://data.fixer.io/api/latest?access_key=6404c6490319aa308d5b8fcef2c0bc81`)
    .then(response =>response.json())
    .then(data=>{
    
       const arr=Object.entries(data.rates);

       var BreakException = {};

       try{
         arr.forEach(element=>{
           if(element[0]==info.currency){
              info.currencyValue=element[1].toFixed(2);
              throw BreakException;
           }
         })
       }
       catch (e) {
          if (e !== BreakException) throw e;
        }
     
       populations();
    
    })
    .catch(error => console.log('error', error));
}

function populations(){
  fetch(`https://world-population.p.rapidapi.com/population?country_name=${info.name}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "world-population.p.rapidapi.com",
		"x-rapidapi-key": "eda8f4c3f0msh575f8b7591e92bfp1a65aajsnca636a4b3e44"
	}
  })
  .then(response => response.json())
  .then(data=>{

    info.population=new Intl.NumberFormat('en-IN').format(data.body.population);
    info.rank=data.body.ranking;
    setData();
  })
  .catch(err => {
	console.error(err);
  });
}

