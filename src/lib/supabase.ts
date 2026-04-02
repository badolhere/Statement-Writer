import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rgqqkkcvgwuyvdppzvvl.supabase.co/';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncXFra2N2Z3d1eXZkcHB6dnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5Nzk5MjAsImV4cCI6MjA5MDU1NTkyMH0.-8dS2FNeJL18s70iE4YOX--tYSCWYl8bWLSTGBVSlo0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
