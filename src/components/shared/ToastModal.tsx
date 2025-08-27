import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { useAppStore } from '@store/app'
import { CheckIcon } from '@icons/check'
import { BrokenXIcon } from '@icons/x'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'

export default function ToastModal({ mode, message }: { mode: 'success' | 'error'; message: string }) {
  const { isApp } = useAppStore()
  const [isOpen, setIsOpen] = useState(true)
  const { closeModal } = useModal()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleExitComplete = () => {
    closeModal(MODAL_KEY.TOAST)
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isOpen && (
        <motion.div
          className={clsx(
            'fixed left-0 right-0 z-modal mx-auto h-[56px] rounded-16 px-16',
            isApp ? 'bottom-40' : 'bottom-24',
          )}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}>
          <div className='mx-auto flex h-[56px] max-w-[328px] items-center justify-between rounded-16 bg-gray-darker/80 px-16 backdrop-blur-[10px]'>
            <div className='flex items-center gap-8'>
              <div className={clsx('h-16 w-16 rounded-full', mode === 'success' ? 'bg-secondary' : 'bg-pink')}>
                {mode === 'success' ? (
                  <CheckIcon size={16} color={colors.gray.darker} />
                ) : (
                  <BrokenXIcon size={16} color={colors.gray.darker} />
                )}
              </div>
              <span className='text-16 font-bold text-white'>{message}</span>
            </div>
            <button onClick={handleExitComplete}>
              <BrokenXIcon size={24} color={colors.white} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
