import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fix701Qty() {
  console.log("=== FIXING ITEM ID 701 QUANTITY FROM 2 TO 1 ===")
  const { data, error } = await supabase
    .from('stock_entries')
    .update({ quantity: 1 })
    .eq('id', 701)
    .select()

  if (error) {
    console.error("Error updating ID 701:", error)
  } else {
    console.log("Successfully updated ID 701:", data)
  }
}

fix701Qty()
