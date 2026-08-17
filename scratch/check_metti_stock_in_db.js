import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkMettiDb() {
  const { data: cat } = await supabase.from('categories').select('*').eq('name', 'மெட்டி').single()
  const { data: entries } = await supabase
    .from('stock_entries')
    .select(`
      id, weight, quantity,
      variants (name)
    `)
    .eq('category_id', cat.id)

  const variantCount = {}
  entries.forEach(e => {
    const vName = e.variants?.name || 'Unknown'
    if (!variantCount[vName]) variantCount[vName] = { pcs: 0, wt: 0 }
    variantCount[vName].pcs += (parseInt(e.quantity) || 1)
    variantCount[vName].wt += parseFloat(e.weight || 0)
  })

  console.log("=== METTI VARIANTS CURRENTLY IN SUPABASE DATABASE ===")
  Object.keys(variantCount).forEach(v => {
    console.log(`${v}: ${variantCount[v].pcs} Pcs | ${variantCount[v].wt.toFixed(3)}g`)
  })
}

checkMettiDb()
