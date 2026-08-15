import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data: cats } = await supabase.from('categories').select('*').eq('name', 'கைச் செயின்')
  console.log('Category கைச் செயின்:', cats)
  if (cats && cats.length > 0) {
    const { data: subs } = await supabase.from('subcategories').select('*').eq('category_id', cats[0].id)
    console.log('Subcategories for கைச் செயின்:', subs)
    if (subs && subs.length > 0) {
      const { data: vars } = await supabase.from('variants').select('*').eq('category_id', cats[0].id).eq('subcategory_id', subs[0].id)
      console.log('Variants for கைச் செயின்:', vars)
    }
  }
}

test()
