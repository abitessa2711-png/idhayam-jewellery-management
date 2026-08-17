import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDiff() {
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

  console.log("Total database rows in stock_entries:", entries.length)

  // 1. Filter: weight > 0 && quantity > 0
  const validPositive = entries.filter(p => (parseFloat(p.weight) || 0) > 0 && (parseInt(p.quantity) || 0) > 0)

  // 2. Sum for validPositive
  const pcsPositive = validPositive.reduce((s, p) => s + (parseInt(p.quantity) || 0), 0)
  const wtPositive = validPositive.reduce((s, p) => s + ((parseInt(p.quantity) || 0) * (parseFloat(p.weight) || 0)), 0)

  console.log(`Filter (weight > 0 && quantity > 0): ${validPositive.length} rows | ${pcsPositive} Pcs | ${wtPositive.toFixed(3)}g`)

  // 3. Check if any entries have weight <= 0 or quantity <= 0
  const invalidRows = entries.filter(p => (parseFloat(p.weight) || 0) <= 0 || (parseInt(p.quantity) || 0) <= 0)
  console.log(`Rows with 0 qty or 0 weight: ${invalidRows.length} rows`)

  // 4. Check if there are any specific categories with discrepancies
  const catSummary = {}
  validPositive.forEach(e => {
    const cat = e.categories?.name || 'Uncategorized'
    if (!catSummary[cat]) catSummary[cat] = { rows: 0, pcs: 0, wt: 0 }
    const q = parseInt(e.quantity) || 0
    const w = (parseFloat(e.weight) || 0) * q
    catSummary[cat].rows++
    catSummary[cat].pcs += q
    catSummary[cat].wt += w
  })

  console.log("\n=== CATEGORY BREAKDOWN IN SUPABASE ===")
  Object.keys(catSummary).forEach(cat => {
    console.log(`${cat}: ${catSummary[cat].rows} Rows | ${catSummary[cat].pcs} Pcs | ${catSummary[cat].wt.toFixed(3)}g`)
  })
}

checkDiff()
