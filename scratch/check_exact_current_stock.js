import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkExactCurrent() {
  const { data: entries } = await supabase.from('stock_entries').select('quantity, weight')
  let totalPcs = 0
  let totalWt = 0

  entries.forEach(e => {
    const q = parseInt(e.quantity || 1)
    const w = parseFloat(e.weight || 0) * q
    if (q > 0 && w > 0) {
      totalPcs += q
      totalWt += w
    }
  })

  console.log(`EXACT CURRENT SUPABASE STOCK: ${totalPcs} Pcs | ${totalWt.toFixed(3)}g (or ${totalWt.toFixed(2)}g)`)
}

checkExactCurrent()
