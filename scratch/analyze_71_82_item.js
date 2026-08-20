import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function analyze7182() {
  console.log("=== CHECKING STOCK_ENTRIES FOR WEIGHT 71.82 OR NEARBY ===")
  const { data: entries } = await supabase
    .from('stock_entries')
    .select('*, categories(name), subcategories(name), variants(name)')
    .range(0, 9999)

  const items7182 = entries.filter(e => Math.abs(parseFloat(e.weight) - 71.82) < 0.01 || Math.abs(parseFloat(e.weight) - 85.48) < 0.01)

  console.log("Items matching 71.82g or 85.48g in stock_entries:")
  console.log(items7182.map(e => ({
    id: e.id,
    cat: e.categories?.name,
    sub: e.subcategories?.name,
    variant: e.variants?.name,
    weight: e.weight,
    quantity: e.quantity,
    detail: e.detail,
    createdAt: e.created_at
  })))

  console.log("\n=== TOTAL LIVE STOCK IN SUPABASE ===")
  let totalPcs = 0
  let totalWt = 0
  entries.forEach(e => {
    const q = parseInt(e.quantity) || 0
    const w = (parseFloat(e.weight) || 0) * q
    if (q > 0 && w > 0) {
      totalPcs += q
      totalWt += w
    }
  })
  console.log(`Current Total in DB: ${totalPcs} Pcs | ${totalWt.toFixed(2)}g`)
}

analyze7182()
