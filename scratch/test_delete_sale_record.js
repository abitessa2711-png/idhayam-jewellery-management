import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDelete() {
  const { data: sales, error } = await supabase.from('sales').select('*')
  console.log("Current sales rows in Supabase:", sales)
}

testDelete()
