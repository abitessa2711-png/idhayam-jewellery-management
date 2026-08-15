import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 1 // கொலுசு
const SUBCATEGORY_ID = 18 // பாம்பே திருகு மாடல்

export const bombayThiruguItems = [
  // 6 1/2" கொலுசுகள்
  { variant_name: '6 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 45.760 },

  // 8" கொலுசுகள்
  { variant_name: '8" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 53.240 },

  // 8 1/2" கொலுசுகள்
  { variant_name: '8 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 57.640 },
  { variant_name: '8 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 52.490 },

  // 9" கொலுசுகள்
  { variant_name: '9" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 56.670 },

  // 10 1/2" கொலுசுகள்
  { variant_name: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 62.140 },
  { variant_name: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 61.420 },

  // 12" கொலுசுகள்
  { variant_name: '12" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 65.720 }
]

async function run() {
  console.log("Fetching variant IDs for Bombay Thirugu Model...")
  const { data: vars, error: vErr } = await supabase
    .from('variants')
    .select('*')
    .eq('category_id', CATEGORY_ID)
    .eq('subcategory_id', SUBCATEGORY_ID)

  if (vErr) {
    console.error("Error fetching variants:", vErr)
    return
  }

  const varMap = {}
  vars.forEach(v => { varMap[v.name] = v.id })

  const rows = bombayThiruguItems.map(item => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: varMap[item.variant_name],
    detail: item.detail,
    weight: item.weight,
    quantity: 1
  }))

  console.log(`Inserting ${rows.length} Bombay Thirugu Model Anklets...`)
  const { data, error } = await supabase.from('stock_entries').insert(rows).select()

  if (error) {
    console.error("Error inserting Bombay Thirugu items:", error)
  } else {
    const totalWt = bombayThiruguItems.reduce((a,b)=>a+b.weight, 0)
    console.log(`Successfully inserted ${data.length} Bombay Thirugu Model items! Total weight: ${totalWt.toFixed(3)}g`)
  }
}

run()
