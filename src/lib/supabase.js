import { createClient } from '@supabase/supabase-js'

// Use environment variables with fallback for local development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tonoebhxwstswtzgooxj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbm9lYmh4d3N0c3d0emdvb3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDAyNjUsImV4cCI6MjA5NDYxNjI2NX0.V1A_DVbq_-aGiEFXehVY-jS4KygtbDZ8hV4X_eBn64E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
