import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 5 // வெள்ளி பொருட்கள்
const SUBCATEGORY_ID = 12 // காப்பு

// Group 1: வேல் காப்பு (14 Pcs)
export const veelKappuWeights = [
  17.160, 15.140, 10.960, 15.990, 16.350, 18.960, 11.890,
  15.240, 14.540, 14.940, 12.360, 20.120, 16.900, 14.470
]

// Group 2: வெள்ளி காப்பு (29 Pcs)
export const velliKappuWeights = [
  23.380, 27.120, 23.580, 26.580, 22.000, 18.570, 24.330, 24.820, 17.870, 22.380,
  24.600, 25.490, 26.450, 26.180, 20.340, 21.340, 25.640, 26.900, 24.900, 24.890,
  24.190, 22.890, 22.140, 25.130, 24.480, 23.570, 24.700, 23.800, 26.600
]

export async function insertKappuItems() {
  console.log("Checking / creating variant 'வேல் காப்பு'...")
  let { data: veelVar } = await supabase
    .from('variants')
    .select('*')
    .eq('category_id', CATEGORY_ID)
    .eq('subcategory_id', SUBCATEGORY_ID)
    .eq('name', 'வேல் காப்பு')
    .maybeSingle()

  if (!veelVar) {
    const { data: newVar, error: varErr } = await supabase
      .from('variants')
      .insert({ category_id: CATEGORY_ID, subcategory_id: SUBCATEGORY_ID, name: 'வேல் காப்பு' })
      .select()
      .single()
    if (varErr) throw varErr
    veelVar = newVar
  }

  const { data: velliVar } = await supabase
    .from('variants')
    .select('*')
    .eq('category_id', CATEGORY_ID)
    .eq('subcategory_id', SUBCATEGORY_ID)
    .eq('name', 'வெள்ளி காப்பு')
    .single()

  console.log("Veel Kaappu Variant ID:", veelVar.id)
  console.log("Velli Kaappu Variant ID:", velliVar.id)

  // Rows for வேல் காப்பு
  const veelRows = veelKappuWeights.map((wt, i) => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: veelVar.id,
    weight: wt,
    quantity: 1,
    detail: `Veel Kaappu #${i + 1}`
  }))

  // Rows for வெள்ளி காப்பு
  const velliRows = velliKappuWeights.map((wt, i) => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: velliVar.id,
    weight: wt,
    quantity: 1,
    detail: `Velli Kaappu #${i + 1}`
  }))

  const allRows = [...veelRows, ...velliRows]
  const { data, error } = await supabase.from('stock_entries').insert(allRows).select()

  if (error) {
    console.error("Error inserting Kaappu items:", error)
  } else {
    console.log(`Successfully inserted ${data.length} Kaappu items!`)
    console.log(`Veel Kaappu: 14 pcs (${veelKappuWeights.reduce((a,b)=>a+b,0).toFixed(3)}g)`)
    console.log(`Velli Kaappu: 29 pcs (${velliKappuWeights.reduce((a,b)=>a+b,0).toFixed(3)}g)`)
  }
}

insertKappuItems()
