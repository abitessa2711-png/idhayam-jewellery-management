import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function ensureVariant(catId, subId, name) {
  let { data } = await supabase
    .from('variants')
    .select('*')
    .eq('category_id', catId)
    .eq('subcategory_id', subId)
    .eq('name', name)
    .maybeSingle()

  if (!data) {
    const { data: newV, error } = await supabase
      .from('variants')
      .insert({ category_id: catId, subcategory_id: subId, name })
      .select()
      .single()
    if (error) throw error
    data = newV
  }
  return data
}

async function fix() {
  console.log("1. Fixing Kai Chain variants...")
  const ladiesKaiVar = await ensureVariant(7, 14, 'லேடீஸ் கைச் செயின்')
  const gentsKaiVar = await ensureVariant(7, 14, 'ஜென்ட்ஸ் கைச் செயின்')

  // Move stock_entries that were inserted under category 6 (வெள்ளி செயின்) & variant 'லேடீஸ் செயின்' to category 7 (கைச் செயின்)
  const { data: chainEntries } = await supabase
    .from('stock_entries')
    .select('*')
    .eq('category_id', 6)
    .eq('variant_id', 74) // variant 'லேடீஸ் செயின்'

  if (chainEntries && chainEntries.length > 0) {
    console.log(`Moving ${chainEntries.length} items from 'வெள்ளி செயின்' to 'கைச் செயின்'...`)
    for (const item of chainEntries) {
      await supabase
        .from('stock_entries')
        .update({
          category_id: 7,
          subcategory_id: 14,
          variant_id: ladiesKaiVar.id,
          detail: item.detail ? item.detail.replace('Ladies Chain', 'Ladies Kai Chain') : 'Ladies Kai Chain'
        })
        .eq('id', item.id)
    }
    console.log("Successfully moved Ladies Chains to Kai Chain category!")
  }

  console.log("2. Fixing Kolusu structure under 'பாம்பே கொலுசு வகைகள்' -> 'பாம்பே திருகு மாடல்'...")
  // Subcategory 2 (பாம்பே கொலுசு வகைகள்), Variant 20 (பாம்பே திருகு மாடல்)
  const { data: kolusuEntries } = await supabase
    .from('stock_entries')
    .select('*, variants(name)')
    .eq('category_id', 1)

  if (kolusuEntries && kolusuEntries.length > 0) {
    for (const item of kolusuEntries) {
      let inchName = item.variants?.name || ''
      if (!inchName.includes('"') && item.detail && item.detail.includes('"')) {
        inchName = item.detail
      }
      let detailText = item.detail || ''
      if (inchName && !detailText.startsWith(inchName)) {
        detailText = `${inchName} - ${detailText}`
      }
      await supabase
        .from('stock_entries')
        .update({
          category_id: 1,
          subcategory_id: 2, // பாம்பே கொலுசு வகைகள்
          variant_id: 20,    // பாம்பே திருகு மாடல்
          detail: detailText
        })
        .eq('id', item.id)
    }
    console.log("Successfully updated Kolusu structure!")
  }
}

fix()
