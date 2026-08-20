import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function analyzeWeightDiff() {
  console.log("=== INSPECTING ALL CATEGORY TOTALS IN SUPABASE DATABASE ===")
  const { data: entries } = await supabase
    .from('stock_entries')
    .select('*, categories(name), subcategories(name), variants(name)')
    .range(0, 9999)

  const catSummary = {}
  let grandPcs = 0
  let grandWt = 0

  entries.forEach(e => {
    const cName = e.categories?.name || 'Uncategorized'
    const q = parseInt(e.quantity) || 0
    const w = (parseFloat(e.weight) || 0) * q

    if (!catSummary[cName]) catSummary[cName] = { pcs: 0, wt: 0 }
    catSummary[cName].pcs += q
    catSummary[cName].wt += w

    grandPcs += q
    grandWt += w
  })

  console.log("Category Breakdown in DB:")
  Object.keys(catSummary).forEach(c => {
    console.log(`${c}: ${catSummary[c].pcs} Pcs | ${catSummary[c].wt.toFixed(3)}g`)
  })

  console.log(`\nGrand DB Total: ${grandPcs} Pcs | ${grandWt.toFixed(3)}g`)

  // Check items around 13.66g or items with quantity/weight modifications
  const itemsAround13 = entries.filter(e => Math.abs(parseFloat(e.weight) - 13.66) < 1.0)
  console.log("\nItems around 13.66g:", itemsAround13.map(e => ({
    id: e.id,
    cat: e.categories?.name,
    sub: e.subcategories?.name,
    variant: e.variants?.name,
    weight: e.weight,
    quantity: e.quantity,
    detail: e.detail
  })))
}

analyzeWeightDiff()
