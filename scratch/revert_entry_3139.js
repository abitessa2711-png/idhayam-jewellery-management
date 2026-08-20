import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function revertEntry3139() {
  console.log("=== REVERTING ENTRY ID 3139 BACK TO ORIGINAL 71.82g ===")
  const { data, error } = await supabase
    .from('stock_entries')
    .update({ weight: 71.82 })
    .eq('id', 3139)
    .select()

  if (error) {
    console.error("Error reverting ID 3139:", error)
  } else {
    console.log("Successfully reverted ID 3139 to original 71.82g:", data)
  }

  // Verify DB total
  const { data: entries } = await supabase.from('stock_entries').select('weight, quantity').range(0, 9999)
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

  console.log(`Current DB Total after revert: ${totalPcs} Pcs | ${totalWt.toFixed(3)}g`)
}

revertEntry3139()
