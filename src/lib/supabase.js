import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tonoebhxwstswtzgooxj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbm9lYmh4d3N0c3d0emdvb3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDAyNjUsImV4cCI6MjA5NDYxNjI2NX0.V1A_DVbq_-aGiEFXehVY-jS4KygtbDZ8hV4X_eBn64E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
