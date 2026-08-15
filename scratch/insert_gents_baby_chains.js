import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 6 // வெள்ளி செயின்
const SUBCATEGORY_ID = 13 // வகைகள்

// Group 1: ஜென்ஸ் செயின் / Boys செயின் (16 Pcs)
export const gentsChainWeights = [
  24.020, 13.100, 14.190, 24.050, 29.780, 11.500, 30.290, 11.410,
  24.950, 17.970, 41.280, 17.750, 39.540, 34.510, 14.220, 24.350
]

// Group 2: பேபி செயின் (9 Pcs)
export const babyChainWeights = [
  16.340, 14.180, 7.670, 11.290, 8.850, 14.250, 10.180, 11.380, 21.810
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

export async function insertGentsAndBabyChains() {
  console.log("Checking / creating variants for Gents and Baby Chain...")
  const varGents = await ensureVariant('ஜென்ஸ் செயின்')
  const varBaby = await ensureVariant('பேபி செயின் சாதா')

  console.log("Gents Chain Var ID:", varGents.id)
  console.log("Baby Chain Var ID:", varBaby.id)

  const gentsRows = gentsChainWeights.map((wt, i) => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: varGents.id,
    weight: wt,
    quantity: 1,
    detail: `Gents Chain #${i + 1}`
  }))

  const babyRows = babyChainWeights.map((wt, i) => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: varBaby.id,
    weight: wt,
    quantity: 1,
    detail: `Baby Chain #${i + 1}`
  }))

  const allRows = [...gentsRows, ...babyRows]
  const { data, error } = await supabase.from('stock_entries').insert(allRows).select()

  if (error) {
    console.error("Error inserting Gents and Baby Chains:", error)
  } else {
    console.log(`Successfully inserted ${data.length} chain entries!`)
    console.log(`Gents Chain: 16 pcs (${gentsChainWeights.reduce((a,b)=>a+b,0).toFixed(3)}g)`)
    console.log(`Baby Chain: 9 pcs (${babyChainWeights.reduce((a,b)=>a+b,0).toFixed(3)}g)`)
  }
}

insertGentsAndBabyChains()
