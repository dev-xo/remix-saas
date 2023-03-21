import { useEffect, useRef } from 'react'

/**
 * Declarative interval.
 * More info: https://overreacted.io/making-setinterval-declarative-with-react-hooks
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current?.()
    }

    if (delay) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
