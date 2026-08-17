import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspectAllStockEntries() {
  const { data: cats } = await supabase.from('categories').select('*').eq('name', 'மெட்டி')
  console.log("Categories matching 'மெட்டி':", cats)

  const { data: subs } = await supabase.from('subcategories').select('*')
  console.log("All subcategories:", subs)

  const { data: vars } = await supabase.from('variants').select('*')
  console.log("All variants:", vars.filter(v => v.name.includes('மெட்டி')))

  const { data: entries, count } = await supabase
    .from('stock_entries')
    .select('*, categories(name), subcategories(name), variants(name)', { count: 'exact' })

  console.log("Total entries in stock_entries table:", count || entries.length)

  const mettiEntries = entries.filter(e => e.categories?.name === 'மெட்டி')
  console.log("Total Metti entries found:", mettiEntries.length)

  const byVariant = {}
  mettiEntries.forEach(e => {
    const vName = e.variants?.name || 'UNKNOWN'
    if (!byVariant[vName]) byVariant[vName] = { pcs: 0, wt: 0, rows: 0 }
    byVariant[vName].pcs += (parseInt(e.quantity) || 1)
    byVariant[vName].wt += parseFloat(e.weight || 0)
    byVariant[vName].rows++
  })

  console.log("=== BREAKDOWN OF METTI IN STOCK_ENTRIES ===")
  console.table(byVariant)
}

inspectAllStockEntries()
