import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

import heroBg from '@assets/generated_images/abstract_anime_style_background_dark_gradients_orange_purple.png';
import coverAction from '@assets/generated_images/anime_cover_art_action_shonen_style.png';
import coverScifi from '@assets/generated_images/anime_cover_art_sci-fi_cyberpunk_style.png';
import coverSlice from '@assets/generated_images/anime_cover_art_slice_of_life_school_style.png';

export interface Anime {
  id: string;
  title: string;
  releaseDate: string; // ISO date string
  studio: string;
  genre: string[];
  description: string;
  coverImage: string;
  gallery: string[];
}

interface AppState {
  animes: Anime[];
  isAdmin: boolean;
  language: 'it' | 'en';
  theme: 'dark' | 'light';
  login: () => void;
  logout: () => void;
  setLanguage: (lang: 'it' | 'en') => void;
  addAnime: (anime: Anime) => void;
  updateAnime: (id: string, anime: Partial<Anime>) => void;
  deleteAnime: (id: string) => void;
}

const INITIAL_ANIMES: Anime[] = [
  {
    id: '1',
    title: 'Cyber Chronicles: Neon Dawn',
    releaseDate: '2026-03-15',
    studio: 'Future Works',
    genre: ['Sci-Fi', 'Cyberpunk', 'Action'],
    description: 'In a world where humanity has merged with machines, one detective seeks the truth behind the phantom code.',
    coverImage: coverScifi,
    gallery: [heroBg, coverScifi],
  },
  {
    id: '2',
    title: 'Sakura High: Eternal Spring',
    releaseDate: '2026-04-02',
    studio: 'Kyoto Hearts',
    genre: ['Slice of Life', 'Romance', 'School'],
    description: 'A heartwarming story of friendship and first love beneath the falling cherry blossoms.',
    coverImage: coverSlice,
    gallery: [heroBg, coverSlice],
  },
  {
    id: '3',
    title: 'Blade of the Void',
    releaseDate: '2026-03-20',
    studio: 'Mappa Arts',
    genre: ['Action', 'Fantasy', 'Shonen'],
    description: 'The void is expanding. Only the wielder of the Starlight Blade can seal the rift before it consumes the world.',
    coverImage: coverAction,
    gallery: [heroBg, coverAction],
  },
  {
    id: '4',
    title: 'Project: Override',
    releaseDate: '2026-05-10',
    studio: 'Future Works',
    genre: ['Sci-Fi', 'Mecha'],
    description: 'Giant robots clash in an interstellar war that will decide the fate of the galaxy.',
    coverImage: coverScifi,
    gallery: [heroBg, coverScifi],
  },
   {
    id: '5',
    title: 'Spirit Hunter',
    releaseDate: '2026-04-18',
    studio: 'Spectral Animation',
    genre: ['Supernatural', 'Mystery'],
    description: 'Hunting spirits is a dangerous job, but someone has to keep the balance between worlds.',
    coverImage: coverAction,
    gallery: [heroBg, coverAction],
  },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      animes: INITIAL_ANIMES,
      isAdmin: false,
      language: 'it',
      theme: 'dark',
      login: () => set({ isAdmin: true }),
      logout: () => set({ isAdmin: false }),
      setLanguage: (lang) => set({ language: lang }),
      addAnime: (anime) => set((state) => ({ animes: [...state.animes, anime] })),
      updateAnime: (id, updated) =>
        set((state) => ({
          animes: state.animes.map((a) => (a.id === id ? { ...a, ...updated } : a)),
        })),
      deleteAnime: (id) =>
        set((state) => ({ animes: state.animes.filter((a) => a.id !== id) })),
    }),
    {
      name: 'anime-release-store',
    }
  )
);
