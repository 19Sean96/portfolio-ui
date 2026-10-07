/*
 * Saved progress: what this visitor has found. Each discovery is an id with
 * the time it was first seen. It lives in localStorage on this browser only,
 * and the site works the same when storage is blocked; the count just starts
 * at zero each visit.
 *
 * Ids are namespaced: work:<slug>, lab:<id>, egg:<name>, and lab pieces add
 * their own (audio-field:mic).
 */

export const STORAGE_KEY = 'sa.progress.v1'

export interface Progress {
  version: 1
  found: Record<string, number>
}

export interface KeyValue {
  get(key: string): string | null
  set(key: string, value: string): void
}

const empty: Progress = { version: 1, found: {} }

export interface ProgressStore {
  get(): Progress
  has(id: string): boolean
  /** Records a discovery. Answers true the first time only. */
  discover(id: string, now?: number): boolean
  reset(): void
  subscribe(fn: () => void): () => void
}

function parse(raw: string | null): Progress {
  if (!raw) return empty
  try {
    const value = JSON.parse(raw) as Partial<Progress>
    if (value.version !== 1 || typeof value.found !== 'object' || !value.found)
      return empty
    return { version: 1, found: { ...value.found } }
  } catch {
    return empty
  }
}

export function createProgressStore(storage: KeyValue | null): ProgressStore {
  let state = parse(safe(() => storage?.get(STORAGE_KEY) ?? null))
  const listeners = new Set<() => void>()

  function commit(next: Progress) {
    state = next
    safe(() => storage?.set(STORAGE_KEY, JSON.stringify(next)))
    for (const fn of listeners) fn()
  }

  return {
    get: () => state,
    has: (id) => id in state.found,
    discover(id, now = Date.now()) {
      if (id in state.found) return false
      commit({ version: 1, found: { ...state.found, [id]: now } })
      return true
    },
    reset: () => commit(empty),
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}

function safe<T>(fn: () => T): T | null {
  try {
    return fn()
  } catch {
    return null
  }
}

let shared: ProgressStore | null = null

/** The browser's store; on the server, an empty one that saves nothing. */
export function progress(): ProgressStore {
  if (shared) return shared
  if (typeof window === 'undefined') return createProgressStore(null)
  const storage = safe<KeyValue>(() => {
    const ls = window.localStorage
    return {
      get: (k) => ls.getItem(k),
      set: (k, v) => ls.setItem(k, v),
    }
  })
  shared = createProgressStore(storage)
  // Another tab found something: pick it up.
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && shared) {
      const next = parse(e.newValue)
      for (const id of Object.keys(next.found))
        shared.discover(id, next.found[id])
    }
  })
  return shared
}
