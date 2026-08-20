import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testUpdateSales() {
  console.log("=== TESTING UPDATE ON SALES TABLE ===")
  const { data, error } = await supabase
    .from('sales')
    .update({ customer_name: 'DELETED' })
    .eq('id', 1)
    .select()

  console.log("Update result:", data, error)
}

testUpdateSales()
