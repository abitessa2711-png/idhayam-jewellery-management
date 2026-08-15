import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_CHAIN = 6 // வெள்ளி செயின்
const SUBCATEGORY_TYPES = 13 // வகைகள்

export const ladiesNeckChainWeights = [
  11.180, 11.150, 10.020, 7.430, 11.640, 6.640, 9.140, 6.880, 7.380, 9.180,
  11.250, 11.830, 6.930, 7.200, 15.430, 8.340, 11.580, 11.580, 7.560, 3.930,
  16.830, 7.310, 11.220, 9.170, 20.580, 12.350, 7.720, 18.240, 7.480
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

async function fix() {
  console.log("1. Cleaning up 29 entries from Category 'கைச் செயின்'...")
  // Find entries in Kai Chain (category 7) that match the 29 weights
  const { data: kaiEntries } = await supabase
    .from('stock_entries')
    .select('*')
    .eq('category_id', 7)
    .ilike('detail', '%Ladies%')

  if (kaiEntries && kaiEntries.length > 0) {
    const idsToDelete = kaiEntries.map(e => e.id)
    await supabase.from('stock_entries').delete().in('id', idsToDelete)
    console.log(`Deleted ${idsToDelete.length} mistaken entries from 'கைச் செயின்'.`)
  }

  console.log("2. Inserting 29 Ladies Neck Chains into Category 'வெள்ளி செயின்' -> 'வகைகள்' -> 'லேடீஸ் செயின்'...")
  const varLadies = await ensureVariant(CATEGORY_CHAIN, SUBCATEGORY_TYPES, 'லேடீஸ் செயின்')

  const rows = ladiesNeckChainWeights.map((wt, i) => ({
    category_id: CATEGORY_CHAIN,
    subcategory_id: SUBCATEGORY_TYPES,
    variant_id: varLadies.id,
    weight: wt,
    quantity: 1,
    detail: `Ladies Chain #${i + 1}`
  }))

  const { data, error } = await supabase.from('stock_entries').insert(rows).select()

  if (error) {
    console.error("Error inserting Ladies Chains:", error)
  } else {
    const totalWt = ladiesNeckChainWeights.reduce((a,b)=>a+b,0)
    console.log(`Successfully inserted ${data.length} Ladies Neck Chains! Total weight: ${totalWt.toFixed(3)}g`)
  }
}

fix()
