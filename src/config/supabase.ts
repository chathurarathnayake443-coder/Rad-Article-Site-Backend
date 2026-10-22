import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL=process.env.SUPABASE_URL as string
const SUPABASE_SECRET=process.env.SUPABASE_SECRET as string

export const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET)  // creating a client after adding npm supabase command.