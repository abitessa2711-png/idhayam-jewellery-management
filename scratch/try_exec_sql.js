import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function tryExecSql() {
  console.log("=== TESTING RLS POLICY DISABLE ON SALES ===")
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'ALTER TABLE sales DISABLE ROW LEVEL SECURITY;' })
  console.log("RPC exec_sql result:", data, error)
}

tryExecSql()
