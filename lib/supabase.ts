import { createClient } from '@supabase/supabase-js'

// TheTapestry's Supabase project = the shared Xero Sum Games account pool. The
// anon key is public by design (RLS enforces all access); it already ships in
// TheTapestry's own client bundle. Session persists in localStorage.
const SUPABASE_URL = 'https://jbudzglgtxeoaufpejrv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpidWR6Z2xndHhlb2F1ZnBlanJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MzQ5ODYsImV4cCI6MjA5MDQxMDk4Nn0.FnV74UFOF2LmsWtXEK3l8scSvHA-_u_Evzi7XW9Kln8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
