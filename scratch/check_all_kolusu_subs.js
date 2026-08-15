import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data: subs } = await supabase.from('subcategories').select('*').eq('category_id', 1)
  console.log('Subcategories for கொலுசு:', subs)
  
  const { data: vars } = await supabase.from('variants').select('*').eq('category_id', 1)
  console.log('Variants for கொலுசு:', vars)
}

test()
