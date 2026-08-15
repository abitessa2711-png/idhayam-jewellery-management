import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 5  // வெள்ளி பொருட்கள்
const SUBCATEGORY_ID = 6 // கம்மல்
const VARIANT_ID = 40   // வெள்ளி கம்மல்

export const kammalWeights = [
  // 1 - 35
  1.320, 1.540, 1.080, 1.200, 3.130, 1.260, 2.250, 3.130, 1.430, 1.300,
  5.000, 1.290, 1.260, 1.390, 3.490, 3.330, 1.210, 2.300, 1.250, 1.270,
  1.270, 3.180, 2.290, 1.590, 1.220, 1.310, 3.120, 2.540, 1.430, 1.270,
  1.430, 1.480, 1.220, 1.340, 1.510,

  // 36 - 55
  2.310, 0.480, 3.010, 1.350, 1.860, 2.680, 3.650, 1.430, 1.270, 1.260,
  1.350, 1.860, 1.470, 1.280, 1.480, 1.280, 3.650, 1.340, 1.370, 2.630
]

export async function insertKammalItems() {
  console.log(`Inserting ${kammalWeights.length} silver earrings into stock_entries...`)
  const rows = kammalWeights.map((wt, i) => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: VARIANT_ID,
    weight: wt,
    quantity: 1,
    detail: `Kammal #${i + 1}`
  }))

  const { data, error } = await supabase.from('stock_entries').insert(rows).select()
  if (error) {
    console.error("Error inserting Kammal items:", error)
  } else {
    const totalWt = kammalWeights.reduce((a,b)=>a+b,0)
    console.log(`Successfully inserted ${data.length} Kammal items! Total weight: ${totalWt.toFixed(3)}g`)
  }
}

insertKammalItems()
