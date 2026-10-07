import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { progress, type Progress } from './store'

const serverSnapshot: Progress = { version: 1, found: {} }

export function useProgress(): Progress {
  const store = progress()
  return useSyncExternalStore(store.subscribe, store.get, () => serverSnapshot)
}

/** Marks a discovery when the component mounts (a page visit). */
export function useDiscover(id: string | null) {
  useEffect(() => {
    if (id) progress().discover(id)
  }, [id])
}

export function useDiscoverCallback() {
  return useCallback((id: string) => progress().discover(id), [])
}
