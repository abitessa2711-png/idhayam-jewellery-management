import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testActualDelete() {
  console.log("Testing DELETE on sales table for id = 1...")
  const { data, error } = await supabase
    .from('sales')
    .delete()
    .eq('id', 1)
    .select()

  if (error) {
    console.error("DELETE ERROR:", error)
  } else {
    console.log("DELETE SUCCESS! Deleted rows:", data)
  }
}

testActualDelete()
