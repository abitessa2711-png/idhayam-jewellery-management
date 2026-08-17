import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testPagination() {
  let allRows = []
  let from = 0
  const pageSize = 1000
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabase
      .from('stock_entries')
      .select('*, categories(name), subcategories(name), variants(name)')
      .range(from, from + pageSize - 1)
      .order('created_at', { ascending: true })

    if (error || !data || data.length === 0) {
      hasMore = false
    } else {
      allRows = allRows.concat(data)
      if (data.length < pageSize) {
        hasMore = false
      } else {
        from += pageSize
      }
    }
  }

  console.log("TOTAL ROWS FETCHED WITH PAGINATION:", allRows.length)

  const mettiRows = allRows.filter(r => r.categories?.name === 'மெட்டி')
  console.log("TOTAL METTI ROWS FETCHED WITH PAGINATION:", mettiRows.length)

  const variantCount = {}
  mettiRows.forEach(r => {
    const vName = r.variants?.name || 'NULL_VARIANT'
    if (!variantCount[vName]) variantCount[vName] = 0
    variantCount[vName] += (parseInt(r.quantity) || 1)
  })

  console.log("=== PAGINATED METTI COUNTS PER VARIANT ===")
  console.log(variantCount)
}

testPagination()
