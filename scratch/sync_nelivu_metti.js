import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function syncNelivu() {
  console.log("=== RENAMING / ADDING 'நெளிவு மெட்டி' IN SUPABASE ===")

  const { data: cat } = await supabase.from('categories').select('*').eq('name', 'மெட்டி').single()
  const { data: sub } = await supabase.from('subcategories').select('*').eq('category_id', cat.id).eq('name', 'வகைகள்').single()

  console.log("Category ID:", cat.id, "Subcategory ID:", sub.id)

  const { data: oldVar } = await supabase.from('variants').select('*').eq('category_id', cat.id).eq('subcategory_id', sub.id).eq('name', 'உருட்டு நெளிவு மெட்டி').maybeSingle()

  if (oldVar) {
    console.log("Renaming variant 'உருட்டு நெளிவு மெட்டி' ➔ 'நெளிவு மெட்டி'...")
    await supabase.from('variants').update({ name: 'நெளிவு மெட்டி' }).eq('id', oldVar.id)
  } else {
    const { data: newVar } = await supabase.from('variants').select('*').eq('category_id', cat.id).eq('subcategory_id', sub.id).eq('name', 'நெளிவு மெட்டி').maybeSingle()
    if (!newVar) {
      console.log("Inserting new variant 'நெளிவு மெட்டி'...")
      await supabase.from('variants').insert({ category_id: cat.id, subcategory_id: sub.id, name: 'நெளிவு மெட்டி' })
    }
  }

  console.log("=== SUCCESS! 'நெளிவு மெட்டி' SYNCED TO SUPABASE ===")
}

syncNelivu()
