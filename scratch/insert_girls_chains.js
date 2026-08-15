import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 6 // வெள்ளி செயின்
const SUBCATEGORY_ID = 13 // வகைகள்
const VARIANT_ID = 74 // லேடீஸ் செயின்

export const girlsChainWeights = [
  6.900, 6.360, 6.950, 6.200, 4.960, 6.020, 7.640, 7.260, 7.940, 7.140,
  6.120, 6.880, 7.340, 6.710, 6.850, 8.160, 6.740, 6.880, 7.010, 2.350,
  6.170, 4.960, 6.410, 6.880, 5.630, 7.430, 7.150, 5.660, 6.440, 6.990,
  6.920, 6.760, 7.010, 7.670
]

export async function insertGirlsChains() {
  console.log(`Inserting ${girlsChainWeights.length} Ladies Chains into stock_entries...`)
  const rows = girlsChainWeights.map((wt, i) => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: VARIANT_ID,
    weight: wt,
    quantity: 1,
    detail: `Ladies Chain #${i + 1}`
  }))

  const { data, error } = await supabase.from('stock_entries').insert(rows).select()

  if (error) {
    console.error("Error inserting Ladies Chains:", error)
  } else {
    const totalWt = girlsChainWeights.reduce((a,b)=>a+b,0)
    console.log(`Successfully inserted ${data.length} Ladies Chain items! Total weight: ${totalWt.toFixed(3)}g`)
  }
}

insertGirlsChains()
