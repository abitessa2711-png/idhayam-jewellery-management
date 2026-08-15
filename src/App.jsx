import React, { useState, useEffect } from 'react'
import Login          from './components/Login'
import Signup         from './components/Signup'
import Sidebar        from './components/Sidebar'
import Header         from './components/Header'
import AddStock       from './components/AddStock'
import SellDashboard  from './components/SellDashboard'
import Reports        from './components/Reports'
import Dashboard      from './components/Dashboard'
import SoldItems      from './components/SoldItems'
import StockDashboard from './components/StockDashboard'
import { supabase }   from './supabaseClient'
import OldBuyback     from './components/OldBuyback'

export default function App() {
  // ── Auth ───────────────────────────────────────────────────────────────────
  const [user, setUser]           = useState(null)
  const [showSignup, setShowSignup] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [theme, setTheme]         = useState('light')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // ── Data ───────────────────────────────────────────────────────────────────
  const [products, setProducts]   = useState([])
  const [soldItems, setSoldItems] = useState([])
  const [ledger, setLedger]       = useState([])
  const [buybacks, setBuybacks]   = useState([])

  // Lookup Tables for Category/Subcategory/Variant mappings
  const [dbCategories, setDbCategories] = useState([])
  const [dbSubcategories, setDbSubcategories] = useState([])
  const [dbVariants, setDbVariants] = useState([])

  // ── Auth Listeners ────────────────────────────────────────────────────────
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email,
          email: session.user.email,
          role: session.user.user_metadata?.role || 'admin',
          token: session.access_token
        })
      } else {
        setUser(null)
      }
    })

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email,
          email: session.user.email,
          role: session.user.user_metadata?.role || 'admin',
          token: session.access_token
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Load Data from Database ────────────────────────────────────────────────
  const loadLookupTables = async () => {
    const { data: cats } = await supabase.from('categories').select('*')
    const { data: subs } = await supabase.from('subcategories').select('*')
    const { data: vars } = await supabase.from('variants').select('*')
    if (cats) setDbCategories(cats)
    if (subs) setDbSubcategories(subs)
    if (vars) setDbVariants(vars)
  }

  const loadData = async () => {
    // 1. Fetch categories/subcategories/variants lookup
    await loadLookupTables()

    // 2. Fetch products (stock entries)
    const { data: stocks } = await supabase
      .from('stock_entries')
      .select('*, categories(name), subcategories(name), variants(name)')
      .order('created_at', { ascending: true })

    if (stocks) {
      setProducts(stocks.map(item => ({
        id: item.id,
        category: item.categories?.name || '',
        subcategory: item.subcategories?.name || '',
        variant: item.variants?.name || '',
        detail: item.detail || '',
        weight: parseFloat(item.weight || 0),
        quantity: parseInt(item.quantity || 0),
        createdAt: item.created_at
      })))
    }

    // 3. Fetch sales history (Sales Module)
    const { data: salesList } = await supabase
      .from('sales')
      .select('*')
      .order('date', { ascending: true })

    if (salesList) {
      setSoldItems(salesList.map(item => ({
        id: item.id,
        billId: item.bill_id,
        customerName: item.customer_name,
        mobile: item.mobile,
        category: item.category,
        subcategory: item.subcategory,
        variant: item.variant,
        detail: item.detail,
        weight: parseFloat(item.weight || 0),
        quantity: parseInt(item.quantity || 0),
        pricePerGram: parseFloat(item.rate || 0),
        discountAmount: parseFloat(item.discount_amount || 0),
        total: parseFloat(item.amount || 0),
        date: item.date
      })))
    }

    // 4. Fetch ledger
    const { data: ledgerList } = await supabase
      .from('ledger')
      .select('*')
      .order('created_at', { ascending: false })

    if (ledgerList) {
      setLedger(ledgerList)
    }

    const { data: buybackList } = await supabase
      .from('purchases')
      .select('*')
      .eq('category', 'Old Item')
      .order('date', { ascending: false })

    if (buybackList) {
      setBuybacks(buybackList.map(item => ({
        id: item.id,
        date: item.date,
        itemName: item.variant,
        weight: parseFloat(item.weight || 0),
        amount: parseFloat(item.amount || 0),
        detail: item.detail || '',
        customerName: item.supplier_name
      })))
    }
  }

  // ── Realtime Postgres Subscriptions & Mobile Sync ───────────────────────────
  useEffect(() => {
    if (!user) return

    loadData()

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_entries' }, () => { loadData() })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ledger' }, () => { loadData() })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, () => { loadData() })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'purchases' }, () => { loadData() })
      .subscribe()

    // Auto-sync when switching back to tab/browser on mobile
    const handleFocus = () => { loadData() }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') loadData()
    }
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      supabase.removeChannel(channel)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user])

  // ── Theme toggle (locked to light/default) ─────────────────────────────────
  useEffect(() => {
    document.body.className = ''
    localStorage.setItem('tas_theme', 'light')
  }, [])

  // Redirect non-admin users away from admin-only tabs
  useEffect(() => {
    if (user) {
      const adminOnlyTabs = ['reports', 'old_buyback']
      if (user.role !== 'admin' && adminOnlyTabs.includes(activeTab)) {
        setActiveTab('stock')
      }
    }
  }, [user, activeTab])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  // ── Product CRUD (Stock Adding) ───────────────────────────────────────────
  const addProduct = async (newProduct) => {
    // 1. Look up category ID (or insert/fetch if not in state)
    let category = dbCategories.find(c => c.name === newProduct.category)
    if (!category) {
      const { data: existingCat } = await supabase.from('categories').select('*').eq('name', newProduct.category).maybeSingle()
      if (existingCat) {
        category = existingCat
        setDbCategories(prev => [...prev, category])
      } else {
        const { data, error } = await supabase.from('categories').insert({ name: newProduct.category }).select().single()
        if (error) throw error
        category = data
        setDbCategories(prev => [...prev, category])
      }
    }

    // 2. Look up subcategory ID (or insert/fetch if not in state)
    let subcategory = null
    if (newProduct.subcategory) {
      subcategory = dbSubcategories.find(s => s.name === newProduct.subcategory && s.category_id === category.id)
      if (!subcategory) {
        const { data: existingSub } = await supabase.from('subcategories').select('*').eq('category_id', category.id).eq('name', newProduct.subcategory).maybeSingle()
        if (existingSub) {
          subcategory = existingSub
          setDbSubcategories(prev => [...prev, subcategory])
        } else {
          const { data, error } = await supabase.from('subcategories').insert({ category_id: category.id, name: newProduct.subcategory }).select().single()
          if (error) throw error
          subcategory = data
          setDbSubcategories(prev => [...prev, subcategory])
        }
      }
    }

    // 3. Look up variant ID (or insert/fetch if not in state)
    let variant = null
    if (newProduct.variant) {
      variant = dbVariants.find(v => v.name === newProduct.variant && v.category_id === category.id && v.subcategory_id === (subcategory?.id || null))
      if (!variant) {
        const { data: existingVar } = await supabase.from('variants').select('*').eq('category_id', category.id).eq('subcategory_id', subcategory?.id || null).eq('name', newProduct.variant).maybeSingle()
        if (existingVar) {
          variant = existingVar
          setDbVariants(prev => [...prev, variant])
        } else {
          const { data, error } = await supabase.from('variants').insert({
            category_id: category.id,
            subcategory_id: subcategory?.id || null,
            name: newProduct.variant
          }).select().single()
          if (error) throw error
          variant = data
          setDbVariants(prev => [...prev, variant])
        }
      }
    }

    const newWeight = parseFloat(newProduct.weight || 0)
    const newQty = parseInt(newProduct.quantity || 0)

    // 4. Check for an existing stock entry with the same characteristics and exact unit weight
    const { data: existingEntries } = await supabase
      .from('stock_entries')
      .select('*')
      .eq('category_id', category.id)
      .eq('subcategory_id', subcategory?.id || null)
      .eq('variant_id', variant?.id || null)
      .eq('detail', newProduct.detail || '')
      .eq('weight', newWeight)

    if (existingEntries && existingEntries.length > 0) {
      // Update existing stock entry quantity (unit weight stays the same)
      const matchedEntry = existingEntries[0]
      const updatedQty = parseInt(matchedEntry.quantity || 0) + newQty

      const { error: updateErr } = await supabase
        .from('stock_entries')
        .update({ quantity: updatedQty })
        .eq('id', matchedEntry.id)

      if (updateErr) throw updateErr
    } else {
      // Insert new stock entry
      const insertData = {
        category_id: category.id,
        subcategory_id: subcategory?.id || null,
        variant_id: variant?.id || null,
        weight: newWeight,
        quantity: newQty,
        detail: newProduct.detail || ''
      }
      if (newProduct.customDate) {
        insertData.created_at = newProduct.customDate
      }
      const { error: stockErr } = await supabase.from('stock_entries').insert(insertData)
      if (stockErr) throw stockErr
    }

    // 5. Create ledger entry of type ADD
    const ledgerData = {
      type: 'ADD',
      category_name: newProduct.category,
      subcategory_name: newProduct.subcategory || null,
      variant_name: newProduct.variant || null,
      weight: newWeight * newQty // Log the total weight added in ledger
    }
    if (newProduct.customDate) {
      ledgerData.created_at = newProduct.customDate
    }
    const { error: ledgerErr } = await supabase.from('ledger').insert(ledgerData)
    if (ledgerErr) throw ledgerErr
  }

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('stock_entries').delete().eq('id', id)
    if (error) console.error("Error deleting product:", error)
  }

  const clearAllStockData = async () => {
    if (window.confirm('அனைத்து பழைய/டெமோ இருப்புத் தரவுகளையும் நீக்க வேண்டுமா? (Are you sure you want to clear all stock data?)')) {
      const { error } = await supabase.from('stock_entries').delete().gt('id', 0)
      if (!error) {
        alert('அனைத்து இருப்புத் தரவுகளும் வெற்றிகரமாக நீக்கப்பட்டன! (All stock entries cleared successfully)')
        loadData()
      } else {
        alert('பிழை: ' + error.message)
      }
    }
  }

  const updateProduct = async (id, updates) => {
    const dbUpdates = {}
    if (updates.weight !== undefined) dbUpdates.weight = parseFloat(updates.weight)
    if (updates.quantity !== undefined) dbUpdates.quantity = parseInt(updates.quantity)
    if (updates.detail !== undefined) dbUpdates.detail = updates.detail

    const { error } = await supabase.from('stock_entries').update(dbUpdates).eq('id', id)
    if (error) console.error("Error updating product:", error)
  }

  const addBuyback = async (buyback) => {
    const { error } = await supabase.from('purchases').insert({
      supplier_name: buyback.customerName || 'Old Gold/Silver Buyback',
      category: 'Old Item',
      variant: buyback.itemName,
      weight: buyback.weight,
      quantity: 1,
      rate: buyback.weight > 0 ? (buyback.amount / buyback.weight) : 0,
      amount: buyback.amount,
      detail: buyback.customerPhone ? `Ph: ${buyback.customerPhone} ${buyback.detail ? `· ${buyback.detail}` : ''}` : (buyback.detail || ''),
      date: buyback.date
    })
    if (error) throw error
  }

  const deleteBuyback = async (id) => {
    const { error } = await supabase.from('purchases').delete().eq('id', id)
    if (error) console.error("Error deleting buyback:", error)
  }

  // ── Sales (Process sale, deduct stock, log history) ───────────────────────
  const processSale = async (customerName, mobile, cartItems, customDate, goldRate = '', silverRate = '', oldSilverAmount = '', oldGoldAmount = '') => {
    const billId = `IDH-${Date.now()}`
    const date = customDate || new Date().toISOString()

    for (const item of cartItems) {
      // 1. Fetch current stock entry to ensure it exists and has sufficient balance
      const { data: stock, error: fetchErr } = await supabase
        .from('stock_entries')
        .select('*')
        .eq('id', item.productId)
        .single()

      if (fetchErr || !stock) {
        throw new Error(`பொருள் இருப்பில் இல்லை (Item not found in stock)`)
      }

      const isKodi = (stock.category === 'கொடி' || item.category === 'கொடி')
      let newQty = 0
      let newWeight = 0

      if (isKodi) {
        if (parseFloat(stock.weight || 0) < (parseFloat(item.weight) || 0) - 0.0001) {
          throw new Error(`போதுமான எடை இல்லை (Insufficient weight in Kodi Roll)`)
        }
        newWeight = Math.max(0, parseFloat(stock.weight || 0) - (parseFloat(item.weight) || 0))
        newQty = newWeight > 0.0001 ? 1 : 0
      } else {
        if (parseInt(stock.quantity || 0) < item.quantity) {
          throw new Error(`போதுமான எண்ணிக்கை இல்லை (Insufficient quantity)`)
        }
        newQty = Math.max(0, parseInt(stock.quantity || 0) - (item.quantity || 0))
        newWeight = newQty > 0 ? Math.max(0, parseFloat(stock.weight || 0) - (parseFloat(item.weight) || 0)) : 0
      }

      const { error: updateErr } = await supabase
        .from('stock_entries')
        .update({ weight: newWeight, quantity: newQty })
        .eq('id', item.productId)

      if (updateErr) throw updateErr

      // 3. Create sales_entries record
      const { error: salesEntryErr } = await supabase
        .from('sales_entries')
        .insert({
          category_id: stock.category_id,
          subcategory_id: stock.subcategory_id,
          variant_id: stock.variant_id,
          weight: item.weight,
          quantity: item.quantity,
          detail: item.detail || '',
          created_at: date
        })
      if (salesEntryErr) throw salesEntryErr

      // 4. Create ledger record with type SELL
      const { error: ledgerErr } = await supabase
        .from('ledger')
        .insert({
          type: 'SELL',
          category_name: item.category,
          subcategory_name: item.subcategory || null,
          variant_name: item.variant || null,
          weight: item.weight,
          created_at: date
        })
      if (ledgerErr) throw ledgerErr

      // 5. Store in sales history (Sales Module)
      const { error: saleHistoryErr } = await supabase
        .from('sales')
        .insert({
          customer_name: customerName || 'Walk-in',
          mobile: mobile || '',
          category: item.category,
          subcategory: item.subcategory || null,
          variant: item.variant || null,
          detail: item.detail || '',
          weight: item.weight,
          quantity: item.quantity,
          rate: item.pricePerGram,
          discount_amount: item.discountAmount || 0,
          amount: item.total,
          bill_id: billId,
          date: date
        })
      if (saleHistoryErr) throw saleHistoryErr
    }

    await loadData()

    return { id: billId, customerName, mobile, items: cartItems, date, goldRate, silverRate, oldSilverAmount, oldGoldAmount }
  }

  const deleteSale = async (id) => {
    const { error } = await supabase.from('sales').delete().eq('id', id)
    if (error) {
      console.error("Error deleting sale:", error)
      alert("விற்பனைப் பதிவை நீக்குவதில் பிழை: " + error.message)
    } else {
      setSoldItems(prev => prev.filter(item => item.id !== id))
    }
  }

  // ── Auth gates ─────────────────────────────────────────────────────────────
  if (!user) {
    if (showSignup) return <Signup onBack={() => setShowSignup(false)} onSignupSuccess={() => setShowSignup(false)} />
    return <Login onLogin={setUser} onShowSignup={() => setShowSignup(true)} />
  }

  // ── Pages ──────────────────────────────────────────────────────────────────
  const pages = {
    dashboard: <Dashboard      products={products}   sales={soldItems}  setActiveTab={setActiveTab} />,
    stock:     <StockDashboard products={products}   onDelete={deleteProduct} onClearAllStock={clearAllStockData} role={user?.role} />,
    add:       <AddStock       onAddProduct={addProduct} />,
    sell:      <SellDashboard  products={products}   processSale={processSale} />,
    sold:        <SoldItems      soldItems={soldItems} onDeleteSale={deleteSale} />,
    old_buyback: <OldBuyback     buybacks={buybacks}   onAddBuyback={addBuyback} onDeleteBuyback={deleteBuyback} />,
    reports:     <Reports        products={products}   soldItems={soldItems} role={user?.role} deleteProduct={deleteProduct} />
  }

  const currentPage = pages[activeTab] || pages.dashboard

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={user?.role || 'admin'}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="app-content">
        <Header
          username={user?.name || 'User'}
          onLogout={handleLogout}
          onMenuClick={() => setIsSidebarOpen(true)}
          onRefresh={loadData}
        />
        <main className="container animate-fade-in">
          {currentPage}
        </main>
      </div>
    </div>
  )
}
