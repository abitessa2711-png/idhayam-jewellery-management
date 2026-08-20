import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function findKolusu1366() {
  const { data: cat } = await supabase.from('categories').select('*').eq('name', 'கொலுசு').single()

  const { data: entries } = await supabase
    .from('stock_entries')
    .select('*, variants(name)')
    .eq('category_id', cat.id)

  console.log("Total Kolusu entries in DB:", entries.length)

  // Check if any Kolusu entry has weight around 13.66g or deleted/updated recently
  const items1366 = entries.filter(e => Math.abs(parseFloat(e.weight) - 13.66) < 0.5)
  console.log("Kolusu items around 13.66g:", items1366)

  // Sum total Kolusu weight
  let totalWt = 0
  entries.forEach(e => { totalWt += (parseFloat(e.weight) || 0) * (parseInt(e.quantity) || 1) })
  console.log("Exact Kolusu weight in DB:", totalWt.toFixed(3))
}

findKolusu1366()
