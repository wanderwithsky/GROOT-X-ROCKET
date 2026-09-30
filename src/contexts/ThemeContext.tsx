import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type ThemeName = 'midnight' | 'forest' | 'cosmic' | 'sunset' | 'ocean' | 'aurora' | 'rose' | 'graphite' | 'neon' | 'cherry';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'midnight', setTheme: async () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();
  const [theme, setThemeState] = useState<ThemeName>('midnight');

  useEffect(() => {
    if (profile?.theme_preference) {
      setThemeState(profile.theme_preference as ThemeName);
    }
  }, [profile]);

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const setTheme = async (newTheme: ThemeName) => {
    setThemeState(newTheme);
    if (profile) {
      await supabase.from('profiles').update({ theme_preference: newTheme }).eq('id', profile.id);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
