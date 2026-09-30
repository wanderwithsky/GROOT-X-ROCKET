import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fxtqfthoewjdvxtpcweo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1B0kIsHkydA66YdsbdSZog_YgxCq9eZ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error fetching buckets:', error);
  } else {
    console.log('Buckets:', data);
  }
}

checkBuckets();
