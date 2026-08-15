import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 1 // கொலுசு

const allItems = [
  // 7" கொலுசுகள்
  { variant: '7" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 60.840 },
  { variant: '7" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 50.140 },
  { variant: '7" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 60.330 },
  { variant: '7" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 50.300 },
  { variant: '7" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 56.260 },
  { variant: '7" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 69.390 },
  { variant: '7" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 60.500 },
  { variant: '7" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 63.880 },

  { variant: '7" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 92.030 },
  { variant: '7" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 84.110 },
  { variant: '7" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 84.640 },
  { variant: '7" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 85.400 },
  { variant: '7" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 87.180 },

  { variant: '7" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 95.690 },
  { variant: '7" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 111.630 },
  { variant: '7" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 102.410 },

  // 7 1/2" கொலுசுகள்
  { variant: '7 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 58.950 },
  { variant: '7 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 75.030 },
  { variant: '7 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 85.690 },
  { variant: '7 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 52.960 },
  { variant: '7 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 63.900 },
  { variant: '7 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 52.370 },
  { variant: '7 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 63.290 },

  { variant: '7 1/2" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 110.410 },
  { variant: '7 1/2" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 90.100 },
  { variant: '7 1/2" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 89.510 },

  { variant: '7 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 109.070 },

  // Page 2 Items
  { variant: '6 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 45.760 },
  { variant: '8" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 53.240 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 57.640 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 52.490 },
  { variant: '9" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 56.670 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 62.140 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 61.420 },
  { variant: '12" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 65.720 }
]

async function run() {
  // 1. Get or create subcategory 'பாம்பே திருகு மாடல்'
  let { data: sub } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', CATEGORY_ID)
    .eq('name', 'பாம்பே திருகு மாடல்')
    .maybeSingle()

  if (!sub) {
    const { data: newSub, error: subErr } = await supabase
      .from('subcategories')
      .insert({ category_id: CATEGORY_ID, name: 'பாம்பே திருகு மாடல்' })
      .select()
      .single()
    if (subErr) throw subErr
    sub = newSub
  }

  console.log("Subcategory 'பாம்பே திருகு மாடல்' ID:", sub.id)

  // 2. Remove any previously added anklets under old subcategory (id: 1)
  const { error: delErr } = await supabase
    .from('stock_entries')
    .delete()
    .eq('category_id', CATEGORY_ID)
    .eq('subcategory_id', 1)

  if (!delErr) console.log("Removed previous test anklets under old subcategory.")

  // 3. Ensure variants exist under subcategory 'பாம்பே திருகு மாடல்'
  const variantMap = {}
  const uniqueVariants = [...new Set(allItems.map(i => i.variant))]
  for (const varName of uniqueVariants) {
    let { data: v } = await supabase
      .from('variants')
      .select('*')
      .eq('category_id', CATEGORY_ID)
      .eq('subcategory_id', sub.id)
      .eq('name', varName)
      .maybeSingle()

    if (!v) {
      const { data: newV, error: vErr } = await supabase
        .from('variants')
        .insert({ category_id: CATEGORY_ID, subcategory_id: sub.id, name: varName })
        .select()
        .single()
      if (vErr) throw vErr
      v = newV
    }
    variantMap[varName] = v.id
  }

  // 4. Build stock rows
  const rows = allItems.map(item => ({
    category_id: CATEGORY_ID,
    subcategory_id: sub.id,
    variant_id: variantMap[item.variant],
    detail: item.detail,
    weight: item.weight,
    quantity: 1
  }))

  const { data, error } = await supabase.from('stock_entries').insert(rows).select()
  if (error) {
    console.error("Error inserting Bombay Thirugu Model Anklets:", error)
  } else {
    console.log(`Successfully inserted ${data.length} Bombay Thirugu Model Anklets into Subcategory 'பாம்பே திருகு மாடல்'!`)
    console.log(`Total Weight: ${allItems.reduce((a,b)=>a+b.weight,0).toFixed(3)}g`)
  }
}

run()
