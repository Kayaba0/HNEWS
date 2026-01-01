
const content=document.getElementById('content');
const langToggle=document.getElementById('langToggle');
const themeToggle=document.getElementById('themeToggle');
const loginBtn=document.getElementById('loginBtn');
const search=document.getElementById('search');

let lang=localStorage.getItem('lang')||'it';
let theme=localStorage.getItem('theme')||'dark';
document.documentElement.setAttribute('data-theme',theme);

themeToggle.onclick=()=>{
 theme=theme==='dark'?'light':'dark';
 localStorage.setItem('theme',theme);
 document.documentElement.setAttribute('data-theme',theme);
}

langToggle.onclick=()=>{
 lang=lang==='it'?'en':'it';
 localStorage.setItem('lang',lang);
 render();
}

search.oninput=render;

function groupByMonth(data){
 return data.reduce((acc,a)=>{
  const d=new Date(a.date);
  const key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
  acc[key]=acc[key]||[];acc[key].push(a);return acc;
 },{});
}

function render(){
 let list=window.animeData.filter(a=>a.title.toLowerCase().includes(search.value.toLowerCase()));
 const grouped=groupByMonth(list);
 content.innerHTML='';
 Object.keys(grouped).sort().reverse().forEach(key=>{
  const wrap=document.createElement('section');
  const [y,m]=key.split('-');
  wrap.innerHTML=`<h2>${monthName(m,lang)} ${y}</h2><div class='grid'></div>`;
  grouped[key].forEach(a=>{
    const c=document.createElement('div');
    c.className='card';
    c.onclick=()=>location.href='detail.html?id='+a.id;
    c.innerHTML=`<img src='${a.cover}'/><div style='padding:12px'><h3>${a.title}</h3><p>${a.desc}</p></div>`;
    wrap.querySelector('.grid').appendChild(c);
  });
  content.appendChild(wrap);
 });
}

function monthName(m,lang){
 const it=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
 const en=['January','February','March','April','May','June','July','August','September','October','November','December'];
 return lang==='it'?it[m-1]:en[m-1];
}

render();
