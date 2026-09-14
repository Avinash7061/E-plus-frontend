import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ejhkzzwhbgxjlaqosocz.supabase.co';
const supabaseKey = 'sb_publishable_h0W40bUsDY-vVBbsc4hm9w_EKO1coCX';

export const supabase = createClient(supabaseUrl, supabaseKey);
