import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const ankletSizes = [
  '5" கொலுசுகள்', '5 1/2" கொலுசுகள்', '6" கொலுசுகள்', '6 1/2" கொலுசுகள்',
  '7" கொலுசுகள்', '7 1/2" கொலுசுகள்', '8" கொலுசுகள்', '8 1/2" கொலுசுகள்',
  '9" கொலுசுகள்', '9 1/2" கொலுசுகள்', '10" கொலுசுகள்', '10 1/2" கொலுசுகள்',
  '11" கொலுசுகள்', '11 1/2" கொலுசுகள்', '12" கொலுசுகள்'
]

async function sync() {
  console.log("1. Checking Subcategory 'பாம்பே திருகு மாடல்' in Supabase...")
  const CATEGORY_ID = 1 // கொலுசு

  // Check if 'பாம்பே திருகு மாடல்' exists in subcategories
  let { data: sub } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', CATEGORY_ID)
    .eq('name', 'பாம்பே திருகு மாடல்')
    .maybeSingle()

  if (!sub) {
    console.log("Creating subcategory 'பாம்பே திருகு மாடல்'...")
    const { data: newSub, error } = await supabase
      .from('subcategories')
      .insert({ category_id: CATEGORY_ID, name: 'பாம்பே திருகு மாடல்' })
      .select()
      .single()
    if (error) {
      console.error("Error creating subcategory:", error)
      return
    }
    sub = newSub
  }

  console.log("Subcategory 'பாம்பே திருகு மாடல்' ID:", sub.id)

  // Ensure all ankletSizes exist as variants under subcategory 'பாம்பே திருகு மாடல்'
  for (const size of ankletSizes) {
    const { data: existingVar } = await supabase
      .from('variants')
      .select('*')
      .eq('category_id', CATEGORY_ID)
      .eq('subcategory_id', sub.id)
      .eq('name', size)
      .maybeSingle()

    if (!existingVar) {
      await supabase
        .from('variants')
        .insert({ category_id: CATEGORY_ID, subcategory_id: sub.id, name: size })
    }
  }
  console.log("All ankletSizes variants verified under 'பாம்பே திருகு மாடல்'!")

  // Delete 'விவரம்' from subcategories if present
  const { error: delErr } = await supabase
    .from('subcategories')
    .delete()
    .eq('category_id', CATEGORY_ID)
    .eq('name', 'விவரம்')

  if (!delErr) {
    console.log("Removed redundant 'விவரம்' subcategory from database.")
  }

  console.log("Supabase Schema Sync Complete!")
}

sync()
