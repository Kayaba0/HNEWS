async function loadData(){
  const res = await fetch("data.json?v=" + Date.now());
  ANIME = await res.json();

  populateFilters();
  applyFilters();
}

function populateFilters(){
  fill("yearFilter",[...new Set(ANIME.map(a=>a.year))]);
  fill("monthFilter",[...new Set(ANIME.map(a=>a.month))]);
  fill("genreFilter",[...new Set(ANIME.map(a=>a.genre))]);
  fill("studioFilter",[...new Set(ANIME.map(a=>a.studio))]);

  ["yearFilter","monthFilter","genreFilter","studioFilter","statusFilter"]
  .forEach(id=>document.getElementById(id).onchange=applyFilters);

  search.oninput=applyFilters;
  themeToggle.onclick=()=>document.body.classList.toggle("light");
}

function fill(id,data){
  document.getElementById(id).innerHTML=
   `<option value=''>Tutti</option>`+
   data.map(v=>`<option>${v}</option>`).join('');
}

function applyFilters(){
  let list=ANIME;

  if(search.value) list=list.filter(a=>a.title.toLowerCase().includes(search.value.toLowerCase()));
  if(yearFilter.value) list=list.filter(a=>a.year==yearFilter.value);
  if(monthFilter.value) list=list.filter(a=>a.month==monthFilter.value);
  if(genreFilter.value) list=list.filter(a=>a.genre==genreFilter.value);
  if(studioFilter.value) list=list.filter(a=>a.studio==studioFilter.value);
  if(statusFilter.value) list=list.filter(a=>a.status==statusFilter.value);

  renderList(list);
}

function renderList(list){
  animeList.innerHTML='';
  list.forEach(a=>{
    const d=document.createElement('div');
    d.className='item';
    d.innerHTML=`<img src='${a.cover}'>
    <div><b>${a.title}</b><br>${a.month} ${a.year}</div>`;
    d.onclick=()=>showDetails(a);
    animeList.appendChild(d);
  });

  if(list[0]) showDetails(list[0]);
}

function showDetails(a){
  heroImage.src=a.cover;
  title.textContent=a.title;
  studio.textContent=a.studio;
  date.textContent=a.release;
  plot.textContent=a.plot;

  gallery.innerHTML=a.images.map(i=>`<img src='${i}'>`).join('');
  [...gallery.children].forEach(img=>img.onclick=()=>openModal(img.src));
}

function openModal(src){
  modalImg.src=src;
  modal.style.display='flex';
}
modal.onclick=()=>modal.style.display='none';

loadData();
