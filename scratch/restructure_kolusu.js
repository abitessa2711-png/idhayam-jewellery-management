import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CATEGORY_ID = 1 // கொலுசு
const SUBCATEGORY_ALAVU = 1 // அளவு
const SUBCATEGORY_BOMBAY = 2 //ம்பே கொலுசு வகைகள்
const VARIANT_7 = 5 // 7" கொலுசுகள்
const VARIANT_75 = 6 // 7 1/2" கொலுசுகள்
const VARIANT_BOMBAY_THIRUGU = 20 //ம்பே திருகு மாடல்

async function restructure() {
  console.log("Fetching all Kolusu entries...")
  const { data: entries, error } = await supabase.from('stock_entries').select('*').eq('category_id', CATEGORY_ID)
  
  if (error) {
    console.error("Error fetching Kolusu entries:", error)
    return
  }

  console.log(`Found ${entries.length} Kolusu entries in database. Re-structuring...`)

  for (const item of entries) {
    const detailStr = item.detail || ''
    
    // Check if it belongs to 7" or 7 1/2" (The 27 pieces)
    if (detailStr.startsWith('7" ') || detailStr.startsWith('7 1/2" ')) {
      let is75 = detailStr.startsWith('7 1/2" ')
      let pureDetail = detailStr.replace('7 1/2" - ', '').replace('7" - ', '').trim()

      await supabase
        .from('stock_entries')
        .update({
          subcategory_id: SUBCATEGORY_ALAVU, // அளவு
          variant_id: is75 ? VARIANT_75 : VARIANT_7, // 7 1/2" or 7"
          detail: pureDetail
        })
        .eq('id', item.id)
    } else {
      // The 8 pieces from Page 2 -> Bombay Thirugu Model
      await supabase
        .from('stock_entries')
        .update({
          subcategory_id: SUBCATEGORY_BOMBAY, // பாம்பே கொலுசு வகைகள்
          variant_id: VARIANT_BOMBAY_THIRUGU,  // பாம்பே திருகு மாடல்
        })
        .eq('id', item.id)
    }
  }

  console.log("Successfully re-structured all Kolusu items!")
}

restructure()
