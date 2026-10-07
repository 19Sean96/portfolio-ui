/*
 * Mounts the one canvas behind every page and loads the stage after
 * hydration, so three.js stays out of the server render and the first
 * paint. Pages call useStageScene; the newest call wins.
 *
 * Without WebGL 2 the canvas never starts and the CSS backdrop under it
 * (styles/global.css, .stage-backdrop) is what shows.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { clock } from '~/motion/clock'
import type { Stage } from './stage'
import type { SceneLoader } from './types'

interface StageApi {
  show(loader: SceneLoader): Promise<void>
}

const StageContext = createContext<StageApi | null>(null)

export function StageProvider({ children }: { children: ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const stage = useRef<Stage | null>(null)
  const pending = useRef<SceneLoader | null>(null)

  useEffect(() => {
    const el = canvas.current
    if (!el || !document.createElement('canvas').getContext('webgl2')) return
    let disposed = false
    void import('./stage').then(({ createStage }) => {
      if (disposed) return
      stage.current = createStage(el, clock())
      el.dataset.ready = 'true'
      if (pending.current) void stage.current.show(pending.current)
    })
    return () => {
      disposed = true
      stage.current?.dispose()
      stage.current = null
    }
  }, [])

  const api = useMemo<StageApi>(
    () => ({
      show(loader) {
        pending.current = loader
        return stage.current ? stage.current.show(loader) : Promise.resolve()
      },
    }),
    [],
  )

  return (
    <StageContext.Provider value={api}>
      <div className="stage-backdrop" aria-hidden="true" />
      <canvas ref={canvas} className="stage" aria-hidden="true" />
      {children}
    </StageContext.Provider>
  )
}

export function useStage(): StageApi {
  const api = useContext(StageContext)
  if (!api) throw new Error('useStage needs StageProvider above it.')
  return api
}

/** Shows a scene while the calling page is mounted. Pass a module-level loader. */
export function useStageScene(loader: SceneLoader | null) {
  const stage = useStage()
  useEffect(() => {
    if (loader) void stage.show(loader)
  }, [stage, loader])
}

export const scenes = {
  drift: () => import('./scenes/drift'),
  quiet: () => import('./scenes/quiet'),
} satisfies Record<string, SceneLoader>
