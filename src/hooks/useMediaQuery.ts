import { useEffect, useState } from 'react'

/** Tracks a CSS media query from JS, for behaviour that CSS alone can't express. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    setMatches(list.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** The desktop breakpoint, matching the `min-width: 1280px` used across the CSS. */
export const DESKTOP_QUERY = '(min-width: 1280px)'
