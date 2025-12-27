import { createClient } from "@supabase/supabase-js"

const supabaseUrl = 'https://dkthoasgzxiqbdtaobpr.supabase.co'
const apiKey = import.meta.env.VITE_SUPABASE_KEY;

export const apiClient = createClient(supabaseUrl, apiKey);