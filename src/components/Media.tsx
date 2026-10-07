import type { ProjectMedia } from '~/content'

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

export function Media({
  media,
  seed,
  label,
}: {
  media: ProjectMedia
  seed: string
  label: string
}) {
  if (media.kind === 'video')
    return (
      <video
        className="media"
        autoPlay
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
