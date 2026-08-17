import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const sadaMettiWeights = [
  // Pg 1 (45 Pcs)
  5.720, 6.450, 5.790, 5.540, 5.460, 6.140, 5.830, 5.980, 6.060, 5.720,
  5.570, 5.980, 5.960, 6.010, 5.840, 3.570, 3.680, 5.650, 5.810, 7.360,
  6.360, 3.510, 5.350, 6.080, 5.790, 6.070, 5.820, 5.810, 5.610, 6.000,
  5.460, 6.170, 6.140, 5.440, 5.490, 5.750, 6.800, 5.220, 5.860, 6.050,
  6.050, 5.710, 6.010, 5.730, 5.080,
  // Pg 2 (5 Pcs)
  5.800, 5.700, 6.010, 5.850, 5.560,
  // Pg 3 (38 Pcs)
  3.400, 3.340, 6.190, 3.810, 5.540, 4.230, 3.440, 3.630, 5.540, 8.630,
  7.460, 6.020, 5.350, 5.940, 4.290, 6.240, 6.320, 6.020, 5.750, 5.430,
  5.850, 4.700, 5.480, 4.640, 5.590, 3.290, 3.500, 6.590, 5.800, 3.420,
  5.560, 3.430, 6.380, 5.390, 3.330, 5.790, 5.750, 4.310
]

async function insertSadaMettiOnly() {
  console.log("=== INSERTING 88 PCS OF SADA METTI ONLY ===")

  // 1. Category 'மெட்டி'
  let { data: cat } = await supabase.from('categories').select('*').eq('name', 'மெட்டி').maybeSingle()
  if (!cat) {
    const { data } = await supabase.from('categories').insert({ name: 'மெட்டி' }).select().single()
    cat = data
  }

  // 2. Subcategory 'வகைகள்'
  let { data: sub } = await supabase.from('subcategories').select('*').eq('category_id', cat.id).eq('name', 'வகைகள்').maybeSingle()
  if (!sub) {
    const { data } = await supabase.from('subcategories').insert({ category_id: cat.id, name: 'வகைகள்' }).select().single()
    sub = data
  }

  // 3. Variant 'சாதா மெட்டி'
  let { data: variant } = await supabase.from('variants').select('*').eq('category_id', cat.id).eq('subcategory_id', sub.id).eq('name', 'சாதா மெட்டி').maybeSingle()
  if (!variant) {
    const { data } = await supabase.from('variants').insert({ category_id: cat.id, subcategory_id: sub.id, name: 'சாதா மெட்டி' }).select().single()
    variant = data
  }

  let insertedCount = 0
  let insertedWeight = 0

  for (const wt of sadaMettiWeights) {
    const { error } = await supabase.from('stock_entries').insert({
      category_id: cat.id,
      subcategory_id: sub.id,
      variant_id: variant.id,
      weight: wt,
      quantity: 1,
      detail: ''
    })

    if (error) {
      console.error(`Error inserting Sada Metti (${wt}g):`, error)
    } else {
      insertedCount++
      insertedWeight += wt
    }
  }

  console.log(`=== SUCCESSFULLY INSERTED ${insertedCount} PCS OF SADA METTI (${insertedWeight.toFixed(3)}g) ===`)

  // Check updated total
  const { data: entries } = await supabase.from('stock_entries').select('quantity, weight')
  let finalPcs = 0
  let finalWt = 0
  entries.forEach(e => {
    const q = parseInt(e.quantity) || 0
    const w = (parseFloat(e.weight) || 0) * q
    if (q > 0 && w > 0) {
      finalPcs += q
      finalWt += w
    }
  })

  console.log(`UPDATED GRAND LIVE STOCK TOTAL: ${finalPcs} Pcs | ${finalWt.toFixed(3)}g (~${(finalWt/1000).toFixed(2)} kg)`)
}

insertSadaMettiOnly()
