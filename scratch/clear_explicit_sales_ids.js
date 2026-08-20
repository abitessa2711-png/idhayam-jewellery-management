import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function clearExplicitSales() {
  console.log("=== DELETING SALES IDS 1, 2, 3, 4 FROM SUPABASE SALES TABLE ===")

  for (const id of [1, 2, 3, 4]) {
    const { data, error } = await supabase.from('sales').delete().eq('id', id).select()
    console.log(`Delete sale ID ${id}:`, data, error)
  }

  const { data: remaining } = await supabase.from('sales').select('*')
  console.log("Remaining sales in DB:", remaining?.length)
}

clearExplicitSales()
