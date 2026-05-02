import { motion } from 'framer-motion'
import { useModal } from '@contexts/ModalProvider'
import { MODAL_KEY } from '@constants/modal'
import { Dimmed, Popup } from './Modal'

export default function AlertModal({ title, description }: { title: string; description: string }) {
  const { closeModal } = useModal()
  return (
    <Dimmed onClick={() => closeModal(MODAL_KEY.ALERT)}>
      <motion.section
        className='h-full w-full'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <Popup>
          <div className='relative flex w-full flex-col items-center justify-between p-16 pt-40'>
            <div className='mb-20 flex flex-col gap-8'>
              <h5 className='text-center text-20 font-bold text-black-darken'>{title}</h5>
              <p className='text-center text-14 text-black-darken'>{description}</p>
            </div>
            <button
              className='h-56 w-full rounded-8 bg-white text-16 font-bold text-black-darken'
              onClick={() => closeModal(MODAL_KEY.ALERT)}>
              확인
            </button>
          </div>
        </Popup>
      </motion.section>
    </Dimmed>
  )
}
