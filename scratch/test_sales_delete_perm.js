import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSalesDelete() {
  console.log("=== CHECKING SALES TABLE DELETE PERMISSION ===")
  const { data: sales, error } = await supabase.from('sales').select('*').limit(5)
  console.log("Current sales in DB:", sales?.length, error)

  // Insert a dummy test sale
  const { data: dummy, error: insErr } = await supabase.from('sales').insert({
    bill_id: 'TEST_DELETE_9999',
    customer_name: 'TEST_CUSTOMER',
    mobile: '0000000000',
    category: 'கொலுசு',
    weight: 1.0,
    quantity: 1,
    rate: 100,
    amount: 100,
    date: new Date().toISOString()
  }).select().single()

  if (insErr) {
    console.error("Error inserting test sale:", insErr)
    return
  }

  console.log("Inserted test sale ID:", dummy.id)

  // Now test deleting it
  const { data: delData, error: delErr } = await supabase.from('sales').delete().eq('id', dummy.id).select()

  if (delErr) {
    console.error("CRITICAL ERROR: Supabase failed to delete from sales table:", delErr)
  } else {
    console.log("SUCCESS! Deleted test sale from Supabase sales table:", delData)
  }
}

testSalesDelete()
