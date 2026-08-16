import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDeleteSale() {
  const { data: sales, error } = await supabase.from('sales').select('*').limit(5)
  console.log("Existing sales entries:", sales)

  if (error) {
    console.error("Error fetching sales:", error)
  }
}

testDeleteSale()
