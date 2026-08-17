import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function addHipChain() {
  console.log("Fetching Category 'வெள்ளி பொருட்கள்'...")
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('name', 'வெள்ளி பொருட்கள்')
    .single()

  if (!category) {
    console.error("Category 'வெள்ளி பொருட்கள்' not found!")
    return
  }

  console.log("Category ID for 'வெள்ளி பொருட்கள்':", category.id)

  // 1. Insert or get Subcategory 'ஹிப் செயின்'
  let { data: subcategory } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', category.id)
    .eq('name', 'ஹிப் செயின்')
    .maybeSingle()

  if (!subcategory) {
    console.log("Creating subcategory 'ஹிப் செயின்' in Supabase...")
    const { data: newSub, error: subErr } = await supabase
      .from('subcategories')
      .insert({ category_id: category.id, name: 'ஹிப் செயின்' })
      .select()
      .single()

    if (subErr) {
      console.error("Error creating subcategory:", subErr)
      return
    }
    subcategory = newSub
  }

  console.log("Subcategory 'ஹிப் செயின்' ID:", subcategory.id)

  // 2. Insert Variants under 'ஹிப் செயின்'
  const variants = ["ஹிப் செயின்", "வெள்ளி ஹிப் செயின்", "லேடீஸ் ஹிப் செயின்"]
  for (const varName of variants) {
    const { data: existingVar } = await supabase
      .from('variants')
      .select('*')
      .eq('category_id', category.id)
      .eq('subcategory_id', subcategory.id)
      .eq('name', varName)
      .maybeSingle()

    if (!existingVar) {
      console.log(`Inserting variant '${varName}'...`)
      await supabase.from('variants').insert({
        category_id: category.id,
        subcategory_id: subcategory.id,
        name: varName
      })
    }
  }

  console.log("SUCCESS! Subcategory 'ஹிப் செயின்' & variants synced to Supabase!")
}

addHipChain()
