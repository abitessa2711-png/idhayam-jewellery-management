import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testRpc() {
  console.log("Testing RPC functions...")
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' })
  console.log("RPC exec_sql result:", data, error)
}

testRpc()
