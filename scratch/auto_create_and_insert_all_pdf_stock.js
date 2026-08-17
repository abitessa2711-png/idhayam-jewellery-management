import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const pdfEntries = [
  // Pg 1: இடுப்பு செயின்
  { cat: 'வெள்ளி பொருட்கள்', sub: 'ஹிப் செயின்', var: 'ஹிப் செயின்', weights: [9.980, 23.700, 9.850, 10.040] },
  // Pg 2: வெள்ளி தட்டு
  { cat: 'வெள்ளி பொருட்கள்', sub: 'வெள்ளி தட்டு', var: 'வெள்ளி தட்டு', weights: [11.060, 13.230, 13.290, 16.600, 24.690, 31.070, 240.300, 189.290, 173.690, 127.000, 136.830, 30.880] },
  // Pg 3: வெள்ளி சந்தன கிண்ணம்
  { cat: 'வெள்ளி பாத்திரங்கள்', sub: 'கிண்ணம்', var: 'சந்தன கிண்ணம்', weights: [8.210, 21.910, 25.020, 32.860] },
  // Pg 4: வெள்ளி சங்கு
  { cat: 'வெள்ளி பாத்திரங்கள்', sub: 'சங்கு', var: 'வெள்ளி சங்கு', weights: [11.260, 11.080, 12.850, 13.290, 15.140, 14.510, 14.470, 14.100, 14.830, 14.340, 17.100] },
  // Pg 5: வெள்ளி செம்பு
  { cat: 'வெள்ளி பாத்திரங்கள்', sub: 'செம்பு', var: 'வெள்ளி செம்பு', weights: [50.910, 39.870, 55.670, 107.610] },
  // Pg 6: வெள்ளி கிண்ணம் (சாதாரண)
  { cat: 'வெள்ளி பாத்திரங்கள்', sub: 'கிண்ணம்', var: 'சாதாரண கிண்ணம்', weights: [23.160, 21.230, 22.490, 22.490, 22.900, 24.320, 24.680, 25.480, 25.630, 31.110, 36.760, 37.410, 39.330, 39.700, 48.300, 53.440, 62.910, 67.510] },
  // Pg 7: மணி + பன்னீர்
  { cat: 'வெள்ளி பொருட்கள்', sub: 'மணி + பன்னீர் சொம்பு', var: 'மணி + பன்னீர் சொம்பு', weights: [44.770, 22.650, 39.840] },
  // Pg 7: வேல்
  { cat: 'வெள்ளி பொருட்கள்', sub: 'வேல்', var: 'வெள்ளி வேல்', weights: [12.450, 12.450] },
  // Pg 8: கோமாதா
  { cat: 'வெள்ளி பொருட்கள்', sub: 'கோமாதா', var: 'கோமாதா', weights: [27.400, 27.520, 11.930] },
  // Pg 9: ஒரு திரி விளக்கு
  { cat: 'வெள்ளி பாத்திரங்கள்', sub: 'விளக்குகள்', var: 'ஒரு திரி விளக்கு', weights: [15.440, 15.700] },
  // Pg 10: வெள்ளி குங்கும சிமிழ்
  { cat: 'வெள்ளி பாத்திரங்கள்', sub: 'குங்குமச்சிமிழ்', var: 'குங்குமச்சிமிழ்', weights: [9.900, 9.740, 10.000, 10.760, 10.310, 10.300, 10.300, 14.850, 14.540, 14.950, 15.000, 16.170, 15.400, 19.490, 20.100, 19.980, 20.120, 18.280, 34.460] },
  // Pg 11: வெள்ளி குத்து விளக்கு
  { cat: 'வெள்ளி பாத்திரங்கள்', sub: 'விளக்குகள்', var: 'குத்து விளக்கு', weights: [11.370, 9.810, 23.180, 28.480, 23.060, 23.530, 25.150, 26.800, 26.700, 32.230, 32.370, 32.320, 31.320, 29.870, 30.780, 58.570, 59.390, 78.410, 79.170, 110.750, 107.760] },
  // Pg 12: வெள்ளி காமாட்சி விளக்கு
  { cat: 'வெள்ளி பாத்திரங்கள்', sub: 'விளக்குகள்', var: 'காமாட்சி விளக்கு', weights: [8.180, 8.050, 8.690, 8.600, 10.440, 12.920, 12.550, 11.960, 15.970, 14.640, 14.880, 21.060, 24.970, 25.020, 26.540, 25.600, 28.680, 30.660, 30.500, 30.300, 29.640, 32.520, 47.900, 40.000, 39.710, 54.900, 54.270, 50.530, 60.920, 76.600] },
  // Pg 13: வெள்ளி டம்ளர்
  { cat: 'வெள்ளி பாத்திரங்கள்', sub: 'டம்ளர்', var: 'வெள்ளி டம்ளர்', weights: [10.810, 10.260, 10.430, 10.700, 10.790, 11.090, 15.320, 16.570, 16.060, 16.350, 16.540, 18.190, 18.670, 24.150, 27.390, 27.370, 27.400, 34.770, 35.360, 41.560, 41.160, 48.930, 51.490, 60.320, 60.680] }
]

async function insertAllStockClean() {
  console.log("=== ENSURING ALL CATEGORIES, SUBCATEGORIES, AND VARIANTS EXIST ===")

  let totalInsertedPcs = 0
  let totalInsertedWt = 0

  for (const group of pdfEntries) {
    // 1. Category
    let { data: cat } = await supabase.from('categories').select('*').eq('name', group.cat).maybeSingle()
    if (!cat) {
      const { data } = await supabase.from('categories').insert({ name: group.cat }).select().single()
      cat = data
    }

    // 2. Subcategory
    let { data: sub } = await supabase.from('subcategories').select('*').eq('category_id', cat.id).eq('name', group.sub).maybeSingle()
    if (!sub) {
      const { data } = await supabase.from('subcategories').insert({ category_id: cat.id, name: group.sub }).select().single()
      sub = data
    }

    // 3. Variant
    let { data: variant } = await supabase.from('variants').select('*').eq('category_id', cat.id).eq('subcategory_id', sub.id).eq('name', group.var).maybeSingle()
    if (!variant) {
      const { data } = await supabase.from('variants').insert({ category_id: cat.id, subcategory_id: sub.id, name: group.var }).select().single()
      variant = data
    }

    // 4. Insert Stock Entries
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
        console.error(`Error inserting ${group.var} (${wt}g):`, error)
      } else {
        totalInsertedPcs++
        totalInsertedWt += wt
      }
    }
  }

  console.log(`=== SUCCESSFULLY INSERTED ALL ${totalInsertedPcs} Pcs (${totalInsertedWt.toFixed(3)}g) TO LIVE STOCK! ===`)
}

insertAllStockClean()
