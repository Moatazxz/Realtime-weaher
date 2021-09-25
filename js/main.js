let findInput=document.getElementById('findInput');
let find=document.getElementById('find');
let countery=document.getElementById('countery');
let d1=document.getElementById('d1');
let dt1=document.getElementById('dt1');
let degre1=document.getElementById('degre1');
let icon1=document.getElementById('icon1');
let icon_1_2=document.getElementById('icon_1_2');
let status1=document.getElementById('status1');
let d2=document.getElementById('d2');
let icon2=document.getElementById('icon2');
let degre2=document.getElementById('degre2');
let status2=document.getElementById('status2');
let d3=document.getElementById('d3');
let icon3=document.getElementById('icon3');
let degre3=document.getElementById('degre3');
let status3=document.getElementById('status3');
let alertP=document.getElementById('alertP');
let clocation={};
let currentWeather={};
let forecastday=[];
let iconCode= [];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//inner values in html
function inner(id,innerData){
    id.innerHTML=`${innerData}`;
} 

//to formatting the date and calc secod day and last day
function dateDetails(date){
    let d = new Date(`${date}`);
    let temp=d.getDay();
    if(temp==5){
      return [`${days[temp]}`,`${days[temp+1]}`,`${days[0]}`,`${d.getDate()}-${months[d.getMonth()]}`]; 
    }
    if(temp==6){
      return [`${days[temp]}`,`${days[0]}`,`${days[1]}`,`${d.getDate()}-${months[d.getMonth()]}`]; 
    }
    if(temp<5)
    {
      return [`${days[temp]}`,`${days[temp+1]}`,`${days[temp+2]}`,`${d.getDate()}-${months[d.getMonth()]}`];
    }
    else{
      return 0;
    }
}

//get API
async function getWeather(val){

  //Api about weather information
  let result=await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b144107801b14066a2264504212309&q=${val}&days=3`);
    let testResult= await result.json();
    //Api about the name and code of icones
    let resultIcon= await fetch('https://www.weatherapi.com/docs/conditions.json');
    iconCode=await resultIcon.json();
    //check response
    if ( result.status==200){
      clocation=testResult.location;
      currentWeather=testResult.current;
      forecastday=testResult.forecast.forecastday;
      fillData();
      fillIcones();
    }else{
errMessage();
    }
}

//default prameter detect your location 
getWeather('auto:ip');

//take date from api response and formated it into html
function fillData(){
  let dt=dateDetails(clocation.localtime.slice(0,10));
  let roundDegree=Math.round(currentWeather.temp_c);
  let roundDegree2=Math.round(forecastday[1].day.avgtemp_c);
  let roundDegree3=Math.round(forecastday[2].day.avgtemp_c);
  inner(countery,`${clocation.name}`);  
  inner(d1,`${dt[0]}`);
  inner(d2,`${dt[1]}`);
  inner(d3,`${dt[2]}`);
  inner(dt1,`${dt[3]}`);
  inner(degre1,`${roundDegree}°C`);
  inner(degre2,`${roundDegree2}°C`);
  inner(degre3,`${roundDegree3}°C`);
  inner(status1,`${currentWeather.condition.text}`);
  inner(status2,`${forecastday[1].day.condition.text}`);
  inner(status3,`${forecastday[2].day.condition.text}`);
  
}

//take icone code and return icone name **compare api responses
function getCodeName(icode){
  let temp=0;
  iconCode.forEach((element,index)=>{

    if(iconCode[index].code==icode){
     temp=element.icon;
    }


  })
  return temp;
};

//put img src in html 
function setIcons(id,path){
  if(currentWeather.is_day==0){
   id.setAttribute('src',`img/night/${path}.png`);
  }
  else{
    id.setAttribute('src',`img/day/${path}.png`);
  }
}
//format data about icon from api and send to setIcons to set icons
function fillIcones(){

  currentIconCode=getCodeName(currentWeather.condition.code);
  secondIconCode=getCodeName(forecastday[1].day.condition.code);
  thirdIconCode=getCodeName(forecastday[2].day.condition.code);
  setIcons(icon1,113);
  setIcons(icon_1_2,currentIconCode);
  setIcons(icon2,secondIconCode);
  setIcons(icon3,thirdIconCode);
  
  
}

//call api when press on button with spesefic input
find.addEventListener('click',(e)=>{
  let inp =findInput.value;
console.log(e);
  getWeather(inp);
});
//call api when press on Enter with spesefic input
document.addEventListener('keydown',(e)=>{
 if(e.key=='Enter'){
   if(findInput.value!=""){
    getWeather(findInput.value);
   }
 }
});
//to hide error message
findInput.addEventListener('change',()=>{
  alertP.classList.replace('o-1','o-0');
})
//to show error message
function errMessage(){

  alertP.classList.replace('o-0','o-1');
}
//real time search in api
findInput.addEventListener('keyup',(e)=>{
  getWeather(findInput.value);
});

