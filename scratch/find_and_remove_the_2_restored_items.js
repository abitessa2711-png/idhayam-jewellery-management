import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function findAndRemoveRestoredItems() {
  console.log("=== SEARCHING FOR THE 2 RESTORED KOLUSU ITEMS IN STOCK_ENTRIES ===")

  // Find Category 'கொலுசு'
  const { data: cat } = await supabase.from('categories').select('*').eq('name', 'கொலுசு').single()

  const { data: entries } = await supabase
    .from('stock_entries')
    .select('*, categories(name), subcategories(name), variants(name)')
    .eq('category_id', cat.id)
    .in('weight', [71.82, 85.48])

  console.log("Found matching stock entries in DB:", entries.map(e => ({
    id: e.id,
    cat: e.categories?.name,
    sub: e.subcategories?.name,
    variant: e.variants?.name,
    weight: e.weight,
    quantity: e.quantity,
    detail: e.detail
  })))

  // Delete/decrement these 2 items from live stock as instructed by the user
  for (const entry of entries) {
    if (parseInt(entry.quantity) > 1) {
      console.log(`Decrementing quantity for entry ID ${entry.id} (${entry.variants?.name}, ${entry.weight}g)`)
      await supabase.from('stock_entries').update({ quantity: parseInt(entry.quantity) - 1 }).eq('id', entry.id)
    } else {
      console.log(`Deleting stock entry ID ${entry.id} (${entry.variants?.name}, ${entry.weight}g)`)
      await supabase.from('stock_entries').delete().eq('id', entry.id)
    }
  }

  console.log("=== REMOVAL COMPLETE! ===")
}

findAndRemoveRestoredItems()
