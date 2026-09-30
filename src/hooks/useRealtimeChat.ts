import { useEffect, useState } from 'react';
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
