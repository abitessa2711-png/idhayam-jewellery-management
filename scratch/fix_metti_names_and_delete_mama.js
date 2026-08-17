import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixMetti() {
  console.log("=== FIXING METTI: DELETING மாமா மெட்டி AND RENAMING சித்து மெட்டி ➔ சுத்து மெட்டி ===")

  // 1. Fetch Category 'மெட்டி' & Subcategory 'வகைகள்'
  const { data: cat } = await supabase.from('categories').select('*').eq('name', 'மெட்டி').single()
  const { data: sub } = await supabase.from('subcategories').select('*').eq('category_id', cat.id).eq('name', 'வகைகள்').single()

  console.log("Category ID:", cat.id, "Subcategory ID:", sub.id)

  // 2. Fetch variants
  const { data: varMama } = await supabase.from('variants').select('*').eq('category_id', cat.id).eq('subcategory_id', sub.id).eq('name', 'மாமா மெட்டி').maybeSingle()
  const { data: varSittu } = await supabase.from('variants').select('*').eq('category_id', cat.id).eq('subcategory_id', sub.id).eq('name', 'சித்து மெட்டி').maybeSingle()

  // --- A. Delete மாமா மெட்டி ---
  if (varMama) {
    console.log("Deleting stock_entries for 'மாமா மெட்டி'...")
    const { data: delStock, error: delErr } = await supabase.from('stock_entries').delete().eq('variant_id', varMama.id).select()
    console.log(`Deleted ${delStock?.length || 0} stock entries for மாமா மெட்டி. Error:`, delErr)

    console.log("Deleting variant 'மாமா மெட்டி' from variants table...")
    await supabase.from('variants').delete().eq('id', varMama.id)
  }

  // --- B. Rename/Create சுத்து மெட்டி ---
  let { data: varSuthu } = await supabase.from('variants').select('*').eq('category_id', cat.id).eq('subcategory_id', sub.id).eq('name', 'சுத்து மெட்டி').maybeSingle()

  if (!varSuthu) {
    if (varSittu) {
      console.log("Renaming variant 'சித்து மெட்டி' to 'சுத்து மெட்டி'...")
      const { data: updatedVar } = await supabase.from('variants').update({ name: 'சுத்து மெட்டி' }).eq('id', varSittu.id).select().single()
      varSuthu = updatedVar
    } else {
      console.log("Creating variant 'சுத்து மெட்டி'...")
      const { data: newVar } = await supabase.from('variants').insert({ category_id: cat.id, subcategory_id: sub.id, name: 'சுத்து மெட்டி' }).select().single()
      varSuthu = newVar
    }
  }

  if (varSittu && varSuthu && varSittu.id !== varSuthu.id) {
    console.log("Updating stock_entries from 'சித்து மெட்டி' variant ID to 'சுத்து மெட்டி' variant ID...")
    await supabase.from('stock_entries').update({ variant_id: varSuthu.id }).eq('variant_id', varSittu.id)
    await supabase.from('variants').delete().eq('id', varSittu.id)
  }

  console.log("=== METTI FIX COMPLETE! ===")

  // Verify final totals
  const { data: finalEntries } = await supabase.from('stock_entries').select('quantity, weight')
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

  console.log(`UPDATED LIVE STOCK GRAND TOTAL: ${finalPcs} Pcs | ${finalWt.toFixed(3)}g (~${(finalWt/1000).toFixed(2)} kg)`)
}

fixMetti()
