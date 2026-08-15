import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data: subs } = await supabase.from('subcategories').select('*').eq('category_id', 5).eq('name', 'காப்பு')
  console.log('Subcategories for காப்பு:', subs)
  if (subs && subs.length > 0) {
    const { data: vars } = await supabase.from('variants').select('*').eq('category_id', 5).eq('subcategory_id', subs[0].id)
    console.log('Variants for காப்பு:', vars)
  }
}

test()
