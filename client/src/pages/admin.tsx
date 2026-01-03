import { useState, useRef } from 'react';
import { useStore, Anime } from '@/lib/data';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Save, Trash2, LogIn } from 'lucide-react';

const animeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  studio: z.string().min(1, "Studio is required"),
  releaseDate: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  genreString: z.string().min(1, "Add at least one genre separated by comma"),
});

export default function Admin() {
  const { isAdmin, login, logout, animes, addAnime, updateAnime, deleteAnime, language } = useStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof animeSchema>>({
    resolver: zodResolver(animeSchema),
    defaultValues: {
      title: '',
      studio: '',
      releaseDate: '',
      description: '',
      genreString: '',
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      login();
      toast({ title: "Welcome back, Admin" });
    } else {
      toast({ title: "Invalid credentials", variant: "destructive" });
    }
  };

  const onSubmit = (data: z.infer<typeof animeSchema>) => {
    if (!coverPreview) {
      toast({ title: "Cover image is required", variant: "destructive" });
      return;
    }

    const animeData: Anime = {
      id: editingId || crypto.randomUUID(),
      title: data.title,
      studio: data.studio,
      releaseDate: data.releaseDate,
      description: data.description || '',
      genre: data.genreString.split(',').map(s => s.trim()).filter(Boolean),
      coverImage: coverPreview,
      gallery: [coverPreview], // Simplified for now
    };

    if (editingId) {
      updateAnime(editingId, animeData);
      toast({ title: "Anime updated successfully" });
      setEditingId(null);
    } else {
      addAnime(animeData);
      toast({ title: "Anime added successfully" });
    }
    
    // Reset
    form.reset();
    setCoverPreview(null);
  };

  const startEdit = (anime: Anime) => {
    setEditingId(anime.id);
    form.reset({
      title: anime.title,
      studio: anime.studio,
      releaseDate: anime.releaseDate,
      description: anime.description,
      genreString: anime.genre.join(', '),
    });
    setCoverPreview(anime.coverImage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md bg-background/50 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
            <CardDescription className="text-center">Enter credentials to manage content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                placeholder="Username" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                className="bg-black/20 border-white/10"
              />
              <Input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="bg-black/20 border-white/10"
              />
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                <LogIn className="mr-2 size-4" /> Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Content Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor Form */}
        <Card className="lg:col-span-1 h-fit bg-background/50 backdrop-blur-xl border-white/10 sticky top-24">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Anime' : 'Add New Anime'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Image Upload Area */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative aspect-[3/4] w-full rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center bg-black/20 overflow-hidden group ${
                    isDragging ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-primary/50'
                  }`}
                >
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <Button type="button" variant="destructive" size="sm" onClick={() => setCoverPreview(null)}>Remove</Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Upload className={`mx-auto size-8 mb-2 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="text-xs text-muted-foreground">Drag & drop or click to upload cover</p>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black/20 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="studio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Studio</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-black/20 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="bg-black/20 border-white/10 block" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                 <FormField
                    control={form.control}
                    name="genreString"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genres (comma separated)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Action, Sci-Fi" className="bg-black/20 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="bg-black/20 border-white/10 min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-2">
                   <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                     <Save className="mr-2 size-4" /> {editingId ? 'Update' : 'Create'}
                   </Button>
                   {editingId && (
                     <Button type="button" variant="outline" onClick={() => { setEditingId(null); form.reset(); setCoverPreview(null); }}>
                       Cancel
                     </Button>
                   )}
                </div>

              </form>
            </Form>
          </CardContent>
        </Card>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
           <h2 className="text-xl font-bold">Existing Entries</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {animes.map(anime => (
               <div key={anime.id} className="flex gap-4 p-3 rounded-xl bg-card/40 border border-white/5 hover:border-primary/30 transition-all group">
                 <img src={anime.coverImage} className="w-20 h-28 object-cover rounded-lg" />
                 <div className="flex-1 min-w-0">
                   <h3 className="font-bold truncate">{anime.title}</h3>
                   <p className="text-sm text-muted-foreground">{anime.studio}</p>
                   <p className="text-xs text-muted-foreground mt-1">{anime.releaseDate}</p>
                   
                   <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button size="sm" variant="secondary" onClick={() => startEdit(anime)}>Edit</Button>
                     <Button size="sm" variant="destructive" onClick={() => deleteAnime(anime.id)}>
                       <Trash2 className="size-4" />
                     </Button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
