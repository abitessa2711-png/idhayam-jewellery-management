import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Category: 5 ('வெள்ளி பொருட்கள்'), Subcategory: 7 ('டாலர்'), Variant: 42 ('வெள்ளி டாலர்')
const CATEGORY_ID = 5
const SUBCATEGORY_ID = 7
const VARIANT_ID = 42

export const dollarWeights = [
  // Column 1 (1 - 34)
  1.600, 2.900, 1.590, 2.090, 1.010, 6.700, 1.200, 1.070, 3.180, 2.060,
  2.280, 2.360, 1.290, 1.440, 3.330, 2.450, 2.350, 1.100, 1.250, 2.080,
  1.290, 1.540, 1.120, 0.980, 5.190, 1.170, 1.300, 1.240, 1.010, 1.430,
  1.230, 1.240, 1.120, 1.290,

  // Column 2 (35 - 67)
  2.150, 1.130, 1.020, 2.850, 3.080, 1.140, 1.130, 1.220, 1.220, 1.180,
  1.240, 1.050, 1.160, 1.030, 1.800, 0.900, 3.740, 3.400, 1.000, 1.250,
  1.900, 1.080, 1.260, 6.550, 1.390, 1.450, 1.040, 1.300, 1.160, 1.000,
  2.700, 1.750, 2.780,

  // Column 3 (68 - 102)
  2.400, 1.290, 2.390, 2.080, 1.350, 1.540, 1.020, 1.110, 2.460, 3.350,
  1.560, 1.220, 3.000, 3.910, 1.350, 1.500, 1.380, 2.030, 2.840, 1.050,
  0.920, 1.280, 2.820, 2.290, 4.130, 0.950, 2.750, 1.160, 2.720, 1.560,
  0.880, 1.050, 1.130, 2.910, 1.980,

  // Column 4 (103 - 135)
  1.250, 1.700, 3.160, 1.220, 2.000, 4.170, 1.050, 2.910, 1.520, 3.380,
  2.350, 3.000, 1.040, 2.220, 1.620, 3.450, 1.270, 2.650, 3.010, 3.600,
  3.420, 3.420, 3.090, 3.560, 3.440, 2.120, 1.140, 2.100, 2.100, 2.510,
  3.230, 2.100, 2.410
]

export async function insertAllDollars() {
  console.log(`Inserting ${dollarWeights.length} silver dollars into stock_entries...`)
  const rows = dollarWeights.map((wt, index) => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: VARIANT_ID,
    weight: wt,
    quantity: 1,
    detail: `Dollar #${index + 1}`
  }))

  const { data, error } = await supabase.from('stock_entries').insert(rows).select()
  if (error) {
    console.error("Error inserting silver dollars:", error)
  } else {
    const totalWt = dollarWeights.reduce((a,b)=>a+b,0)
    console.log(`Successfully inserted ${data.length} items! Total weight: ${totalWt.toFixed(3)}g`)
  }
}

insertAllDollars()
