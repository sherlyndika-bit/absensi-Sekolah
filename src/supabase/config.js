// Supabase Client Config
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://gfkkpbbyldggvmqaxqon.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdma2twYmJ5bGRnZ3ZtcWF4cW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2MTc3NDEsImV4cCI6MjEwMTE5Mzc0MX0.aE5mVopV_aWM99dgKtpzn4Ji-V-hliCDazHq7QJH4kA";

// Initializing Supabase JS Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
