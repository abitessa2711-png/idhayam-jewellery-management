import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkGrandSummary() {
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

  let totalPcs = 0
  let totalWt = 0

  const catGrouped = {}

  entries.forEach(e => {
    const qty = parseInt(e.quantity || 1)
    const wt = parseFloat(e.weight || 0) * qty
    const cat = e.categories?.name || 'மற்றவை'

    if (qty > 0 && wt > 0) {
      totalPcs += qty
      totalWt += wt

      if (!catGrouped[cat]) catGrouped[cat] = { pcs: 0, wt: 0 }
      catGrouped[cat].pcs += qty
      catGrouped[cat].wt += wt
    }
  })

  console.log("=== NEW LIVE STOCK CATEGORY TOTALS ===")
  Object.keys(catGrouped).forEach(cat => {
    console.log(`${cat}: ${catGrouped[cat].pcs} Pcs | ${catGrouped[cat].wt.toFixed(3)}g`)
  })

  console.log(`\nUPDATED GRAND TOTAL: ${totalPcs} Pcs | ${totalWt.toFixed(3)}g (~${(totalWt/1000).toFixed(2)} kg)`)
}

checkGrandSummary()
