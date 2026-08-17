import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// The 35 duplicate items from the first script run:
const duplicatesToRemove = [
  // Pg 1: இடுப்பு செயின் (4 pcs)
  { cat: 'வெள்ளி பொருட்கள்', sub: 'ஹிப் செயின்', var: 'ஹிப் செயின்', weights: [9.980, 23.700, 9.850, 10.040] },
  // Pg 2: வெள்ளி தட்டு (12 pcs)
  { cat: 'வெள்ளி பொருட்கள்', sub: 'வெள்ளி தட்டு', var: 'வெள்ளி தட்டு', weights: [11.060, 13.230, 13.290, 16.600, 24.690, 31.070, 240.300, 189.290, 173.690, 127.000, 136.830, 30.880] },
  // Pg 4: வெள்ளி சங்கு (11 pcs)
  { cat: 'வெள்ளி பாத்திரங்கள்', sub: 'சங்கு', var: 'வெள்ளி சங்கு', weights: [11.260, 11.080, 12.850, 13.290, 15.140, 14.510, 14.470, 14.100, 14.830, 14.340, 17.100] },
  // Pg 7: மணி + பன்னீர் (3 pcs)
  { cat: 'வெள்ளி பொருட்கள்', sub: 'மணி + பன்னீர் சொம்பு', var: 'மணி + பன்னீர் சொம்பு', weights: [44.770, 22.650, 39.840] },
  // Pg 7: வேல் (2 pcs)
  { cat: 'வெள்ளி பொருட்கள்', sub: 'வேல்', var: 'வெள்ளி வேல்', weights: [12.450, 12.450] },
  // Pg 8: கோமாதா (3 pcs)
  { cat: 'வெள்ளி பொருட்கள்', sub: 'கோமாதா', var: 'கோமாதா', weights: [27.400, 27.520, 11.930] }
]

async function removeDuplicates() {
  console.log("=== REMOVING THE 35 DUPLICATE PIECES FROM FIRST RUN ===")

  const { data: categories } = await supabase.from('categories').select('*')
  const { data: subcategories } = await supabase.from('subcategories').select('*')
  const { data: variants } = await supabase.from('variants').select('*')

  let deletedPcs = 0
  let deletedWt = 0

  for (const group of duplicatesToRemove) {
    const cat = categories.find(c => c.name === group.cat)
    const sub = subcategories.find(s => s.name === group.sub && s.category_id === cat?.id)
    const varItem = variants.find(v => v.name === group.var && v.category_id === cat?.id && v.subcategory_id === (sub?.id || null))

    if (!cat || !sub || !varItem) {
      console.error("Missing lookup for duplicate removal:", group)
      continue
    }

    for (const wt of group.weights) {
      // Find matching stock entries and delete ONE duplicate row per weight
      const { data: matches } = await supabase
        .from('stock_entries')
        .select('*')
        .eq('category_id', cat.id)
        .eq('subcategory_id', sub.id)
        .eq('variant_id', varItem.id)
        .eq('weight', wt)
        .order('id', { ascending: true })

      if (matches && matches.length > 1) {
        // Delete only the extra duplicate row (first matching id)
        const rowToDelete = matches[0]
        const { error: delErr } = await supabase.from('stock_entries').delete().eq('id', rowToDelete.id)

        if (!delErr) {
          deletedPcs++
          deletedWt += wt
          console.log(`Deleted 1 duplicate: ${group.var} (${wt}g)`)
        } else {
          console.error(`Error deleting duplicate id ${rowToDelete.id}:`, delErr)
        }
      }
    }
  }

  console.log(`=== SUCCESSFULLY DELETED ${deletedPcs} DUPLICATE PCS (${deletedWt.toFixed(3)}g) ===`)

  // Verify final totals in database
  const { data: finalEntries } = await supabase.from('stock_entries').select('quantity, weight')
  let finalPcs = 0
  let finalWt = 0
  finalEntries.forEach(e => {
    const q = parseInt(e.quantity) || 0
    const w = (parseFloat(e.weight) || 0) * q
    if (q > 0 && w > 0) {
      finalPcs += q
      finalWt += w
    }
  })

  console.log(`FINAL LIVE STOCK TOTAL: ${finalPcs} Pcs | ${finalWt.toFixed(3)}g`)
}

removeDuplicates()
