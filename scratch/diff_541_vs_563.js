import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function findDiff() {
  const { data: entries } = await supabase
    .from('stock_entries')
    .select(`
      id,
      weight,
      quantity,
      detail,
      categories (name),
      subcategories (name),
      variants (name)
    `)

  const summary54 = [
    { cat: 'வெள்ளி பொருட்கள்', var: 'வெள்ளி டாலர்', detail: '', pcs: 135, wt: 272.500 },
    { cat: 'வெள்ளி பொருட்கள்', var: 'வேல் காப்பு', detail: '', pcs: 14, wt: 215.020 },
    { cat: 'வெள்ளி பொருட்கள்', var: 'வெள்ளி காப்பு', detail: '', pcs: 29, wt: 694.860 },
    { cat: 'வளையல்', var: 'சுருள் வளையல்', detail: '', pcs: 2, wt: 24.560 },
    { cat: 'வெள்ளி பொருட்கள்', var: 'வெள்ளி கம்மல்', detail: '', pcs: 55, wt: 102.640 },
    { cat: 'வெள்ளி செயின்', var: 'ஜென்ஸ் செயின்', detail: '', pcs: 16, wt: 372.910 },
    { cat: 'வெள்ளி செயின்', var: 'பேபி செயின் சாதா', detail: '', pcs: 9, wt: 115.950 },
    { cat: 'வெள்ளி செயின்', var: 'லேடீஸ் செயின்', detail: '', pcs: 29, wt: 297.170 },
    { cat: 'கைச் செயின்', var: 'பேபி கைச் செயின்', detail: '', pcs: 26, wt: 227.120 },
    { cat: 'கைச் செயின்', var: 'ஜென்ட்ஸ் கைச் செயின்', detail: '', pcs: 56, wt: 1085.680 },
    { cat: 'கைச் செயின்', var: 'லேடீஸ் கைச் செயின்', detail: '', pcs: 34, wt: 224.490 },
    { cat: 'கொலுசு', var: '5 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', pcs: 3, wt: 142.290 },
    { cat: 'கொலுசு', var: '5 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', pcs: 1, wt: 105.490 },
    { cat: 'கொலுசு', var: '6" கொலுசுகள்', detail: 'மூன்று இடை முத்து', pcs: 3, wt: 137.130 },
    { cat: 'கொலுசு', var: '6" கொலுசுகள்', detail: 'ஒரு புல் முத்து', pcs: 3, wt: 239.190 },
    { cat: 'கொலுசு', var: '6" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', pcs: 3, wt: 282.340 },
    { cat: 'கொலுசு', var: '6 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', pcs: 1, wt: 49.000 },
    { cat: 'கொலுசு', var: '6 1/2" கொலுசுகள்', detail: 'ஒரு புல் முத்து', pcs: 1, wt: 78.410 },
    { cat: 'கொலுசு', var: '6 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', pcs: 5, wt: 502.350 },
    { cat: 'கொலுசு', var: '7" கொலுசுகள்', detail: 'மூன்று இடை முத்து', pcs: 8, wt: 471.640 },
    { cat: 'கொலுசு', var: '7" கொலுசுகள்', detail: 'ஒரு புல் முத்து', pcs: 5, wt: 433.360 },
    { cat: 'கொலுசு', var: '7" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', pcs: 3, wt: 309.730 },
    { cat: 'கொலுசு', var: '7 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', pcs: 7, wt: 452.190 },
    { cat: 'கொலுசு', var: '7 1/2" கொலுசுகள்', detail: 'ஒரு புல் முத்து', pcs: 3, wt: 290.020 },
    { cat: 'கொலுசு', var: '7 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', pcs: 4, wt: 469.470 },
    { cat: 'கொலுசு', var: '8" கொலுசுகள்', detail: 'மூன்று இடை முத்து', pcs: 7, wt: 541.020 },
    { cat: 'கொலுசு', var: '8" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', pcs: 4, wt: 476.010 },
    { cat: 'கொலுசு', var: '8" கொலுசுகள்', detail: 'ஒரு முத்து', pcs: 3, wt: 185.560 },
    { cat: 'கொலுசு', var: '8 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', pcs: 5, wt: 397.100 },
    { cat: 'கொலுசு', var: '8 1/2" கொலுசுகள்', detail: 'ஒரு முத்து', pcs: 3, wt: 215.010 },
    { cat: 'கொலுசு', var: '8 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', pcs: 3, wt: 347.830 },
    { cat: 'கொலுசு', var: '8 1/2" கொலுசுகள்', detail: 'செயின் முத்து', pcs: 1, wt: 132.980 },
    { cat: 'கொலுசு', var: '8 1/2" கொலுசுகள்', detail: 'கும்கி', pcs: 1, wt: 122.380 },
    { cat: 'கொலுசு', var: '8 1/2" கொலுசுகள்', detail: 'மிலி', pcs: 2, wt: 221.940 },
    { cat: 'கொலுசு', var: '9" கொலுசுகள்', detail: 'மூன்று இடை முத்து', pcs: 8, wt: 725.780 },
    { cat: 'கொலுசு', var: '9" கொலுசுகள்', detail: 'செயின் முத்து', pcs: 1, wt: 153.800 },
    { cat: 'கொலுசு', var: '9 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', pcs: 4, wt: 358.960 },
    { cat: 'கொலுசு', var: '9 1/2" கொலுசுகள்', detail: 'மிலி', pcs: 2, wt: 333.040 },
    { cat: 'கொலுசு', var: '9 1/2" கொலுசுகள்', detail: 'செயின் முத்து', pcs: 3, wt: 391.230 },
    { cat: 'கொலுசு', var: '10" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', pcs: 2, wt: 299.860 },
    { cat: 'கொலுசு', var: '10" கொலுசுகள்', detail: 'கும்கி', pcs: 1, wt: 183.310 },
    { cat: 'கொலுசு', var: '10" கொலுசுகள்', detail: 'மிலி', pcs: 1, wt: 188.580 },
    { cat: 'கொலுசு', var: '10" கொலுசுகள்', detail: 'கொத்து முத்து', pcs: 1, wt: 112.700 },
    { cat: 'கொலுசு', var: '10" கொலுசுகள்', detail: 'செயின் முத்து', pcs: 3, wt: 399.900 },
    { cat: 'கொலுசு', var: '10" கொலுசுகள்', detail: 'மூன்று இடை முத்து', pcs: 2, wt: 163.960 },
    { cat: 'கொலுசு', var: '10 1/2" கொலுசுகள்', detail: 'மூன்று இடை முத்து', pcs: 8, wt: 737.050 },
    { cat: 'கொலுசு', var: '10 1/2" கொலுசுகள்', detail: 'ஒரு புல் முத்து', pcs: 2, wt: 247.520 },
    { cat: 'கொlouசு', var: '10 1/2" கொலுசுகள்', detail: 'இரண்டு புல் முத்து', pcs: 4, wt: 645.520 },
    { cat: 'கொலுசு', var: '10 1/2" கொலுசுகள்', detail: 'கொத்து முத்து', pcs: 1, wt: 163.850 },
    { cat: 'கொலுசு', var: '10 1/2" கொலுசுகள்', detail: 'மிலி', pcs: 1, wt: 118.970 },
    { cat: 'கொலுசு', var: '10 1/2" கொலுசுகள்', detail: 'செயின் முத்து', pcs: 1, wt: 116.510 },
    { cat: 'கொலுசு', var: '11" கொலுசுகள்', detail: 'ஒரு முத்து', pcs: 2, wt: 184.100 },
    { cat: 'கொலுசு', var: '11" கொலுசுகள்', detail: 'மூன்று இடை முத்து', pcs: 1, wt: 112.550 },
    { cat: 'வெள்ளி செயின்', var: 'லேடீஸ் செயின் 92.5', detail: '', pcs: 9, wt: 32.570 }
  ]

  // Group current DB stock
  const dbGrouped = {}
  entries.forEach(e => {
    const cat = e.categories?.name || ''
    const varName = e.variants?.name || ''
    const detail = e.detail || ''
    const key = `${cat} | ${varName} | ${detail}`.trim()
    if (!dbGrouped[key]) dbGrouped[key] = { cat, varName, detail, pcs: 0, wt: 0 }
    dbGrouped[key].pcs += (parseInt(e.quantity) || 1)
    dbGrouped[key].wt += (parseFloat(e.weight) || 0)
  })

  console.log("=== ITEMS IN DB BUT MISSING OR DIFFERENT IN THE 54 CARDS ===")
  const diffItems = []
  Object.keys(dbGrouped).forEach(key => {
    const item = dbGrouped[key]
    // find match in summary54
    const match = summary54.find(s => 
      s.cat === item.cat && 
      s.var === item.varName && 
      (s.detail === item.detail || (!s.detail && !item.detail))
    )

    if (!match) {
      console.log(`MISSING CARD: ${key} -> DB has ${item.pcs} Pcs (${item.wt.toFixed(3)}g)`)
      diffItems.push(item)
    } else if (match.pcs !== item.pcs || Math.abs(match.wt - item.wt) > 0.01) {
      console.log(`QTY/WT DIFF: ${key} -> Summary Card: ${match.pcs} Pcs (${match.wt}g) VS Database: ${item.pcs} Pcs (${item.wt.toFixed(3)}g)`)
    }
  })
}

findDiff()
