import { describe, expect, it } from 'vitest'
import { STORAGE_KEY, createProgressStore, type KeyValue } from './store'

function memory(
  initial: Record<string, string> = {},
): KeyValue & { data: Record<string, string> } {
  const data = { ...initial }
  return {
    data,
    get: (k) => data[k] ?? null,
    set: (k, v) => void (data[k] = v),
  }
}

describe('progress store', () => {
  it('records a discovery once and saves it', () => {
    const kv = memory()
    const store = createProgressStore(kv)
    expect(store.discover('lab:audio-field', 5)).toBe(true)
    expect(store.discover('lab:audio-field', 9)).toBe(false)
    expect(JSON.parse(kv.data[STORAGE_KEY]!).found).toEqual({
      'lab:audio-field': 5,
    })
  })

  it('reads what an earlier visit saved', () => {
    const kv = memory({
      [STORAGE_KEY]: JSON.stringify({ version: 1, found: { 'work:picki': 1 } }),
    })
    expect(createProgressStore(kv).has('work:picki')).toBe(true)
  })

  it('starts empty on bad data or blocked storage', () => {
    expect(
      createProgressStore(memory({ [STORAGE_KEY]: '{nope' })).get().found,
    ).toEqual({})
    const blocked: KeyValue = {
      get: () => {
        throw new Error('blocked')
      },
      set: () => {
        throw new Error('blocked')
      },
    }
    const store = createProgressStore(blocked)
    expect(store.discover('egg:konami')).toBe(true)
    expect(store.has('egg:konami')).toBe(true)
  })

  it('tells listeners', () => {
    const store = createProgressStore(null)
    let calls = 0
    store.subscribe(() => calls++)
    store.discover('a')
    store.reset()
    expect(calls).toBe(2)
  })
})
