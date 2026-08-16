import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testOtherDeletes() {
  console.log("Testing insert/delete on stock_entries:")
  const { data: stRow } = await supabase.from('stock_entries').insert({
    category_id: 1,
    weight: 0.001,
    quantity: 1
  }).select().single()

  if (stRow) {
    const { data: stDel } = await supabase.from('stock_entries').delete().eq('id', stRow.id).select()
    console.log("stock_entries delete result:", stDel)
  }

  console.log("Testing insert/delete on purchases:")
  const { data: purRow } = await supabase.from('purchases').insert({
    category: 'TEST',
    variant: 'TEST',
    weight: 1,
    amount: 1
  }).select().single()

  if (purRow) {
    const { data: purDel } = await supabase.from('purchases').delete().eq('id', purRow.id).select()
    console.log("purchases delete result:", purDel)
  }
}

testOtherDeletes()
