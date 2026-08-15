import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function cleanHashDetails() {
  console.log("Fetching all stock_entries with '#' in detail...")
  const { data: entries, error } = await supabase
    .from('stock_entries')
    .select('*')
    .like('detail', '%#%')

  if (error) {
    console.error("Error fetching entries:", error)
    return
  }

  console.log(`Found ${entries.length} entries containing '#' in detail. Cleaning...`)
  for (const item of entries) {
    await supabase
      .from('stock_entries')
      .update({ detail: '' })
      .eq('id', item.id)
  }

  console.log("Successfully cleaned all '#' internal details from database!")
}

cleanHashDetails()
