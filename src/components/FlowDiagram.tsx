/*
 * An animated flow diagram. Nodes sit on a grid; edges are drawn in the
 * order the block lists them, each one tracing its line, then lighting the
 * node it reaches. It plays once, on the shared timeline, the first time it
 * scrolls into view. Calm mode shows it finished.
 *
 * It renders twice: the authored grid, and a single column in edge order
 * for narrow screens, where the grid would shrink its text below reading
 * size. CSS shows one; the hidden one never scrolls into view, so never plays.
 */
import { useEffect, useId, useRef } from 'react'
import type { FlowBlock, FlowNode } from '~/content/schema'
import { clock } from '~/motion/clock'
import { ease, timeline } from '~/motion/timeline'

const COL = 246
const W = 190
const H = 64
const PAD = 16

type Layout = 'grid' | 'column'

interface Point {
  x: number
  y: number
}

/** Node positions for a layout: the authored grid, or one column in edge order. */
function place(block: FlowBlock, layout: Layout) {
  if (layout === 'grid')
    return {
      row: 120,
      cells: new Map(
        block.nodes.map((n) => [n.id, { col: n.col, row: n.row }]),
      ),
    }
  const order = [
    ...new Set([
      ...block.edges.flatMap(([a, b]) => [a, b]),
      ...block.nodes.map((n) => n.id),
    ]),
  ]
  const ids = new Set(block.nodes.map((n) => n.id))
  return {
    row: 96,
    cells: new Map(
      order
        .filter((id) => ids.has(id))
        .map((id, i) => [id, { col: 0, row: i }]),
    ),
  }
}

/** The point where the line from a box's centre toward `to` leaves the box. */
function exit(from: Point, to: Point) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const sx = dx === 0 ? Infinity : W / 2 / Math.abs(dx)
  const sy = dy === 0 ? Infinity : H / 2 / Math.abs(dy)
  const s = Math.min(sx, sy)
  return { x: from.x + dx * s, y: from.y + dy * s }
}

export function FlowSvg({
  block,
  layout,
  decorative = false,
}: {
  block: FlowBlock
  layout: Layout
  /** A picture beside words that already say it, e.g. a card face. */
  decorative?: boolean
}) {
  const ref = useRef<SVGSVGElement>(null)
  const titleId = useId()
  const arrowId = useId()
  const byId = new Map<string, FlowNode>(block.nodes.map((n) => [n.id, n]))
  const { row: step, cells } = place(block, layout)
  const cellList = [...cells.values()]
  const cols = Math.max(...cellList.map((c) => c.col)) + 1
  const rows = Math.max(...cellList.map((c) => c.row)) + 1
  const width = PAD * 2 + (cols - 1) * COL + W
  const height = PAD * 2 + (rows - 1) * step + H
  const corner = (id: string) => {
    const c = cells.get(id)!
    return { x: PAD + c.col * COL, y: PAD + c.row * step }
  }
  const centre = (id: string) => {
    const c = corner(id)
    return { x: c.x + W / 2, y: c.y + H / 2 }
  }

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
    <svg
      ref={ref}
      className={`flow-${layout}`}
      viewBox={`0 0 ${width} ${height}`}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-labelledby={decorative ? undefined : titleId}
    >
      {!decorative && <title id={titleId}>{description}</title>}
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
        const a = centre(from)
        const b = centre(to)
        const p = exit(a, b)
        const q = exit(b, a)
        // A vertical edge carries its label beside the line, not on it.
        const upright = Math.abs(p.x - q.x) < 1
        return (
          <g key={`${from}-${to}`} data-edge-group>
            <path
              data-edge
              d={`M${p.x},${p.y} L${q.x},${q.y}`}
              className="flow-edge"
              markerEnd={`url(#${arrowId})`}
              data-marker={`url(#${arrowId})`}
            />
            {label && !decorative && (
              <text
                x={upright ? p.x + 10 : (p.x + q.x) / 2}
                y={upright ? (p.y + q.y) / 2 + 4 : (p.y + q.y) / 2 - 8}
                className="flow-edge-label"
                textAnchor={upright ? 'start' : 'middle'}
              >
                {label}
              </text>
            )}
          </g>
        )
      })}
      {block.nodes.map((n) => {
        const { x, y } = corner(n.id)
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
            {n.detail && !decorative && (
              <text x={x + 12} y={y + 46} className="flow-detail">
                {n.detail}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function FlowDiagram({ block }: { block: FlowBlock }) {
  return (
    <figure className="flow" data-enter>
      <FlowSvg block={block} layout="grid" />
      <FlowSvg block={block} layout="column" />
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
