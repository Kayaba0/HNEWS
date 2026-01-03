import { useState, useMemo } from 'react';
import { useStore, Anime } from '@/lib/data';
import { format, getMonth, getYear, parseISO } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, FilterX } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AnimeCard } from '@/components/anime-card';
import { AnimeDetail } from '@/components/anime-detail';
import heroBg from '@assets/generated_images/abstract_anime_style_background_dark_gradients_orange_purple.png';

export default function Home() {
  const { animes, language } = useStore();
  
  // States for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedStudio, setSelectedStudio] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  // Detail Modal State
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  // Derived Data: Extract unique options
  const years = useMemo(() => Array.from(new Set(animes.map(a => getYear(parseISO(a.releaseDate)).toString()))).sort(), [animes]);
  const studios = useMemo(() => Array.from(new Set(animes.map(a => a.studio))).sort(), [animes]);
  const genres = useMemo(() => Array.from(new Set(animes.flatMap(a => a.genre))).sort(), [animes]);

  // Filtering Logic
  const filteredAnimes = useMemo(() => {
    return animes.filter(anime => {
      const date = parseISO(anime.releaseDate);
      const matchSearch = anime.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMonth = selectedMonth === 'all' || getMonth(date).toString() === selectedMonth;
      const matchYear = selectedYear === 'all' || getYear(date).toString() === selectedYear;
      const matchStudio = selectedStudio === 'all' || anime.studio === selectedStudio;
      const matchGenre = selectedGenre === 'all' || anime.genre.includes(selectedGenre);

      return matchSearch && matchMonth && matchYear && matchStudio && matchGenre;
    });
  }, [animes, searchTerm, selectedMonth, selectedYear, selectedStudio, selectedGenre]);

  // Group by Month (and Year for correctness, but grouped by month visually)
  const groupedAnimes = useMemo(() => {
    const groups: Record<string, Anime[]> = {};
    filteredAnimes.forEach(anime => {
      const date = parseISO(anime.releaseDate);
      // Create key like "2026-03" to sort properly
      const key = format(date, 'yyyy-MM');
      if (!groups[key]) groups[key] = [];
      groups[key].push(anime);
    });
    // Sort keys
    return Object.keys(groups).sort().map(key => ({
      key,
      date: parseISO(key + '-01'),
      animes: groups[key]
    }));
  }, [filteredAnimes]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedMonth('all');
    setSelectedYear('all');
    setSelectedStudio('all');
    setSelectedGenre('all');
  };

  const months = [
    { val: '0', label: language === 'it' ? 'Gennaio' : 'January' },
    { val: '1', label: language === 'it' ? 'Febbraio' : 'February' },
    { val: '2', label: language === 'it' ? 'Marzo' : 'March' },
    { val: '3', label: language === 'it' ? 'Aprile' : 'April' },
    { val: '4', label: language === 'it' ? 'Maggio' : 'May' },
    { val: '5', label: language === 'it' ? 'Giugno' : 'June' },
    { val: '6', label: language === 'it' ? 'Luglio' : 'July' },
    { val: '7', label: language === 'it' ? 'Agosto' : 'August' },
    { val: '8', label: language === 'it' ? 'Settembre' : 'September' },
    { val: '9', label: language === 'it' ? 'Ottobre' : 'October' },
    { val: '10', label: language === 'it' ? 'Novembre' : 'November' },
    { val: '11', label: language === 'it' ? 'Dicembre' : 'December' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex items-center justify-center mb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90 z-10" />
        
        <div className="relative z-20 text-center space-y-4 max-w-2xl px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold leading-tight"
          >
            {language === 'it' ? 'Prossime Uscite' : 'Upcoming Releases'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            {language === 'it' ? 'Scopri gli anime in arrivo questa stagione.' : 'Discover the anime arriving this season.'}
          </motion.p>

          {/* Search Bar in Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-md mx-auto mt-8"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
            <Input 
              placeholder={language === 'it' ? 'Cerca per titolo...' : 'Search by title...'}
              className="pl-10 h-12 rounded-2xl bg-white/5 border-white/10 backdrop-blur-md focus:bg-white/10 text-lg transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-20 z-40 -mx-4 px-4 py-4 backdrop-blur-xl border-y border-white/5 bg-background/50 mb-8 overflow-x-auto no-scrollbar">
        <div className="container mx-auto flex items-center gap-3 min-w-max">
          
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px] rounded-xl bg-background/50 border-white/10 h-10">
              <SelectValue placeholder={language === 'it' ? 'Mese' : 'Month'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'it' ? 'Tutti i mesi' : 'All Months'}</SelectItem>
              {months.map(m => <SelectItem key={m.val} value={m.val}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px] rounded-xl bg-background/50 border-white/10 h-10">
              <SelectValue placeholder={language === 'it' ? 'Anno' : 'Year'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'it' ? 'Tutti' : 'All Years'}</SelectItem>
              {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedStudio} onValueChange={setSelectedStudio}>
            <SelectTrigger className="w-[160px] rounded-xl bg-background/50 border-white/10 h-10">
              <SelectValue placeholder="Studio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Studios</SelectItem>
              {studios.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

           <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-[140px] rounded-xl bg-background/50 border-white/10 h-10">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>

          <Button 
            variant="ghost" 
            onClick={resetFilters}
            className="rounded-xl px-3 hover:bg-white/5 text-muted-foreground hover:text-foreground"
          >
            <FilterX className="size-4 mr-2" />
            {language === 'it' ? 'Resetta' : 'Reset'}
          </Button>

        </div>
      </div>

      {/* Content Grid */}
      <div className="space-y-12">
        {groupedAnimes.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            {language === 'it' ? 'Nessun risultato trovato.' : 'No results found.'}
          </div>
        ) : (
          groupedAnimes.map((group) => (
            <section key={group.key}>
              <div className="flex items-baseline gap-4 mb-6 border-b border-white/5 pb-4">
                <h2 className="text-3xl font-display font-bold text-gradient">
                  {format(group.date, 'MMMM', { locale: language === 'it' ? it : enUS })}
                </h2>
                <span className="text-xl text-muted-foreground font-light">
                  {format(group.date, 'yyyy')}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {group.animes.map((anime) => (
                  <AnimeCard 
                    key={anime.id} 
                    anime={anime} 
                    onClick={() => setSelectedAnime(anime)} 
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <AnimeDetail 
        anime={selectedAnime} 
        isOpen={!!selectedAnime} 
        onClose={() => setSelectedAnime(null)} 
      />

    </div>
  );
}
