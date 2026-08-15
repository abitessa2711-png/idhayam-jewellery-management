import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 7 // கைச் செயின்
const SUBCATEGORY_ID = 14 // வகைகள்

export const boysKaiChainWeights = [
  // 1 - 35
  15.610, 10.250, 18.450, 11.680, 15.860, 12.840, 8.650, 16.760, 10.500, 11.720,
  10.770, 20.150, 11.730, 22.050, 23.630, 14.270, 15.250, 31.040, 16.860, 4.340,
  11.210, 15.150, 32.080, 37.020, 21.140, 17.290, 39.890, 40.900, 33.150, 32.680,
  19.600, 39.390, 52.750, 39.770, 17.600,

  // 36 - 56
  16.870, 18.480, 46.810, 18.700, 13.910, 12.700, 18.880, 14.850, 12.890, 12.620,
  16.710, 12.570, 10.580, 14.030, 7.770, 15.070, 4.520, 22.200, 11.980, 15.650, 15.860
]

async function ensureVariant(catId, subId, name) {
  let { data } = await supabase
    .from('variants')
    .select('*')
    .eq('category_id', catId)
    .eq('subcategory_id', subId)
    .eq('name', name)
    .maybeSingle()

  if (!data) {
    const { data: newV, error } = await supabase
      .from('variants')
      .insert({ category_id: catId, subcategory_id: subId, name })
      .select()
      .single()
    if (error) throw error
    data = newV
  }
  return data
}

export async function insertBoysKaiChains() {
  const gentsVar = await ensureVariant(CATEGORY_ID, SUBCATEGORY_ID, 'ஜென்ட்ஸ் கைச் செயின்')

  console.log(`Inserting ${boysKaiChainWeights.length} Boys Kai Chains...`)
  const rows = boysKaiChainWeights.map((wt, i) => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: gentsVar.id,
    weight: wt,
    quantity: 1,
    detail: `Boys Kai Chain #${i + 1}`
  }))

  const { data, error } = await supabase.from('stock_entries').insert(rows).select()
  if (error) {
    console.error("Error inserting Boys Kai Chains:", error)
  } else {
    const totalWt = boysKaiChainWeights.reduce((a,b)=>a+b,0)
    console.log(`Successfully inserted ${data.length} Boys Kai Chain items! Total weight: ${totalWt.toFixed(3)}g`)
  }
}

insertBoysKaiChains()
