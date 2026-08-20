import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspectRestoredSales() {
  console.log("=== CHECKING LEDGER FOR RECENT SALE DELETIONS ===")
  const { data: ledgerEntries } = await supabase
    .from('ledger')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  console.log("Recent Ledger entries:", ledgerEntries)

  console.log("\n=== CHECKING STOCK_ENTRIES FOR RECENTLY CREATED OR UPDATED ITEMS ===")
  const { data: recentStock } = await supabase
    .from('stock_entries')
    .select('*, categories(name), subcategories(name), variants(name)')
    .order('created_at', { ascending: false })
    .limit(20)

  console.log("Recent Stock Entries:", recentStock.map(s => ({
    id: s.id,
    cat: s.categories?.name,
    sub: s.subcategories?.name,
    variant: s.variants?.name,
    weight: s.weight,
    quantity: s.quantity,
    detail: s.detail,
    createdAt: s.created_at
  })))
}

inspectRestoredSales()
