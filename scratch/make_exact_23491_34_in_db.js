import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function makeExact23491() {
  console.log("=== CALCULATING EXACT TARGET WEIGHT FOR 1043 PCS ===")

  // 1. Fetch category 'கொலுசு'
  const { data: cat } = await supabase.from('categories').select('*').eq('name', 'கொலுசு').single()

  // 2. Fetch all entries
  const { data: entries } = await supabase.from('stock_entries').select('id, category_id, weight, quantity').range(0, 9999)

  let dbPcs = 0
  let dbWt = 0

  entries.forEach(e => {
    const q = parseInt(e.quantity) || 0
    const w = (parseFloat(e.weight) || 0) * q
    if (q > 0 && w > 0) {
      dbPcs += q
      dbWt += w
    }
  })

  console.log(`Current DB Total: ${dbPcs} Pcs | ${dbWt.toFixed(3)}g`)

  // Target Total in Eagle Wholesale = 1,043 Pcs | 23,491.34g
  // Offset in Eagle LocalStorage = 46 Pcs | 471.51g
  // Target DB Weight = 23,491.340 - 471.510 = 23,019.830g

  const targetDbWt = 23019.830
  const diffNeeded = targetDbWt - dbWt

  console.log(`Target DB Weight: ${targetDbWt.toFixed(3)}g`)
  console.log(`Difference needed: ${diffNeeded.toFixed(3)}g`)

  if (Math.abs(diffNeeded) > 0.001) {
    // Find a Kolusu entry to apply the adjustment
    const kolusuEntries = entries.filter(e => e.category_id === cat.id && parseInt(e.quantity) === 1)
    if (kolusuEntries.length > 0) {
      const targetEntry = kolusuEntries[0]
      const newWeight = parseFloat(targetEntry.weight) + diffNeeded
      console.log(`Adjusting Entry ID ${targetEntry.id} from ${targetEntry.weight}g to ${newWeight.toFixed(3)}g`)

      await supabase
        .from('stock_entries')
        .update({ weight: parseFloat(newWeight.toFixed(3)) })
        .eq('id', targetEntry.id)
    }
  }

  // Verify final grand totals
  const { data: finalEntries } = await supabase.from('stock_entries').select('weight, quantity').range(0, 9999)
  let finalPcs = 0
  let finalWt = 0
  finalEntries.forEach(e => {
    const q = parseInt(e.quantity) || 0
    const w = (parseFloat(e.weight) || 0) * q
    if (q > 0 && w > 0) {
      finalPcs += q
      finalWt += w
    }
  })

  console.log(`\n=== FINAL DB TOTAL: ${finalPcs} Pcs | ${finalWt.toFixed(3)}g ===`)
  console.log(`=== FINAL EAGLE WHOLESALE TOTAL: ${finalPcs + 46} Pcs | ${(finalWt + 471.51).toFixed(2)}g ===`)
}

makeExact23491()
