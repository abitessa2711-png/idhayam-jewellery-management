import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const bombayItems = [
  {
    varName: 'பாம்பே மெட்டி சிறுசு',
    weights: [
      // Pg 2 top right (24 Pcs)
      2.940, 3.240, 2.980, 3.290, 2.920, 2.660, 2.710, 3.020, 2.970, 2.590,
      2.750, 3.130, 3.200, 2.620, 2.620, 2.580, 2.550, 3.240, 3.170, 3.050,
      3.070, 3.140, 3.140, 3.040,
      // Pg 3 top (4 Pcs)
      2.600, 2.930, 2.850, 3.200,
      // Pg 4 right column (70 Pcs)
      3.010, 3.140, 3.190, 3.030, 2.900, 3.100, 2.850, 2.630, 3.270, 3.520,
      3.050, 3.150, 3.120, 3.120, 2.900, 2.760, 2.800, 2.740, 2.910, 3.000,
      3.140, 3.120, 3.080, 3.190, 2.840, 2.790, 3.310, 3.160, 3.220, 3.100,
      3.480, 2.710, 2.740, 3.220, 3.540, 3.140, 3.020, 3.220, 3.020, 2.660,
      3.030, 3.010, 3.050, 3.330, 3.040, 2.820, 2.950, 3.150, 3.210, 3.230,
      2.760, 3.270, 3.200, 3.040, 3.170, 3.110, 2.990, 3.100, 2.820, 2.860,
      2.980, 3.230, 2.800, 2.570, 3.150, 2.740, 3.250, 3.160, 2.840, 2.720
    ]
  },
  {
    varName: 'பாம்பே மெட்டி பெரிசு',
    weights: [
      // Pg 2 bottom left (7 Pcs)
      4.090, 3.880, 3.880, 4.030, 4.060, 3.910, 4.240,
      // Pg 2 right column bottom (20 Pcs)
      4.130, 4.010, 4.040, 3.970, 3.990, 3.870, 4.120, 4.170, 4.200, 4.140,
      4.090, 4.090, 4.100, 4.260, 3.980, 2.990, 4.190, 4.020, 4.370, 4.040,
      // Pg 3 right column (31 Pcs)
      4.040, 3.910, 4.050, 3.950, 3.770, 4.000, 3.930, 3.800, 4.180, 4.070,
      4.250, 3.930, 4.380, 3.710, 3.930, 3.930, 3.890, 4.420, 2.940, 4.090,
      3.910, 3.870, 3.520, 3.810, 3.820, 4.090, 4.270, 3.980, 3.890, 4.250,
      4.180
    ]
  },
  {
    varName: 'சுத்து மெட்டி',
    weights: [
      // Pg 3 center column remaining 30 Pcs
      5.330, 5.930, 5.630, 5.810, 5.910, 4.580, 5.870, 7.090, 10.240, 5.600,
      3.940, 4.540, 10.050, 7.210, 4.820, 5.260, 9.600, 4.410, 6.020, 5.930,
      16.840, 20.500, 16.780, 16.790, 8.050, 10.790, 5.640, 7.790, 5.330, 5.300
    ]
  }
]

async function insertAllRemainingBombayMetti() {
  console.log("=== INSERTING ALL REMAINING BOMBAY METTI ITEMS INTO SUPABASE ===")

  let { data: cat } = await supabase.from('categories').select('*').eq('name', 'மெட்டி').maybeSingle()
  let { data: sub } = await supabase.from('subcategories').select('*').eq('category_id', cat.id).eq('name', 'வகைகள்').maybeSingle()

  let insertedCount = 0
  let insertedWeight = 0

  for (const group of bombayItems) {
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

  console.log(`=== SUCCESSFULLY INSERTED ALL ${insertedCount} REMAINING BOMBAY METTI PCS (${insertedWeight.toFixed(3)}g) ===`)

  // Check final grand total
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

  console.log(`NEW GRAND LIVE STOCK TOTAL: ${finalPcs} Pcs | ${finalWt.toFixed(3)}g (~${(finalWt/1000).toFixed(2)} kg)`)
}

insertAllRemainingBombayMetti()
