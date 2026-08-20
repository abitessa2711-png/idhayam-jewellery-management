import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function updateMiliToMalli() {
  console.log("=== CHECKING STOCK_ENTRIES WITH DETAIL = 'மிலி' ===")
  const { data: entries } = await supabase
    .from('stock_entries')
    .select('id, detail')
    .eq('detail', 'மிலி')

  console.log(`Found ${entries?.length || 0} entries with detail = 'மிலி'`)

  if (entries && entries.length > 0) {
    const { data: updated, error } = await supabase
      .from('stock_entries')
      .update({ detail: 'மல்லி' })
      .eq('detail', 'மிலி')
      .select()

    if (error) {
      console.error("Error updating detail 'மிலி' to 'மல்லி':", error)
    } else {
      console.log(`Successfully updated ${updated.length} entries in Supabase from 'மிலி' to 'மல்லி'!`)
    }
  }

  // Also check sales table just in case
  const { data: sales } = await supabase
    .from('sales')
    .select('id, detail')
    .eq('detail', 'மிலி')

  if (sales && sales.length > 0) {
    await supabase.from('sales').update({ detail: 'மல்லி' }).eq('detail', 'மிலி')
    console.log(`Updated ${sales.length} sales entries from 'மிலி' to 'மல்லி'!`)
  }
}

updateMiliToMalli()
