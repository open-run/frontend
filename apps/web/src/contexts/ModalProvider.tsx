'use client'

import { Fragment, ReactElement, ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ROOT_PORTAL_ID } from '@constants/layout'

type Modal = {
  key: string
  component: ReactElement
}

type ModalContextValue = {
  showModal: (modal: Modal) => void
  closeModal: (key: string) => void
  closeAllModals: () => void
}

const Context = createContext<ModalContextValue | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<Modal[]>([])

  const $portal_root = typeof window === 'undefined' ? null : document.getElementById(ROOT_PORTAL_ID)

  const showModal = useCallback((modal: Modal) => {
    setModals((prev) => [...prev, modal])
  }, [])

  const closeModal = useCallback((key: string) => {
    setModals((prev) => prev.filter((modal) => modal.key !== key))
  }, [])

  const closeAllModals = useCallback(() => {
    setModals([])
  }, [])

  const values = useMemo(() => ({ showModal, closeModal, closeAllModals }), [showModal, closeModal, closeAllModals])

  return (
    <Context.Provider value={values}>
      {children}
      {$portal_root != null &&
        createPortal(
          modals.map(({ key, component }) => <Fragment key={key}>{component}</Fragment>),
          $portal_root,
        )}
    </Context.Provider>
  )
}

export function useModal() {
  const values = useContext(Context)

  if (values == null) {
    throw new Error('ModalContext 내부에서 사용해주세요')
  }

  return values
}
