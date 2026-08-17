import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const exact320MettiCatalog = [
  {
    varName: 'சாதா மெட்டி',
    weights: [
      5.720, 6.450, 5.790, 5.540, 5.460, 6.140, 5.830, 5.980, 6.060, 5.720,
      5.570, 5.980, 5.960, 6.010, 5.840, 3.570, 3.680, 5.650, 5.810, 7.360,
      6.360, 3.510, 5.350, 6.080, 5.790, 6.070, 5.820, 5.810, 5.610, 6.000,
      5.460, 6.170, 6.140, 5.440, 5.490, 5.750, 6.800, 5.220, 5.860, 6.050,
      6.050, 5.710, 6.010, 5.730, 5.080, 5.800, 5.700, 6.010, 5.850, 5.560,
      3.400, 3.340, 6.190, 3.810, 5.540, 4.230, 3.440, 3.630, 5.540, 8.630,
      7.460, 6.020, 5.350, 5.940, 4.290, 6.240, 6.320, 6.020, 5.750, 5.430,
      5.850, 4.700, 5.480, 4.640, 5.590, 3.290, 3.500, 6.590, 5.800, 3.420,
      5.560, 3.430, 6.380, 5.390, 3.330, 5.790, 5.750, 4.310
    ]
  },
  {
    varName: 'பாம்பே மெட்டி சிறுசு',
    weights: [
      2.940, 3.240, 2.980, 3.290, 2.920, 2.660, 2.710, 3.020, 2.970, 2.590,
      2.750, 3.130, 3.200, 2.620, 2.620, 2.580, 2.550, 3.240, 3.170, 3.050,
      3.070, 3.140, 3.140, 3.040, 2.600, 2.930, 2.850, 3.200, 3.010, 3.140,
      3.190, 3.030, 2.900, 3.100, 2.850, 2.630, 3.270, 3.520, 3.050, 3.150,
      3.120, 3.120, 2.900, 2.760, 2.800, 2.740, 2.910, 3.000, 3.140, 3.120,
      3.080, 3.190, 2.840, 2.790, 3.310, 3.160, 3.220, 3.100, 3.480, 2.710,
      2.740, 3.220, 3.540, 3.140, 3.020, 3.220, 3.020, 2.660, 3.030, 3.010,
      3.050, 3.330, 3.040, 2.820, 2.950, 3.150, 3.210, 3.230, 2.760, 3.270,
      3.200, 3.040, 3.170, 3.110, 2.990, 3.100, 2.820, 2.860, 2.980, 3.230,
      2.800, 2.570, 3.150, 2.740, 3.250, 3.160, 2.840, 2.720
    ]
  },
  {
    varName: 'பாம்பே மெட்டி பெரிசு',
    weights: [
      4.090, 3.880, 3.880, 4.030, 4.060, 3.910, 4.240, 4.130, 4.010, 4.040,
      3.970, 3.990, 3.870, 4.120, 4.170, 4.200, 4.140, 4.090, 4.090, 4.100,
      4.260, 3.980, 2.990, 4.190, 4.020, 4.370, 4.040, 4.040, 3.910, 4.050,
      3.950, 3.770, 4.000, 3.930, 3.800, 4.180, 4.070, 4.250, 3.930, 4.380,
      3.710, 3.930, 3.930, 3.890, 4.420, 2.940, 4.090, 3.910, 3.870, 3.520,
      3.810, 3.820, 4.090, 4.270, 3.980, 3.890, 4.250, 4.180
    ]
  },
  {
    varName: 'சுத்து மெட்டி',
    weights: [
      7.880, 5.790, 7.210, 10.590, 7.320, 10.810, 10.230, 5.620, 8.310, 5.970,
      8.050, 10.790, 5.640, 7.790, 5.330, 5.300, 5.330, 5.930, 5.630, 5.810,
      5.910, 4.580, 5.870, 7.090, 10.240, 5.600, 3.940, 4.540, 10.050, 7.210,
      4.820, 5.260, 9.600, 4.410, 6.020, 5.930, 16.840, 20.500, 16.780, 16.790
    ]
  },
  {
    varName: 'உருட்டு மெட்டி',
    weights: [
      9.750, 10.060, 9.690, 10.000, 10.300, 12.200,
      8.890, 11.750, 10.040, 13.870, 8.010, 11.990, 11.790, 10.310, 7.860, 11.670, 7.700
    ]
  },
  {
    varName: 'முத்து மெட்டி',
    weights: [
      14.250, 8.210, 13.790, 14.660, 13.510, 13.020, 7.820,
      13.850, 7.420, 14.130, 13.410
    ]
  },
  {
    varName: 'மாப்பிள்ளை மெட்டி',
    weights: [
      2.700, 2.770, 2.770, 3.140
    ]
  },
  {
    varName: 'நெளிவு மெட்டி',
    weights: [
      12.960, 12.480, 11.210, 6.580
    ]
  }
]

async function dedupeAndSetPerfect320Metti() {
  console.log("=== RESETTING METTI TO EXACT 320 PCS (1688.130g) ===")

  let { data: cat } = await supabase.from('categories').select('*').eq('name', 'மெட்டி').single()
  let { data: sub } = await supabase.from('subcategories').select('*').eq('category_id', cat.id).eq('name', 'வகைகள்').single()

  // Delete all existing Metti items to clear duplicates
  await supabase.from('stock_entries').delete().eq('category_id', cat.id)

  let insertedCount = 0
  let insertedWeight = 0

  for (const group of exact320MettiCatalog) {
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

  console.log(`=== SUCCESSFULLY SET EXACT ${insertedCount} METTI PCS (${insertedWeight.toFixed(3)}g) ===`)

  // Check updated final live stock total across all categories
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

dedupeAndSetPerfect320Metti()
