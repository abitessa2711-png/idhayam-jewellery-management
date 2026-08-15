import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 6 // வெள்ளி செயின்
const SUBCATEGORY_ID = 13 // வகைகள்

// Group 1: லேடீஸ் செயின் (29 Pcs: 1 - 29)
export const ladiesChainWeights = [
  11.180, 11.150, 10.020, 7.430, 11.640, 6.640, 9.140, 6.880, 7.380, 9.180,
  11.250, 11.830, 6.930, 7.200, 15.430, 8.340, 11.580, 11.580, 7.560, 3.930,
  16.830, 7.310, 11.220, 9.170, 20.580, 12.350, 7.720, 18.240, 7.480
]

// Group 2: லேடீஸ் செயின் 92.5 (9 Pcs: 30 - 38)
export const ladiesChain925Weights = [
  4.390, 3.900, 3.470, 3.530, 2.830, 2.800, 3.400, 5.220, 3.030
]

async function ensureVariant(name) {
  let { data } = await supabase
    .from('variants')
    .select('*')
    .eq('category_id', CATEGORY_ID)
    .eq('subcategory_id', SUBCATEGORY_ID)
    .eq('name', name)
    .maybeSingle()

  if (!data) {
    const { data: newV, error } = await supabase
      .from('variants')
      .insert({ category_id: CATEGORY_ID, subcategory_id: SUBCATEGORY_ID, name })
      .select()
      .single()
    if (error) throw error
    data = newV
  }
  return data
}

export async function insertChains() {
  console.log("Checking / creating variants...")
  const varLadies = await ensureVariant('லேடீஸ் செயின்')
  const varLadies925 = await ensureVariant('லேடீஸ் செயின் 92.5')
  await ensureVariant('ஜென்ஸ் செயின் 92.5') // Also ensure ஜென்ஸ் செயின் 92.5 exists in DB

  console.log("Ladies Chain Var ID:", varLadies.id)
  console.log("Ladies Chain 92.5 Var ID:", varLadies925.id)

  const rows1 = ladiesChainWeights.map((wt, i) => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: varLadies.id,
    weight: wt,
    quantity: 1,
    detail: `Ladies Chain #${i + 1}`
  }))

  const rows2 = ladiesChain925Weights.map((wt, i) => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: varLadies925.id,
    weight: wt,
    quantity: 1,
    detail: `Ladies Chain 92.5 #${i + 30}`
  }))

  const allRows = [...rows1, ...rows2]
  const { data, error } = await supabase.from('stock_entries').insert(allRows).select()

  if (error) {
    console.error("Error inserting chain entries:", error)
  } else {
    console.log(`Successfully inserted ${data.length} Silver Chain items!`)
    console.log(`Ladies Chain: 29 pcs (${ladiesChainWeights.reduce((a,b)=>a+b,0).toFixed(3)}g)`)
    console.log(`Ladies Chain 92.5: 9 pcs (${ladiesChain925Weights.reduce((a,b)=>a+b,0).toFixed(3)}g)`)
  }
}

insertChains()
