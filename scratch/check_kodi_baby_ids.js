import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data: catKodi } = await supabase.from('categories').select('*').eq('name', 'கொடி')
  console.log('Category கொடி:', catKodi)
  if (catKodi && catKodi.length > 0) {
    const { data: subKodi } = await supabase.from('subcategories').select('*').eq('category_id', catKodi[0].id)
    console.log('Subcategories for கொடி:', subKodi)
    if (subKodi && subKodi.length > 0) {
      const { data: varKodi } = await supabase.from('variants').select('*').eq('category_id', catKodi[0].id).eq('subcategory_id', subKodi[0].id)
      console.log('Variants for கொடி:', varKodi)
    }
  }

  const { data: catKai } = await supabase.from('categories').select('*').eq('name', 'கைச் செயின்')
  console.log('Category கைச் செயின்:', catKai)
  if (catKai && catKai.length > 0) {
    const { data: subKai } = await supabase.from('subcategories').select('*').eq('category_id', catKai[0].id)
    console.log('Subcategories for கைச் செயின்:', subKai)
    if (subKai && subKai.length > 0) {
      const { data: varKai } = await supabase.from('variants').select('*').eq('category_id', catKai[0].id).eq('subcategory_id', subKai[0].id)
      console.log('Variants for கைச் செயின்:', varKai)
    }
  }
}

test()
