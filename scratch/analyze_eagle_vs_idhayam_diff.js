import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function analyzeDiff() {
  const { data: entries } = await supabase
    .from('stock_entries')
    .select(`
      id,
      weight,
      quantity,
      detail,
      categories (name),
      subcategories (name),
      variants (name)
    `)

  console.log("Total entries in Supabase stock_entries:", entries.length)

  // Sum valid items
  let totalPcs = 0
  let totalWt = 0
  const catSummary = {}

  entries.forEach(e => {
    const q = parseInt(e.quantity || 1)
    const w = parseFloat(e.weight || 0) * q
    const cat = e.categories?.name || 'Uncategorized'

    if (q > 0 && w > 0) {
      totalPcs += q
      totalWt += w
      if (!catSummary[cat]) catSummary[cat] = { pcs: 0, wt: 0 }
      catSummary[cat].pcs += q
      catSummary[cat].wt += w
    }
  })

  console.log("=== SUPABASE LIVE STOCK DATABASE SUMMARY ===")
  Object.keys(catSummary).forEach(cat => {
    console.log(`${cat}: ${catSummary[cat].pcs} Pcs | ${catSummary[cat].wt.toFixed(3)}g`)
  })

  console.log(`\nSUPABASE DB TOTAL: ${totalPcs} Pcs | ${totalWt.toFixed(3)}g`)

  console.log("\n--- DIFFERENCE ANALYSIS ---")
  console.log("Eagle shown:   1043 Pcs | 23491.340g")
  console.log("Idhayam shown: 997 Pcs  | 23019.830g")
  console.log("Difference:    46 Pcs   | 471.510g")
}

analyzeDiff()
