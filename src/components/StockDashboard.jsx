import React, { useState } from 'react'
import { Trash2, Search, Filter } from 'lucide-react'

const StockDashboard = ({ products = [], onDelete, onClearAllStock, role = 'admin' }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [selectedDetail, setSelectedDetail] = useState('')

  const availableProducts = products.filter(p => (parseFloat(p.weight) || 0) > 0 && (parseInt(p.quantity) || 0) > 0)

  // Get unique filter options
  const categories = [...new Set(availableProducts.map(p => p.category).filter(Boolean))]

  const subcategories = [...new Set(availableProducts
    .filter(p => !selectedCategory || p.category === selectedCategory)
    .map(p => p.subcategory)
    .filter(Boolean))]

  const detailsList = [...new Set(availableProducts
    .filter(p => (!selectedCategory || p.category === selectedCategory) && (!selectedSubcategory || p.subcategory === selectedSubcategory))
    .map(p => p.detail)
    .filter(Boolean))]

  // Filter products based on search query and selected filters
  const filteredProducts = availableProducts.filter(p => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true
    const matchesSubcategory = selectedSubcategory ? p.subcategory === selectedSubcategory : true
    const matchesDetail = selectedDetail ? p.detail === selectedDetail : true
    
    const term = searchQuery.toLowerCase()
    const matchesSearch = term ? (
      (p.category || '').toLowerCase().includes(term) ||
      (p.subcategory || '').toLowerCase().includes(term) ||
      (p.variant || '').toLowerCase().includes(term) ||
      (p.detail || '').toLowerCase().includes(term)
    ) : true

    return matchesCategory && matchesSubcategory && matchesDetail && matchesSearch
  })

  // Calculations for stats card
  const totalWeight = filteredProducts.reduce((s, p) => s + ((p.quantity || 0) * (parseFloat(p.weight) || 0)), 0)
  const totalQuantity = filteredProducts.reduce((s, p) => s + (p.quantity || 0), 0)

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-16" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0 }}>இருப்பு விவரங்கள் (Stock List)</h1>
          <p className="text-sub" style={{ marginTop: '4px' }}>
            Live Stock · {filteredProducts.length} பதிவுகள் · மொத்த எண்ணிக்கை {totalQuantity} pcs · மொத்த எடை {totalWeight.toFixed(3)}g
          </p>
        </div>
        {role === 'admin' && onClearAllStock && (
          <button
            className="btn"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}
            onClick={onClearAllStock}
            title="அனைத்து பழைய இருப்பு தரவுகளையும் நீக்கு"
          >
            <Trash2 size={16} /> அனைத்து இருப்பையும் நீக்கு (Clear All Stock)
          </button>
        )}
      </div>

      {/* Search and Filter Card */}
      <div className="card mb-16" style={{ padding: '16px' }}>
        <div className="search-filter-belt" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div className="search-input-wrap" style={{ flex: '1 1 240px' }}>
            <span className="search-icon">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="மாடல், அளவு அல்லது விவரம் மூலம் தேடுங்கள்..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-select-wrap" style={{ flex: '1 1 180px' }}>
            <span className="filter-icon">
              <Filter size={16} />
            </span>
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setSelectedSubcategory(''); setSelectedDetail(''); }}
              className="filter-select"
            >
              <option value="">— பிரிவு (All Categories) —</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {subcategories.length > 0 && (
            <div className="filter-select-wrap" style={{ flex: '1 1 180px' }}>
              <span className="filter-icon">
                <Filter size={16} />
              </span>
              <select
                value={selectedSubcategory}
                onChange={e => { setSelectedSubcategory(e.target.value); setSelectedDetail(''); }}
                className="filter-select"
              >
                <option value="">— துணைப் பிரிவு (All Subcategories) —</option>
                {subcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          {detailsList.length > 0 && (
            <div className="filter-select-wrap" style={{ flex: '1 1 180px' }}>
              <span className="filter-icon">
                <Filter size={16} />
              </span>
              <select
                value={selectedDetail}
                onChange={e => setSelectedDetail(e.target.value)}
                className="filter-select"
              >
                <option value="">— விவரம் (All Details) —</option>
                {detailsList.map(det => (
                  <option key={det} value={det}>{det}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-sub)' }}>
          தகவல் இல்லை — No matching stock found.
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <div className="table-wrap" style={{ maxHeight: '550px', overflowY: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th className="hide-mobile" style={{ width: '60px', textAlign: 'center' }}>வ.எண்</th>
                  <th className="hide-mobile">
                    பிரிவு<br />
                    <span style={{ fontSize: '10px', opacity: 0.7, fontWeight: 'normal', textTransform: 'none' }}>Category</span>
                  </th>
                  <th>
                    மாடல் / அளவு<br />
                    <span style={{ fontSize: '10px', opacity: 0.7, fontWeight: 'normal', textTransform: 'none' }}>Variant / Size</span>
                  </th>
                  <th className="hide-mobile">
                    விவரம்<br />
                    <span style={{ fontSize: '10px', opacity: 0.7, fontWeight: 'normal', textTransform: 'none' }}>Detail</span>
                  </th>
                  <th style={{ textAlign: 'right' }}>
                    எடை<br />
                    <span style={{ fontSize: '10px', opacity: 0.7, fontWeight: 'normal', textTransform: 'none' }}>Weight g</span>
                  </th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th className="hide-mobile" style={{ textAlign: 'right' }}>
                    மொத்த எடை<br />
                    <span style={{ fontSize: '10px', opacity: 0.7, fontWeight: 'normal', textTransform: 'none' }}>Total g</span>
                  </th>
                  {role === 'admin' && (
                    <th style={{ width: '80px', textAlign: 'center' }}>
                      செயல்<br />
                      <span style={{ fontSize: '10px', opacity: 0.7, fontWeight: 'normal', textTransform: 'none' }}>Action</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item, idx) => {
                  const itemTotalWeight = (item.quantity || 0) * (parseFloat(item.weight) || 0)
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="hide-mobile" style={{ textAlign: 'center', color: 'var(--text-sub)', fontWeight: 500 }}>{idx + 1}</td>
                      <td className="hide-mobile">
                        <span style={{
                          background: 'rgba(212, 175, 55, 0.08)',
                          color: 'var(--gold)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {item.variant || item.subcategory || '—'}
                        <div className="show-mobile" style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 'normal', marginTop: '2px' }}>
                          {item.category}
                        </div>
                        {item.detail && (
                          <div className="show-mobile" style={{ fontSize: '11px', color: 'var(--text-sub)', fontWeight: 'normal', marginTop: '2px' }}>
                            {item.detail}
                          </div>
                        )}
                      </td>
                      <td className="hide-mobile" style={{ color: 'var(--text-sub)' }}>{item.detail || '—'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }}>
                        {parseFloat(item.weight || 0).toFixed(3)}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--gold)' }}>
                        {item.quantity}
                      </td>
                      <td className="hide-mobile" style={{ textAlign: 'right', fontWeight: 700 }}>
                        {itemTotalWeight.toFixed(3)}
                      </td>
                      {role === 'admin' && (
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn btn-danger-ghost"
                            style={{ padding: '6px', minWidth: 'auto' }}
                            onClick={() => window.confirm('இந்த இருப்பை நீக்க வேண்டுமா?') && onDelete(item.id)}
                            title="நீக்கு"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockDashboard
