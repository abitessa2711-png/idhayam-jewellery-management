import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkRpc() {
  console.log("=== CHECKING RPC & TABLES IN SUPABASE ===")
  const { data: cat } = await supabase.from('categories').select('*').limit(1)
  console.log("Categories query works:", cat)

  // Try updating stock_entries to see if update/delete works on stock_entries
  const { data: stockUp, error: stockErr } = await supabase
    .from('stock_entries')
    .update({ quantity: 1 })
    .eq('id', 701)
    .select()

  console.log("stock_entries UPDATE result:", stockUp?.length, stockErr)
}

checkRpc()
