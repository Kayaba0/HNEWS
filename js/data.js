
// This will be hydrated from localStorage if admin edits
window.animeData = JSON.parse(localStorage.getItem('animeData')) || [
 {
  id:'1',
  title:'Neon Dreams: Tokyo 2087',
  desc:'In un futuro distopico...',
  date:'2025-01-15',
  studio:'Sunrise Studios',
  episodes:24,
  status:'In Arrivo',
  genres:['Sci-Fi','Action'],
  cover:'https://images.unsplash.com/photo-1521540216272-a50305cd4421',
  gallery:['https://images.unsplash.com/photo-1521459467264-8029d1c1a3f1','https://images.unsplash.com/photo-1484452330304-377cdeb05340']
 }
];
