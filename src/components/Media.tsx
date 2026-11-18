import { useEffect, useRef } from 'react'
import type { ProjectMedia } from '~/content'
import { clock } from '~/motion/clock'

/** A slug always makes the same two hues, so an entry with no capture still has a face. */
function hues(seed: string): [number, number] {
  let h = 0
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return [h % 360, (h >> 9) % 360]
}

const sourceType = (src: string) =>
  src.endsWith('.webm')
    ? 'video/webm'
    : src.endsWith('.mp4')
      ? 'video/mp4'
      : undefined

/**
 * A clip plays only while it is on screen, and never in calm mode, where it
 * holds its first frame. A grid of clips no longer runs (and downloads) all
 * at once.
 */
function Clip({ media }: { media: Extract<ProjectMedia, { kind: 'video' }> }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !clock().calm) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.25 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])
  return (
    <video
      ref={ref}
      className="media"
      muted
      loop
      playsInline
      preload="metadata"
      poster={media.poster}
      aria-label={media.alt}
    >
      {media.sources.map((src) => (
        <source key={src} src={src} type={sourceType(src)} />
      ))}
    </video>
  )
}

export function Media({
  media,
  seed,
  label,
}: {
  media: ProjectMedia
  seed: string
  label: string
}) {
  if (media.kind === 'video') return <Clip media={media} />
  if (media.kind === 'image')
    return (
      <img className="media" src={media.src} alt={media.alt} loading="lazy" />
    )
  const [a, b] = hues(seed)
  return (
    <div
      className="media media-generated"
      role="img"
      aria-label={`${label}: no capture yet`}
      style={{ '--hue-a': a, '--hue-b': b } as React.CSSProperties}
    />
  )
}
