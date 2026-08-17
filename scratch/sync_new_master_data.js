import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function syncNewMasterData() {
  console.log("=== SYNCING NEW MASTER DATA TO SUPABASE ===")

  // 1. Add Subcategory 'பாம்பே கொலுசு கொக்கி' under Category 'கொலுசு'
  let { data: catKolusu } = await supabase.from('categories').select('*').eq('name', 'கொலுசு').maybeSingle()
  if (catKolusu) {
    let { data: subKolusuKokki } = await supabase.from('subcategories').select('*').eq('category_id', catKolusu.id).eq('name', 'பாம்பே கொலுசு கொக்கி').maybeSingle()
    if (!subKolusuKokki) {
      const { data } = await supabase.from('subcategories').insert({ category_id: catKolusu.id, name: 'பாம்பே கொலுசு கொக்கி' }).select().single()
      subKolusuKokki = data
      console.log("Added subcategory 'பாம்பே கொலுசு கொக்கி' to Supabase!")
    } else {
      console.log("Subcategory 'பாம்பே கொலுசு கொக்கி' already exists in Supabase.")
    }
  }

  // 2. Add Variant 'கொடி கொக்கி' under Category 'கொடி' -> Subcategory 'வகைகள்'
  let { data: catKodi } = await supabase.from('categories').select('*').eq('name', 'கொடி').maybeSingle()
  if (catKodi) {
    let { data: subKodiVagaigal } = await supabase.from('subcategories').select('*').eq('category_id', catKodi.id).eq('name', 'வகைகள்').maybeSingle()
    if (!subKodiVagaigal) {
      const { data } = await supabase.from('subcategories').insert({ category_id: catKodi.id, name: 'வகைகள்' }).select().single()
      subKodiVagaigal = data
    }

    let { data: varKodiKokki } = await supabase.from('variants').select('*').eq('category_id', catKodi.id).eq('subcategory_id', subKodiVagaigal.id).eq('name', 'கொடி கொக்கி').maybeSingle()
    if (!varKodiKokki) {
      const { data } = await supabase.from('variants').insert({ category_id: catKodi.id, subcategory_id: subKodiVagaigal.id, name: 'கொடி கொக்கி' }).select().single()
      console.log("Added variant 'கொடி கொக்கி' to Supabase!")
    } else {
      console.log("Variant 'கொடி கொக்கி' already exists in Supabase.")
    }
  }

  console.log("=== MASTER DATA SUPABASE SYNC COMPLETE ===")
}

syncNewMasterData()
