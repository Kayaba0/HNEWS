import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Anime, useStore } from '@/lib/data';
import { format } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Calendar, Building2, Layers } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface AnimeDetailProps {
  anime: Anime | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AnimeDetail({ anime, isOpen, onClose }: AnimeDetailProps) {
  const { language } = useStore();

  if (!anime) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 gap-0 overflow-hidden border-none bg-background/95 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <div className="grid h-full grid-cols-1 md:grid-cols-[45%_55%]">
          
          {/* Left: Main Image/Gallery Preview */}
          <div className="relative h-48 md:h-full w-full bg-black">
             <img 
               src={anime.coverImage} 
               alt={anime.title} 
               className="h-full w-full object-cover opacity-80"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-background" />
             
             {/* Back button for mobile */}
             <Button 
               size="icon" 
               variant="secondary" 
               className="absolute top-4 left-4 md:hidden rounded-full z-10"
               onClick={onClose}
             >
               <X className="size-4" />
             </Button>
          </div>

          {/* Right: Info */}
          <ScrollArea className="h-full max-h-[calc(90vh)]">
            <div className="p-6 md:p-10 flex flex-col gap-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-3 border-secondary/50 text-secondary bg-secondary/10 px-3 py-1 text-sm rounded-lg">
                    {format(new Date(anime.releaseDate), 'MMMM yyyy', { locale: language === 'it' ? it : enUS })}
                  </Badge>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-2">
                    {anime.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {anime.genre.map(g => (
                      <Badge key={g} variant="secondary" className="rounded-md bg-white/5 hover:bg-white/10 text-muted-foreground border-transparent">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Desktop Close */}
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex rounded-full hover:bg-white/10 -mt-2 -mr-2">
                    <X className="size-6" />
                  </Button>
                </DialogClose>
              </div>

              <div className="grid grid-cols-2 gap-4 my-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="size-3" />
                    {language === 'it' ? 'Studio' : 'Studio'}
                  </span>
                  <span className="font-semibold text-lg">{anime.studio}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="size-3" />
                    {language === 'it' ? 'Data' : 'Date'}
                  </span>
                  <span className="font-semibold text-lg">
                    {format(new Date(anime.releaseDate), 'dd MMM yyyy')}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                   <Layers className="size-5 text-primary" />
                   {language === 'it' ? 'Sinossi' : 'Synopsis'}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {anime.description}
                </p>
              </div>

              {/* Gallery Grid */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {anime.gallery.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group bg-black/50 border border-white/10">
                      <img 
                        src={img} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
