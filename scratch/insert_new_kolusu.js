import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 1  // கொலுசு
const SUBCATEGORY_ID = 1 // அளவு

export const newKolusuItems = [
  // 6 1/2" கொலுசுகள் (Variant id 4)
  { variant_id: 4, detail: 'மூன்று இடை முத்து', weight: 45.760 },

  // 8" கொலுசுகள் (Variant id 7)
  { variant_id: 7, detail: 'மூன்று இடை முத்து', weight: 53.240 },

  // 8 1/2" கொலுசுகள் (Variant id 8)
  { variant_id: 8, detail: 'மூன்று இடை முத்து', weight: 57.640 },
  { variant_id: 8, detail: 'மூன்று இடை முத்து', weight: 52.490 },

  // 9" கொலுசுகள் (Variant id 9)
  { variant_id: 9, detail: 'மூன்று இடை முத்து', weight: 56.670 },

  // 10 1/2" கொலுசுகள் (Variant id 12)
  { variant_id: 12, detail: 'மூன்று இடை முத்து', weight: 62.140 },
  { variant_id: 12, detail: 'மூன்று இடை முத்து', weight: 61.420 },

  // 12" கொலுசுகள் (Variant id 15)
  { variant_id: 15, detail: 'மூன்று இடை முத்து', weight: 65.720 }
]

export async function insertNewKolusu() {
  const rows = newKolusuItems.map(item => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: item.variant_id,
    detail: item.detail,
    weight: item.weight,
    quantity: 1
  }))

  console.log(`Inserting ${rows.length} new Anklet (கொலுசு) entries into stock_entries...`)
  const { data, error } = await supabase.from('stock_entries').insert(rows).select()
  if (error) {
    console.error("Error inserting new Kolusu items:", error)
  } else {
    console.log(`Successfully inserted ${data.length} new Kolusu items!`)
  }
}
