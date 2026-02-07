import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://gdjgxezhibexyjraeudz.supabase.co'
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'sb_publishable_delZJu2iheVAeUrf0byzjg_8Hg251h0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
