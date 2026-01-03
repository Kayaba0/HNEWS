import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import { Calendar, Tag } from 'lucide-react';
import { Anime, useStore } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

interface AnimeCardProps {
  anime: Anime;
  onClick: () => void;
}

export function AnimeCard({ anime, onClick }: AnimeCardProps) {
  const { language } = useStore();
  
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-card border border-white/5 shadow-lg">
        <img 
          src={anime.coverImage} 
          alt={anime.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Badge variant="outline" className="mb-2 border-primary/50 text-primary bg-primary/10 backdrop-blur-md rounded-lg">
            {anime.studio}
          </Badge>
          
          <h3 className="font-display text-xl font-bold leading-tight text-white mb-1 line-clamp-2">
            {anime.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="size-3.5" />
            <span>
              {format(new Date(anime.releaseDate), 'd MMMM yyyy', { 
                locale: language === 'it' ? it : enUS 
              })}
            </span>
          </div>
        </div>

        {/* Floating Release Day Badge (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col items-center justify-center rounded-xl bg-background/40 backdrop-blur-md border border-white/10 p-2 min-w-[50px]">
          <span className="text-xs font-medium uppercase text-muted-foreground">
             {format(new Date(anime.releaseDate), 'MMM', { locale: language === 'it' ? it : enUS })}
          </span>
          <span className="text-xl font-bold text-secondary">
             {format(new Date(anime.releaseDate), 'dd')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
