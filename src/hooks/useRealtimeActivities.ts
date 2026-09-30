import { useEffect, useState } from 'react';
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
