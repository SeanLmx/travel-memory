import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://twkltkmpevnqoliqlvna.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3a2x0a21wZXZucW9saXFsdm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzMDU1NzcsImV4cCI6MjA0NDg4MTU3N30.RnCaEsKRjZZ72ur0ORMLf-4l536sl0oPKok-KEcuuno'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})