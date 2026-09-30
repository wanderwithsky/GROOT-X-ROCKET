const fs = require('fs');
const path = require('path');

const files = {
  'src/contexts/AuthContext.tsx': `import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ session: null, user: null, profile: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data);
    setLoading(false);
  };

  return <AuthContext.Provider value={{ session, user, profile, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
`,
  'src/hooks/useRealtimeActivities.ts': `import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useRealtimeActivities = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const { data } = await supabase.from('activities').select('*, profiles(*)').order('created_at', { ascending: false }).limit(30);
      if (data) setActivities(data);
    };

    fetchActivities();

    const sub = supabase.channel('activities_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, () => {
        fetchActivities();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  return { activities };
};
`,
  'src/hooks/useRealtimeChat.ts': `import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useRealtimeChat = () => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*, profiles(*)').order('created_at', { ascending: true }).limit(50);
      if (data) setMessages(data);
    };

    fetchMessages();

    const sub = supabase.channel('messages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  return { messages };
};
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content, 'utf8');
  console.log('Created:', filepath);
}
