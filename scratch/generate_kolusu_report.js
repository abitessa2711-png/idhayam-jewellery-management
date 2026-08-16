import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfsansdfhopbkpgxrdi.supabase.co'
const supabaseAnonKey = 'sb_publishable_i5iNeV6dBr75SKXXjpE-hA_pDw-yrQ7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function generateReport() {
  const { data: entries, error } = await supabase
    .from('stock_entries')
    .select(`
      id,
      weight,
      quantity,
      detail,
      categories (name),
      subcategories (name),
      variants (name)
    `)
    .eq('category_id', 1) // கொலுசு

  if (error) {
    console.error("Error:", error)
    return
  }

  const alavuStock = {}
  const bombayStock = {}
  let totalAlavuPcs = 0
  let totalAlavuWeight = 0
  let totalBombayPcs = 0
  let totalBombayWeight = 0

  entries.forEach(e => {
    const subName = e.subcategories?.name || 'UNKNOWN'
    const varName = e.variants?.name || 'UNKNOWN'
    const detail = e.detail || 'விவரமில்லை'
    const wt = parseFloat(e.weight) || 0
    const qty = parseInt(e.quantity) || 1

    if (subName === 'அளவு') {
      if (!alavuStock[varName]) alavuStock[varName] = {}
      if (!alavuStock[varName][detail]) alavuStock[varName][detail] = { count: 0, weight: 0 }
      alavuStock[varName][detail].count += qty
      alavuStock[varName][detail].weight += wt
      totalAlavuPcs += qty
      totalAlavuWeight += wt
    } else if (subName === 'பாம்பே திருகு மாடல்' || subName === 'பாம்பே கொலுசு வகைகள்') {
      if (!bombayStock[varName]) bombayStock[varName] = {}
      if (!bombayStock[varName][detail]) bombayStock[varName][detail] = { count: 0, weight: 0 }
      bombayStock[varName][detail].count += qty
      bombayStock[varName][detail].weight += wt
      totalBombayPcs += qty
      totalBombayWeight += wt
    }
  })

  console.log("=== ALAVU KOLUSU REPORT ===")
  console.log(JSON.stringify(alavuStock, null, 2))
  console.log(`Alavu Total: ${totalAlavuPcs} Pcs | ${totalAlavuWeight.toFixed(3)}g`)

  console.log("\n=== BOMBAY THIRUGU REPORT ===")
  console.log(JSON.stringify(bombayStock, null, 2))
  console.log(`Bombay Total: ${totalBombayPcs} Pcs | ${totalBombayWeight.toFixed(3)}g`)

  console.log(`\nGRAND TOTAL KOLUSU: ${totalAlavuPcs + totalBombayPcs} Pcs | ${(totalAlavuWeight + totalBombayWeight).toFixed(3)}g`)
}

generateReport()
