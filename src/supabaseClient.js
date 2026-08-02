/**
 * இதயம் ஜூவல்லரி — Idhayam Jewellery
 *
 * Supabase connection is DISABLED for this deployment.
 * This system runs in standalone / offline mode.
 * No data is synced to or from any external database.
 *
 * All Supabase method calls (.from, .select, .insert, etc.)
 * return safe empty responses so the app never crashes.
 */

const noop = () => Promise.resolve({ data: null, error: null })
const noopSingle = () => Promise.resolve({ data: null, error: null })

const chainable = () => {
  const obj = {
    select:   () => obj,
    insert:   () => obj,
    update:   () => obj,
    delete:   () => obj,
    upsert:   () => obj,
    eq:       () => obj,
    neq:      () => obj,
    gt:       () => obj,
    gte:      () => obj,
    lt:       () => obj,
    lte:      () => obj,
    like:     () => obj,
    ilike:    () => obj,
    in:       () => obj,
    order:    () => obj,
    limit:    () => obj,
    range:    () => obj,
    single:   noopSingle,
    then:     (resolve) => resolve({ data: [], error: null }),
  }
  return obj
}

const noopChannel = {
  on:        () => noopChannel,
  subscribe: () => noopChannel,
}

export const supabase = {
  /* Auth — demo bypass in Login.jsx handles auth, so these are safe no-ops */
  auth: {
    getSession:          () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange:   (_event, _cb) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword:  () => Promise.resolve({ data: null, error: { message: 'Standalone mode — use demo login.' } }),
    signUp:              () => Promise.resolve({ data: null, error: { message: 'Standalone mode — registration disabled.' } }),
    signOut:             () => Promise.resolve({ error: null }),
  },

  /* Database — all queries return empty data silently */
  from: (_table) => chainable(),

  /* Realtime — no-op channel so subscription code doesn't crash */
  channel:       (_name) => noopChannel,
  removeChannel: (_ch)   => {},
}
