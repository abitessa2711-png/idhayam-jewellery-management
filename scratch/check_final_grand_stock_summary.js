import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkGrandSummary() {
  const { data: entries } = await supabase
    .from('stock_entries')
    .select('*, categories(name)')
    .range(0, 9999)

  const catSummary = {}
  let totalPcs = 0
  let totalWt = 0

  entries.forEach(e => {
    const catName = e.categories?.name || 'Uncategorized'
    const q = parseInt(e.quantity) || 1
    const w = (parseFloat(e.weight) || 0) * q

    if (!catSummary[catName]) catSummary[catName] = { pcs: 0, wt: 0 }
    catSummary[catName].pcs += q
    catSummary[catName].wt += w

    totalPcs += q
    totalWt += w
  })

  console.log("=== NEW LIVE STOCK CATEGORY TOTALS (WITH RANGE 0-9999) ===")
  Object.keys(catSummary).forEach(c => {
    console.log(`${c}: ${catSummary[c].pcs} Pcs | ${catSummary[c].wt.toFixed(3)}g`)
  })

  console.log(`\nUPDATED GRAND TOTAL: ${totalPcs} Pcs | ${totalWt.toFixed(3)}g (~${(totalWt/1000).toFixed(2)} kg)`)
}

checkGrandSummary()
