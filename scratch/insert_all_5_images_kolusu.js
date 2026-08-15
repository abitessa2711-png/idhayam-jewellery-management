import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 1 // கொலுசு
const SUBCATEGORY_ID = 1 // அளவு

export const allKolusuFrom5Images = [
  // 5 1/2"
  { variant: '5 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 44.980 },
  { variant: '5 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 53.020 },
  { variant: '5 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 44.290 },
  { variant: '5 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 85.480 },
  { variant: '5 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 105.490 },

  // 6"
  { variant: '6" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 46.270 },
  { variant: '6" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 46.310 },
  { variant: '6" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 44.550 },
  { variant: '6" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 79.080 },
  { variant: '6" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 85.640 },
  { variant: '6" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 74.470 },
  { variant: '6" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 89.360 },
  { variant: '6" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 99.220 },
  { variant: '6" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 93.760 },

  // 6 1/2"
  { variant: '6 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 49.000 },
  { variant: '6 1/2" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 78.410 },
  { variant: '6 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 96.880 },
  { variant: '6 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 104.100 },
  { variant: '6 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 96.640 },
  { variant: '6 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 98.910 },
  { variant: '6 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 105.820 },

  // 7"
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

  // 7 1/2"
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
  { variant: '7 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 139.400 },
  { variant: '7 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 109.400 },
  { variant: '7 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 111.600 },

  // 8"
  { variant: '8" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 58.020 },
  { variant: '8" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 69.990 },
  { variant: '8" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 69.970 },
  { variant: '8" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 79.960 },
  { variant: '8" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 91.960 },
  { variant: '8" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 91.160 },
  { variant: '8" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 79.960 },
  { variant: '8" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 129.940 },
  { variant: '8" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 121.440 },
  { variant: '8" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 104.200 },
  { variant: '8" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 120.430 },
  { variant: '8" கொலுசுகள்', detail: 'ஒரு முத்து', weight: 74.780 },
  { variant: '8" கொலுசுகள்', detail: 'ஒரு முத்து', weight: 59.780 },
  { variant: '8" கொலுசுகள்', detail: 'ஒரு முத்து', weight: 51.000 },

  // 8 1/2"
  { variant: '8 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 79.480 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 78.770 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 79.720 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 73.060 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 86.070 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'ஒரு முத்து', weight: 86.170 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'ஒரு முத்து', weight: 64.170 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'ஒரு முத்து', weight: 64.670 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 101.810 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 128.560 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 117.460 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'செயின் முத்து', weight: 132.980 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'கும்கி', weight: 122.380 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'மிலி', weight: 114.120 },
  { variant: '8 1/2" கொலுசுகள்', detail: 'மிலி', weight: 107.820 },

  // 9"
  { variant: '9" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 99.070 },
  { variant: '9" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 107.890 },
  { variant: '9" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 81.840 },
  { variant: '9" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 92.900 },
  { variant: '9" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 79.600 },
  { variant: '9" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 92.360 },
  { variant: '9" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 90.670 },
  { variant: '9" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 81.450 },
  { variant: '9" கொலுசுகள்', detail: 'செயின் முத்து', weight: 153.800 },

  // 9 1/2"
  { variant: '9 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 71.820 },
  { variant: '9 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 79.360 },
  { variant: '9 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 100.860 },
  { variant: '9 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 100.450 },
  { variant: '9 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 78.290 },
  { variant: '9 1/2" கொலுசுகள்', detail: 'மிலி', weight: 187.820 },
  { variant: '9 1/2" கொலுசுகள்', detail: 'மிலி', weight: 145.220 },
  { variant: '9 1/2" கொலுசுகள்', detail: 'செயின் முத்து', weight: 151.840 },
  { variant: '9 1/2" கொலுசுகள்', detail: 'செயின் முத்து', weight: 108.750 },
  { variant: '9 1/2" கொலுசுகள்', detail: 'செயின் முத்து', weight: 130.640 },

  // 10"
  { variant: '10" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 149.360 },
  { variant: '10" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 150.500 },
  { variant: '10" கொலுசுகள்', detail: 'கும்கி', weight: 183.310 },
  { variant: '10" கொலுசுகள்', detail: 'மிலி', weight: 188.580 },
  { variant: '10" கொலுசுகள்', detail: 'கொத்து முத்து', weight: 112.700 },
  { variant: '10" கொலுசுகள்', detail: 'செயின் முத்து', weight: 170.200 },
  { variant: '10" கொலுசுகள்', detail: 'செயின் முத்து', weight: 71.830 },
  { variant: '10" கொலுசுகள்', detail: 'செயின் முத்து', weight: 157.870 },
  { variant: '10" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 97.410 },
  { variant: '10" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 66.550 },

  // 10 1/2"
  { variant: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 92.080 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 84.360 }, // User requested addition
  { variant: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 111.080 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 68.160 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 75.850 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 98.950 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 106.220 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', weight: 100.350 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 123.220 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'ஒரு புல் முத்து', weight: 124.300 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 166.360 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 155.770 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 167.720 },
  { variant: '10 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', weight: 155.670 }
]

async function run() {
  console.log("Fetching variant IDs for Subcategory 'அளவு'...")
  const { data: vars, error: vErr } = await supabase
    .from('variants')
    .select('*')
    .eq('category_id', CATEGORY_ID)
    .eq('subcategory_id', SUBCATEGORY_ID)

  if (vErr) {
    console.error("Error fetching variants:", vErr)
    return
  }

  const varMap = {}
  vars.forEach(v => { varMap[v.name] = v.id })

  // Clean up any previously inserted items under subcategory 1 to avoid duplicates
  const { error: delErr } = await supabase
    .from('stock_entries')
    .delete()
    .eq('category_id', CATEGORY_ID)
    .eq('subcategory_id', SUBCATEGORY_ID)

  if (!delErr) console.log("Cleared previous entries under 'அளவு' to insert fresh clean batch.")

  const rows = allKolusuFrom5Images.map(item => ({
    category_id: CATEGORY_ID,
    subcategory_id: SUBCATEGORY_ID,
    variant_id: varMap[item.variant],
    detail: item.detail,
    weight: item.weight,
    quantity: 1
  }))

  console.log(`Inserting ${rows.length} Anklet items from 5 images into database...`)
  const { data, error } = await supabase.from('stock_entries').insert(rows).select()

  if (error) {
    console.error("Error inserting Anklet items:", error)
  } else {
    const totalWt = allKolusuFrom5Images.reduce((a,b)=>a+b.weight, 0)
    console.log(`Successfully inserted ${data.length} Anklet items under Subcategory 'அளவு'! Total weight: ${totalWt.toFixed(3)}g`)
  }
}

run()
