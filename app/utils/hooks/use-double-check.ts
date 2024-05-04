/**
 * Implementation based on github.com/epicweb-dev/epic-stack
 */
import { useState } from 'react'
import { callAll } from '#app/utils/misc'

export function useDoubleCheck() {
  const [doubleCheck, setDoubleCheck] = useState(false)

  function getButtonProps(props?: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const onBlur: React.ButtonHTMLAttributes<HTMLButtonElement>['onBlur'] = () =>
      setDoubleCheck(false)

    const onClick: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'] = doubleCheck
      ? undefined
      : (e) => {
          e.preventDefault()
          setDoubleCheck(true)
        }

    const onKeyUp: React.ButtonHTMLAttributes<HTMLButtonElement>['onKeyUp'] = (e) => {
      if (e.key === 'Escape') {
        setDoubleCheck(false)
      }
    }

    return {
      ...props,
      onBlur: callAll(onBlur, props?.onBlur),
      onClick: callAll(onClick, props?.onClick),
      onKeyUp: callAll(onKeyUp, props?.onKeyUp),
    }
  }

  return { doubleCheck, getButtonProps }
}
