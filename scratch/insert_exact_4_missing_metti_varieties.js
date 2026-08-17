import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const missing4Variants = [
  {
    varName: 'உருட்டு மெட்டி',
    weights: [
      9.750, 10.060, 9.690, 10.000, 10.300, 12.200, // Pg 1 (6 Pcs)
      8.890, 11.750, 10.040, 13.870, 8.010, 11.990, 11.790, 10.310, 7.860, 11.670, 7.700 // Pg 4 (11 Pcs)
    ]
  },
  {
    varName: 'முத்து மெட்டி',
    weights: [
      14.250, 8.210, 13.790, 14.660, 13.510, 13.020, 7.820, // Pg 2 (7 Pcs)
      13.850, 7.420, 14.130, 13.410 // Pg 4 (4 Pcs)
    ]
  },
  {
    varName: 'நெளிவு மெட்டி',
    weights: [
      12.960, 12.480, 11.210, 6.580 // Pg 4 (4 Pcs)
    ]
  },
  {
    varName: 'மாப்பிள்ளை மெட்டி',
    weights: [
      2.700, 2.770, // Pg 2 (2 Pcs)
      2.770, 3.140  // Pg 4 (2 Pcs)
    ]
  }
]

async function insertMissing4Metti() {
  console.log("=== INSERTING THE 4 MISSING METTI VARIANTS (36 PCS) INTO SUPABASE ===")

  let { data: cat } = await supabase.from('categories').select('*').eq('name', 'மெட்டி').maybeSingle()
  if (!cat) {
    const { data } = await supabase.from('categories').insert({ name: 'மெட்டி' }).select().single()
    cat = data
  }

  let { data: sub } = await supabase.from('subcategories').select('*').eq('category_id', cat.id).eq('name', 'வகைகள்').maybeSingle()
  if (!sub) {
    const { data } = await supabase.from('subcategories').insert({ category_id: cat.id, name: 'வகைகள்' }).select().single()
    sub = data
  }

  let insertedCount = 0
  let insertedWeight = 0

  for (const group of missing4Variants) {
    let { data: variant } = await supabase.from('variants').select('*').eq('category_id', cat.id).eq('subcategory_id', sub.id).eq('name', group.varName).maybeSingle()
    if (!variant) {
      const { data } = await supabase.from('variants').insert({ category_id: cat.id, subcategory_id: sub.id, name: group.varName }).select().single()
      variant = data
    }

    for (const wt of group.weights) {
      const { error } = await supabase.from('stock_entries').insert({
        category_id: cat.id,
        subcategory_id: sub.id,
        variant_id: variant.id,
        weight: wt,
        quantity: 1,
        detail: ''
      })

      if (error) {
        console.error(`Error inserting ${group.varName} (${wt}g):`, error)
      } else {
        insertedCount++
        insertedWeight += wt
      }
    }
  }

  console.log(`=== SUCCESSFULLY INSERTED ALL ${insertedCount} PCS (${insertedWeight.toFixed(3)}g) ===`)

  // Check updated total across all categories
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

insertMissing4Metti()
