/*
 * An animated flow diagram. Nodes sit on a grid; edges are drawn in the
 * order the block lists them, each one tracing its line, then lighting the
 * node it reaches. It plays once, on the shared timeline, the first time it
 * scrolls into view. Calm mode shows it finished.
 */
import { useEffect, useId, useRef } from 'react'
import type { FlowBlock } from '~/content/schema'
import { clock } from '~/motion/clock'
import { ease, timeline } from '~/motion/timeline'

const COL = 215
const ROW = 120
const W = 175
const H = 64
const PAD = 16

function centre(n: { col: number; row: number }) {
  return { x: PAD + n.col * COL + W / 2, y: PAD + n.row * ROW + H / 2 }
}

/** The point where the line from a box's centre toward `to` leaves the box. */
function exit(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const sx = dx === 0 ? Infinity : W / 2 / Math.abs(dx)
  const sy = dy === 0 ? Infinity : H / 2 / Math.abs(dy)
  const s = Math.min(sx, sy)
  return { x: from.x + dx * s, y: from.y + dy * s }
}

export function FlowDiagram({ block }: { block: FlowBlock }) {
  const ref = useRef<SVGSVGElement>(null)
  const titleId = useId()
  const arrowId = useId()
  const byId = new Map(block.nodes.map((n) => [n.id, n]))
  const cols = Math.max(...block.nodes.map((n) => n.col)) + 1
  const rows = Math.max(...block.nodes.map((n) => n.row)) + 1
  const width = PAD * 2 + (cols - 1) * COL + W
  const height = PAD * 2 + (rows - 1) * ROW + H

  // One string: React wants a <title> with a single text child.
  const description = `${block.title}: ${block.edges
    .map(([a, b]) => `${byId.get(a)?.label} to ${byId.get(b)?.label}`)
    .join(', ')}`

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const nodes = new Map(
      [...svg.querySelectorAll<SVGGElement>('[data-node]')].map((g) => [
        g.dataset.node!,
        g,
      ]),
    )
    const edges = [...svg.querySelectorAll<SVGPathElement>('[data-edge]')]
    const labels = [
      ...svg.querySelectorAll<SVGGElement>('[data-edge-group]'),
    ].map((g) => g.querySelector<SVGTextElement>('text'))
    const tl = timeline(clock())
    const lit = new Set<string>()
    const light = (id: string, at: number) => {
      if (lit.has(id)) return
      lit.add(id)
      const g = nodes.get(id)
      if (g)
        tl.add({
          at,
          duration: 0.4,
          ease: ease.outBack,
          update: (p) => g.style.setProperty('--p', String(p)),
        })
    }
    let at = 0
    block.edges.forEach(([from, to], i) => {
      light(from, at)
      const path = edges[i]!
      const label = labels[i]
      const length = path.getTotalLength()
      path.style.strokeDasharray = `${length}`
      tl.add({
        at: at + 0.2,
        duration: 0.4,
        ease: ease.inOutCubic,
        update: (p) => {
          path.style.strokeDashoffset = String(length * (1 - p))
          if (label) label.style.opacity = String(p)
          // The arrowhead is a marker, which a dash cannot hide; it lands
          // with the end of the line.
          if (p >= 0.95) path.setAttribute('marker-end', path.dataset.marker!)
          else path.removeAttribute('marker-end')
        },
      })
      at += 0.42
      light(to, at)
    })
    for (const id of nodes.keys()) light(id, at)
    tl.seek(0)

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          void tl.play()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(svg)
    return () => {
      io.disconnect()
      tl.stop()
    }
  }, [block])

  return (
    <figure className="flow" data-enter>
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>{description}</title>
        <defs>
          <marker
            id={arrowId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" className="flow-arrow" />
          </marker>
        </defs>
        {block.edges.map(([from, to, label]) => {
          const a = centre(byId.get(from)!)
          const b = centre(byId.get(to)!)
          const p = exit(a, b)
          const q = exit(b, a)
          return (
            <g key={`${from}-${to}`} data-edge-group>
              <path
                data-edge
                d={`M${p.x},${p.y} L${q.x},${q.y}`}
                className="flow-edge"
                markerEnd={`url(#${arrowId})`}
                data-marker={`url(#${arrowId})`}
              />
              {label && (
                <text
                  x={(p.x + q.x) / 2}
                  y={(p.y + q.y) / 2 - 8}
                  className="flow-edge-label"
                  textAnchor="middle"
                >
                  {label}
                </text>
              )}
            </g>
          )
        })}
        {block.nodes.map((n) => {
          const x = PAD + n.col * COL
          const y = PAD + n.row * ROW
          return (
            <g
              key={n.id}
              data-node={n.id}
              className={`flow-node flow-${n.actor ?? 'system'}`}
            >
              <rect x={x} y={y} width={W} height={H} rx={10} />
              <text x={x + 12} y={y + 26} className="flow-label">
                {n.label}
              </text>
              {n.detail && (
                <text x={x + 12} y={y + 46} className="flow-detail">
                  {n.detail}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <figcaption>
        <strong>{block.title}.</strong> {block.caption}
        <span className="flow-key">
          <span className="flow-key-person">person</span>
          <span className="flow-key-agent">agent</span>
          <span className="flow-key-system">system</span>
        </span>
      </figcaption>
    </figure>
  )
}
