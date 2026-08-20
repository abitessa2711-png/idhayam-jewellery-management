import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function clearTestSales() {
  console.log("=== DELETING ALL TEST/DEMO SALES FROM SUPABASE SALES TABLE ===")
  const { data, error } = await supabase.from('sales').delete().gt('id', 0).select()

  if (error) {
    console.error("Error clearing sales table:", error)
  } else {
    console.log(`SUCCESS! Permanently deleted ${data?.length || 0} sales rows from Supabase sales table!`)
  }
}

clearTestSales()
