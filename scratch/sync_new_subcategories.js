import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function syncNewSubs() {
  console.log("=== SYNCING NEW SUBCATEGORIES TO SUPABASE ===")

  // 1. Fetch or create Categories
  let { data: velliPorutkal } = await supabase.from('categories').select('*').eq('name', 'வெள்ளி பொருட்கள்').maybeSingle()
  let { data: velliPaathirangal } = await supabase.from('categories').select('*').eq('name', 'வெள்ளி பாத்திரங்கள்').maybeSingle()

  if (!velliPorutkal) {
    const { data } = await supabase.from('categories').insert({ name: 'வெள்ளி பொருட்கள்' }).select().single()
    velliPorutkal = data
  }

  if (!velliPaathirangal) {
    console.log("Creating Category 'வெள்ளி பாத்திரங்கள்' in Supabase...")
    const { data } = await supabase.from('categories').insert({ name: 'வெள்ளி பாத்திரங்கள்' }).select().single()
    velliPaathirangal = data
  }

  console.log("Category ID for 'வெள்ளி பொருட்கள்':", velliPorutkal?.id)
  console.log("Category ID for 'வெள்ளி பாத்திரங்கள்':", velliPaathirangal?.id)

  const itemsToSync = [
    {
      catId: velliPorutkal.id,
      subName: 'வெள்ளி தட்டு',
      variants: ['வெள்ளி தட்டு', 'பூஜை தட்டு']
    },
    {
      catId: velliPorutkal.id,
      subName: 'மணி + பன்னீர் சொம்பு',
      variants: ['மணி + பன்னீர் சொம்பு', 'பூஜை மணி', 'பன்னீர் சொம்பு']
    },
    {
      catId: velliPorutkal.id,
      subName: 'வேல்',
      variants: ['வெள்ளி வேல்', 'சின்னது', 'பெரியது']
    },
    {
      catId: velliPorutkal.id,
      subName: 'கோமாதா',
      variants: ['கோமாதா', 'கோமாதா சிலை']
    },
    {
      catId: velliPaathirangal.id,
      subName: 'சங்கு',
      variants: ['வெள்ளி சங்கு', 'பூஜை சங்கு', 'சங்கு']
    }
  ]

  for (const item of itemsToSync) {
    let { data: sub } = await supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', item.catId)
      .eq('name', item.subName)
      .maybeSingle()

    if (!sub) {
      console.log(`Creating Subcategory '${item.subName}' under Category ID ${item.catId}...`)
      const { data: newSub, error } = await supabase
        .from('subcategories')
        .insert({ category_id: item.catId, name: item.subName })
        .select()
        .single()

      if (error) {
        console.error(`Error creating '${item.subName}':`, error)
        continue
      }
      sub = newSub
    }

    console.log(`Subcategory '${item.subName}' ID: ${sub.id}`)

    for (const varName of item.variants) {
      const { data: existingVar } = await supabase
        .from('variants')
        .select('*')
        .eq('category_id', item.catId)
        .eq('subcategory_id', sub.id)
        .eq('name', varName)
        .maybeSingle()

      if (!existingVar) {
        console.log(`  -> Inserting variant '${varName}'...`)
        await supabase.from('variants').insert({
          category_id: item.catId,
          subcategory_id: sub.id,
          name: varName
        })
      }
    }
  }

  console.log("=== ALL NEW SUBCATEGORIES & VARIANTS SYNCED TO SUPABASE! ===")
}

syncNewSubs()
