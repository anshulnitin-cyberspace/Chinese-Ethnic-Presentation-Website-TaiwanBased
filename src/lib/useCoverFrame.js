import { useEffect, useState } from 'react'

const CENTER = { x: 0.5, y: 0.5 }

const computeFrame = (aspect, position = CENTER) => {
  if (typeof window === 'undefined') {
    return { left: 0, top: 0, width: 0, height: 0 }
  }

  const vw = window.innerWidth
  const vh = window.innerHeight
  const viewportAspect = vw / vh

  let width
  let height

  if (viewportAspect > aspect) {
    // Viewport is wider than the image: it fills the width and overflows vertically.
    width = vw
    height = vw / aspect
  } else {
    // Viewport is taller than the image: it fills the height and overflows horizontally.
    height = vh
    width = vh * aspect
  }

  return {
    left: (vw - width) * position.x,
    top: (vh - height) * position.y,
    width,
    height,
  }
}

/**
 * Returns the on-screen rectangle of an object-cover image.
 * Used to pin decorative overlays to features painted into the artwork.
 *
 * `position` mirrors CSS object-position as fractions, e.g. center 45% => { x: 0.5, y: 0.45 }.
 */
export default function useCoverFrame(aspect, position = CENTER) {
  const x = position?.x ?? CENTER.x
  const y = position?.y ?? CENTER.y
  const [frame, setFrame] = useState(() => computeFrame(aspect, { x, y }))

  useEffect(() => {
    let raf = 0

    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setFrame(computeFrame(aspect, { x, y })))
    }

    update()
    window.addEventListener('resize', update)
    window.visualViewport?.addEventListener('resize', update)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
    }
  }, [aspect, x, y])

  return frame
}
