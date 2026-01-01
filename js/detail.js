
const parms=new URLSearchParams(location.search);
const id=parms.get('id');
const item=window.animeData.find(a=>a.id===id);
const root=document.getElementById('detail');
if(!item){root.innerHTML='<p>Not found</p>'}
else{
 root.innerHTML=`<div class='card' style='margin:20px;'><img src='${item.cover}'/><div style='padding:16px'><h2>${item.title}</h2><p>${item.desc}</p><p><b>Studio:</b> <a href='index.html?studio=${encodeURIComponent(item.studio)}'>${item.studio}</a></p><div class='grid' id='gal'></div></div></div>`;
 const gal=document.getElementById('gal');
 item.gallery.forEach(g=>{
  const im=document.createElement('img');
  im.src=g;im.style.borderRadius='12px';im.onclick=()=>openModal(g);
  gal.appendChild(im);
 });
}

function openModal(src){
 const m=document.getElementById('galleryModal');
 document.getElementById('galleryImg').src=src;
 m.classList.remove('hidden');
}
