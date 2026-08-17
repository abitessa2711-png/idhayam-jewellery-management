import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testRangeQuery() {
  const { data: stocks } = await supabase
    .from('stock_entries')
    .select('id, category_id, weight, quantity, categories(name), variants(name)')
    .range(0, 9999)

  const mettiStocks = stocks.filter(s => s.categories?.name === 'மெட்டி')

  console.log("Total Metti rows returned with range(0, 9999):", mettiStocks.length)

  const variantCount = {}
  mettiStocks.forEach(s => {
    const vName = s.variants?.name || 'NULL_VARIANT'
    if (!variantCount[vName]) variantCount[vName] = 0
    variantCount[vName] += (parseInt(s.quantity) || 1)
  })

  console.log("Variant counts with range(0, 9999):")
  console.log(variantCount)
}

testRangeQuery()
