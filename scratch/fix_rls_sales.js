import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixRls() {
  console.log("Testing RPC or direct delete on sales...")
  const { data: sales } = await supabase.from('sales').select('*')
  console.log("Current sales:", sales)

  if (sales && sales.length > 0) {
    const s = sales[0]
    console.log("Trying delete by bill_id and id:", s.id, s.bill_id)
    const { data: d1, error: e1 } = await supabase.from('sales').delete().filter('id', 'eq', s.id).select()
    console.log("Filter delete result:", d1, e1)
  }
}

fixRls()
