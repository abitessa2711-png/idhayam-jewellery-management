import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function syncMettiVariants() {
  console.log("=== SYNCING NEW METTI VARIANTS TO SUPABASE ===")

  // 1. Fetch or create Category 'மெட்டி'
  let { data: category } = await supabase.from('categories').select('*').eq('name', 'மெட்டி').maybeSingle()
  if (!category) {
    const { data } = await supabase.from('categories').insert({ name: 'மெட்டி' }).select().single()
    category = data
  }
  console.log("Category ID for 'மெட்டி':", category.id)

  // 2. Fetch or create Subcategory 'வகைகள்'
  let { data: subcategory } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', category.id)
    .eq('name', 'வகைகள்')
    .maybeSingle()

  if (!subcategory) {
    const { data } = await supabase.from('subcategories').insert({ category_id: category.id, name: 'வகைகள்' }).select().single()
    subcategory = data
  }
  console.log("Subcategory ID for 'வகைகள்':", subcategory.id)

  // 3. New Variants to sync
  const newVariants = [
    "பாம்பே மெட்டி பெரிசு",
    "பாம்பே மெட்டி சிறுசு",
    "சித்து மெட்டி",
    "மாமா மெட்டி",
    "துணை மெட்டி",
    "உருட்டு மெட்டி",
    "சாதா மெட்டி",
    "முத்து மெட்டி",
    "உருட்டு நெளிவு மெட்டி"
  ]

  for (const varName of newVariants) {
    const { data: existingVar } = await supabase
      .from('variants')
      .select('*')
      .eq('category_id', category.id)
      .eq('subcategory_id', subcategory.id)
      .eq('name', varName)
      .maybeSingle()

    if (!existingVar) {
      console.log(`Inserting variant '${varName}' under மெட்டி...`)
      await supabase.from('variants').insert({
        category_id: category.id,
        subcategory_id: subcategory.id,
        name: varName
      })
    }
  }

  console.log("=== ALL NEW METTI VARIANTS SYNCED TO SUPABASE! ===")
}

syncMettiVariants()
