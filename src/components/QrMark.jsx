const N = 25
const INK = '#10141a'

const inReserved = (x, y) =>
  (x < 8 && y < 8) || (x >= 17 && y < 8) || (x < 8 && y >= 17)

const pseudoRandom = (x, y) => {
  const n = Math.sin((x + 1) * 12.9898 + (y + 1) * 78.233) * 43758.5453
  return n - Math.floor(n)
}

const FINDERS = [
  [0, 0],
  [18, 0],
  [0, 18],
]

/**
 * A decorative, deterministic QR-like mark. Not a real scannable code.
 */
export default function QrMark({ className = '', bg = '#f8f2e4' }) {
  const cells = []

  for (let y = 0; y < N; y += 1) {
    for (let x = 0; x < N; x += 1) {
      if (inReserved(x, y)) continue
      if (pseudoRandom(x, y) > 0.53) cells.push([x, y])
    }
  }

  return (
    <svg
      viewBox="0 0 29 29"
      className={className}
      aria-hidden="true"
      role="presentation"
      shapeRendering="crispEdges"
    >
      <rect width="29" height="29" rx="2.8" fill={bg} />
      <g transform="translate(2 2)">
        {cells.map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="1"
            height="1"
            fill={INK}
          />
        ))}

        {FINDERS.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="7" height="7" rx="0.7" fill={INK} />
            <rect x={x + 1} y={y + 1} width="5" height="5" fill={bg} />
            <rect x={x + 2} y={y + 2} width="3" height="3" fill={INK} />
          </g>
        ))}

        <rect x="10.5" y="10.5" width="4" height="4" rx="1" fill={bg} />
        <rect x="11.5" y="11.5" width="2" height="2" rx="0.4" fill={INK} />
      </g>
    </svg>
  )
}
