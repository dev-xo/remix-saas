/**
 * Sonner is a toast library for React.
 * Implementation based on github.com/epicweb-dev/epic-stack
 */
import type { Toast } from '#app/utils/toast.server'
import { useEffect } from 'react'
import { toast as showToast } from 'sonner'

export function useToast(toast?: Toast | null) {
  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        showToast[toast.type](toast.title, {
          id: toast.id,
          description: toast.description,
        })
      }, 0)
    }
  }, [toast])
}
