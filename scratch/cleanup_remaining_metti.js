import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function clearAllMetti() {
  const { data: cat } = await supabase.from('categories').select('*').eq('name', 'மெட்டி').single()
  if (cat) {
    const { data: delData, error } = await supabase.from('stock_entries').delete().eq('category_id', cat.id).select()
    console.log(`Deleted ${delData?.length || 0} remaining Metti entries. Error:`, error)
  }

  const { data: entries } = await supabase.from('stock_entries').select('quantity, weight')
  let pcs = 0
  let wt = 0
  entries.forEach(e => {
    const q = parseInt(e.quantity) || 0
    const w = (parseFloat(e.weight) || 0) * q
    if (q > 0 && w > 0) {
      pcs += q
      wt += w
    }
  })

  console.log(`PRE-METTI RESTORED GRAND TOTAL: ${pcs} Pcs | ${wt.toFixed(3)}g (~${(wt/1000).toFixed(2)} kg)`)
}

clearAllMetti()
