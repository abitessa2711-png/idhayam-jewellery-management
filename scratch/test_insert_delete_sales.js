import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testInsertDelete() {
  console.log("1. Inserting dummy sale row...")
  const { data: newRow, error: inErr } = await supabase.from('sales').insert({
    customer_name: 'TEST_DELETE_USER',
    category: 'கொலுசு',
    variant: 'TEST',
    weight: 1,
    quantity: 1,
    amount: 100,
    bill_id: 'IDH-TEST-999'
  }).select().single()

  console.log("Insert result:", newRow, inErr)

  if (newRow) {
    console.log("2. Attempting delete on dummy row id:", newRow.id)
    const { data: delData, error: delErr } = await supabase
      .from('sales')
      .delete()
      .eq('id', newRow.id)
      .select()

    console.log("Delete result:", delData, delErr)
  }
}

testInsertDelete()
