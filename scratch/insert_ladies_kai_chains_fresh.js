import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 7 // கைச் செயின்
const SUBCATEGORY_ID = 14 // வகைகள்

export const ladiesKaiChainWeights = [
  6.900, 6.360, 6.950, 6.200, 4.960, 6.020, 7.640, 7.260, 7.940, 7.140,
  6.120, 6.880, 7.340, 6.710, 6.850, 8.160, 6.740, 6.880, 7.010, 2.350,
  6.170, 4.960, 6.410, 6.880, 5.630, 7.430, 7.150, 5.660, 6.440, 6.990,
  6.920, 6.760, 7.010, 7.670
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

export async function insert() {
  const ladiesKaiVar = await ensureVariant(CATEGORY_ID, SUBCATEGORY_ID, 'லேடீஸ் கைச் செயின்')

  const rows = ladiesKaiChainWeights.map((wt, i) => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: ladiesKaiVar.id,
    weight: wt,
    quantity: 1,
    detail: `Ladies Kai Chain #${i + 1}`
  }))

  const { data, error } = await supabase.from('stock_entries').insert(rows).select()
  if (error) {
    console.error("Error inserting Ladies Kai Chains:", error)
  } else {
    console.log(`Successfully inserted ${data.length} Ladies Kai Chains!`)
  }
}

insert()
