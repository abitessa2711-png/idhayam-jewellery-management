import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 1. Kolusu Continuation (10 1/2" & 11")
export const kolusuContinuation = [
  { variant: '10 1/2" கொலுசுகள்', detail: 'கொத்து முத்து', weight: 163.850 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'மிலி', weight: 118.970 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'செயின் முத்து', weight: 116.510 },
  { variant: '11" கொலுசுகள்', detail: 'ஒரு முத்து', weight: 80.750 },
  { variant: '11" கொலுசுகள்', detail: 'ஒரு முத்து', weight: 103.350 },
  { variant: '11" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 112.550 }
]

// 2. Surul Valaial (2 Pcs)
export const surulValaialWeights = [12.940, 11.620]

// 3. Karugamani Valaial (12 Pcs)
export const karugamaniValaialWeights = [
  8.580, 8.630, 9.800, 11.240, 10.820, 8.440,
  7.380, 2.270, 12.600, 8.950, 7.450, 7.120
]

async function ensureCategory(name) {
  let { data } = await supabase.from('categories').select('*').eq('name', name).maybeSingle()
  if (!data) {
    const { data: newC, error } = await supabase.from('categories').insert({ name }).select().single()
    if (error) throw error
    data = newC
  }
  return data
}

async function ensureSubcategory(catId, name) {
  let { data } = await supabase.from('subcategories').select('*').eq('category_id', catId).eq('name', name).maybeSingle()
  if (!data) {
    const { data: newS, error } = await supabase.from('subcategories').insert({ category_id: catId, name }).select().single()
    if (error) throw error
    data = newS
  }
  return data
}

async function ensureVariant(catId, subId, name) {
  let { data } = await supabase.from('variants').select('*').eq('category_id', catId).eq('subcategory_id', subId).eq('name', name).maybeSingle()
  if (!data) {
    const { data: newV, error } = await supabase.from('variants').insert({ category_id: catId, subcategory_id: subId, name }).select().single()
    if (error) throw error
    data = newV
  }
  return data
}

export async function insertNewItems() {
  console.log("Processing insertions...")

  // 1. Kolusu (category 1, subcategory 1)
  const { data: vars1 } = await supabase.from('variants').select('*').eq('category_id', 1).eq('subcategory_id', 1)
  const varMap1 = {}
  vars1.forEach(v => { varMap1[v.name] = v.id })

  const kolusuRows = kolusuContinuation.map(item => ({
    category_id: 1,
    subcategory_id: 1,
    variant_id: varMap1[item.variant],
    weight: item.weight,
    quantity: 1,
    detail: item.detail
  }))

  // 2. Valaial (Ensure category 'வளையல்', subcategory 'வகைகள்')
  const catVal = await ensureCategory('வளையல்')
  const subVal = await ensureSubcategory(catVal.id, 'வகைகள்')

  const varSurul = await ensureVariant(catVal.id, subVal.id, 'சுருள் வளையல்')
  const varKarugamani = await ensureVariant(catVal.id, subVal.id, 'கருகமணி வளையல்')

  const surulRows = surulValaialWeights.map((wt, i) => ({
    category_id: catVal.id,
    subcategory_id: subVal.id,
    variant_id: varSurul.id,
    weight: wt,
    quantity: 1,
    detail: `Surul Valaial #${i + 1}`
  }))

  const karugamaniRows = karugamaniValaialWeights.map((wt, i) => ({
    category_id: catVal.id,
    subcategory_id: subVal.id,
    variant_id: varKarugamani.id,
    weight: wt,
    quantity: 1,
    detail: `Karugamani Valaial #${i + 1}`
  }))

  const allRows = [...kolusuRows, ...surulRows, ...karugamaniRows]
  console.log(`Inserting ${allRows.length} total items...`)

  const { data, error } = await supabase.from('stock_entries').insert(allRows).select()
  if (error) {
    console.error("Error inserting items:", error)
  } else {
    console.log(`Successfully inserted ${data.length} items!`)
    console.log(`Kolusu continuation: ${kolusuRows.length} pcs`)
    console.log(`Surul Valaial: ${surulRows.length} pcs (${surulValaialWeights.reduce((a,b)=>a+b,0).toFixed(3)}g)`)
    console.log(`Karugamani Valaial: ${karugamaniRows.length} pcs (${karugamaniValaialWeights.reduce((a,b)=>a+b,0).toFixed(3)}g)`)
  }
}

insertNewItems()
