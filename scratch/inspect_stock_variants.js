import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspect() {
  const { data: entries, error } = await supabase
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

  if (error) {
    console.error("Error fetching stock_entries:", error)
    return
  }

  const combinations = {}
  entries.forEach(e => {
    const cat = e.categories?.name || 'UNKNOWN_CAT'
    const sub = e.subcategories?.name || 'UNKNOWN_SUB'
    const varName = e.variants?.name || 'UNKNOWN_VAR'
    const key = `${cat} -> ${sub} -> ${varName}`
    combinations[key] = (combinations[key] || 0) + 1
  })

  console.log("ALL STOCK COMBINATIONS IN DATABASE:")
  console.log(JSON.stringify(combinations, null, 2))
}

inspect()
