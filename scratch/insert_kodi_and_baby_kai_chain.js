import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Category கொடி (id: 2), Subcategory வகைகள் (id: 3)
export const muthuKodiWeights = [30.780, 39.110]

// Category கைச் செயின் (id: 7), Subcategory வகைகள் (id: 14), Variant பேபி கைச் செயின் (id: 59)
export const babyKaiChainWeights = [
  10.400, 9.620, 7.320, 8.620, 7.710, 8.220, 8.340, 5.950, 6.400, 7.550,
  6.990, 7.970, 7.340, 6.330, 6.670, 14.950, 18.660, 8.000, 7.460, 7.560,
  5.940, 7.970, 15.130, 6.080, 9.090, 9.700, 9.120
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

export async function insertKodiAndBabyKaiChains() {
  console.log("Checking / creating variant 'முத்து கொடி'...")
  const muthuKodiVar = await ensureVariant(2, 3, 'முத்து கொடி')
  const babyKaiVar = await ensureVariant(7, 14, 'பேபி கைச் செயின்')

  const kodiRows = muthuKodiWeights.map((wt, i) => ({
    category_id: 2,
    subcategory_id: 3,
    variant_id: muthuKodiVar.id,
    weight: wt,
    quantity: 1,
    detail: `Muthu Kodi #${i + 1}`
  }))

  const babyRows = babyKaiChainWeights.map((wt, i) => ({
    category_id: 7,
    subcategory_id: 14,
    variant_id: babyKaiVar.id,
    weight: wt,
    quantity: 1,
    detail: `Baby Kai Chain #${i + 1}`
  }))

  const allRows = [...kodiRows, ...babyRows]
  console.log(`Inserting ${allRows.length} items (${kodiRows.length} Muthu Kodi + ${babyRows.length} Baby Kai Chains)...`)
  
  const { data, error } = await supabase.from('stock_entries').insert(allRows).select()

  if (error) {
    console.error("Error inserting items:", error)
  } else {
    console.log(`Successfully inserted ${data.length} items into database!`)
    console.log(`Muthu Kodi: ${kodiRows.length} pcs (${muthuKodiWeights.reduce((a,b)=>a+b,0).toFixed(3)}g)`)
    console.log(`Baby Kai Chain: ${babyRows.length} pcs (${babyKaiChainWeights.reduce((a,b)=>a+b,0).toFixed(3)}g)`)
  }
}

insertKodiAndBabyKaiChains()
