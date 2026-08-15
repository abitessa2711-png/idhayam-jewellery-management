import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 1  // கொலுசு
const SUBCATEGORY_ID = 1 // அளவு
const VARIANT_7_ID = 5 // 7" கொலுசுகள்
const VARIANT_75_ID = 6 // 7 1/2" கொலுசுகள்

// Group 1: 7" - மூன்று இடை முத்து (8 pcs)
const g1_weights = [60.840, 50.140, 60.330, 50.300, 56.260, 69.390, 60.500, 63.880]

// Group 2: 7" - ஒரு புல் முத்து (5 pcs)
const g2_weights = [92.030, 84.110, 84.640, 85.400, 87.180]

// Group 3: 7" - இரண்டு புல் முத்து (3 pcs)
const g3_weights = [95.690, 111.630, 102.410]

// Group 4: 7 1/2" - மூன்று இடை முத்து (7 pcs)
const g4_weights = [58.950, 75.030, 85.690, 52.960, 63.900, 52.370, 63.290]

// Group 5: 7 1/2" - ஒரு புல் முத்து (3 pcs)
const g5_weights = [110.410, 90.100, 89.510]

// Group 6: 7 1/2" - இரண்டு புல் முத்து (1 pc)
const g6_weights = [109.070]

export async function insertKolusuItems() {
  const rows = [
    ...g1_weights.map((wt, i) => ({ category_id: CATEGORY_ID, subcategory_id: SUBCATEGORY_ID, variant_id: VARIANT_7_ID, detail: 'மூன்று இடை முத்து', weight: wt, quantity: 1 })),
    ...g2_weights.map((wt, i) => ({ category_id: CATEGORY_ID, subcategory_id: SUBCATEGORY_ID, variant_id: VARIANT_7_ID, detail: 'ஒரு புல் முத்து', weight: wt, quantity: 1 })),
    ...g3_weights.map((wt, i) => ({ category_id: CATEGORY_ID, subcategory_id: SUBCATEGORY_ID, variant_id: VARIANT_7_ID, detail: 'இரண்டு புல் முத்து', weight: wt, quantity: 1 })),
    ...g4_weights.map((wt, i) => ({ category_id: CATEGORY_ID, subcategory_id: SUBCATEGORY_ID, variant_id: VARIANT_75_ID, detail: 'மூன்று இடை முத்து', weight: wt, quantity: 1 })),
    ...g5_weights.map((wt, i) => ({ category_id: CATEGORY_ID, subcategory_id: SUBCATEGORY_ID, variant_id: VARIANT_75_ID, detail: 'ஒரு புல் முத்து', weight: wt, quantity: 1 })),
    ...g6_weights.map((wt, i) => ({ category_id: CATEGORY_ID, subcategory_id: SUBCATEGORY_ID, variant_id: VARIANT_75_ID, detail: 'இரண்டு புல் முத்து', weight: wt, quantity: 1 }))
  ]

  console.log(`Inserting ${rows.length} Anklet (கொலுசு) entries into stock_entries...`)
  const { data, error } = await supabase.from('stock_entries').insert(rows).select()
  if (error) {
    console.error("Error inserting Kolusu items:", error)
  } else {
    console.log(`Successfully inserted ${data.length} Kolusu items!`)
  }
}

insertKolusuItems()
