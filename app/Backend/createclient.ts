import { createClient } from '@supabase/supabase-js'

export default function createBrowserClient() {
    return createClient('https://qlnsgmrkhfxqjzbriyvj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsbnNnbXJraGZ4cWp6YnJpeXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTgzNjQsImV4cCI6MjA3NjE5NDM2NH0.P5k2shZgJ5NHv0vXmRlB6B8BnbsW9sRZJS92_knCy1s')

}