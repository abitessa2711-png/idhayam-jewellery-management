import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testRls() {
  console.log("Checking sales rows before delete:")
  const { data: before } = await supabase.from('sales').select('*')
  console.log(before)

  if (before && before.length > 0) {
    const targetId = before[0].id
    console.log(`Attempting to delete sale with id ${targetId}...`)
    const { data, error } = await supabase.from('sales').delete().eq('id', targetId).select()
    console.log("Result error:", error)
    console.log("Result data:", data)
  }
}

testRls()
