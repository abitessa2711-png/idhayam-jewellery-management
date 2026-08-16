import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testUpdate() {
  console.log("Testing UPDATE on sales table for id = 1...")
  const { data, error } = await supabase
    .from('sales')
    .update({ quantity: 0, weight: 0, amount: 0 })
    .eq('id', 1)
    .select()

  if (error) {
    console.error("UPDATE ERROR:", error)
  } else {
    console.log("UPDATE SUCCESS! Updated rows:", data)
  }
}

testUpdate()
