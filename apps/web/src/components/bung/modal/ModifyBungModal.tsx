import { differenceInMinutes } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useModal } from '@contexts/ModalProvider'
import { imageList } from '@store/image'
import { BungInfo } from '@type/bung'
import AlertModal from '@shared/AlertModal'
import HashTag from '@shared/HashTag'
import Input from '@shared/Input'
import LoadingLogo from '@shared/LoadingLogo'
import { BottomSheet, BottomSheetRef, Dimmed } from '@shared/Modal'
import NumberInput from '@shared/NumberInput'
import PrimaryButton from '@shared/PrimaryButton'
import TextArea from '@shared/TextArea'
import { CalendarIcon } from '@icons/calendar'
import { ClockIcon } from '@icons/clock'
import { BrokenXIcon } from '@icons/x'
import { useThumbnailImage } from '@hooks/useThumbnailImage'
import { useModifyBung } from '@apis/v1/bungs/[bungId]/mutation'
import { formatDate } from '@utils/time'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import Button from '../components/Button'
import BungThumbnailPicker from '../components/BungThumbnailPicker'
import FormTitle from '../components/FormTitle'
import HashTagSearch from '../components/HashTagSearch'

type FormValues = {
  bungName: string
  description: string
  memberNumber: string
  hasAfterRun: boolean
  afterRunDescription: string
  hashTags: string[]
  mainImage: string
}

export default function ModifyBungModal({ details }: { details: BungInfo }) {
  const router = useRouter()
  const { showModal, closeModal } = useModal()
  const sheetRef = useRef<BottomSheetRef>(null)
  const handleClose = () => sheetRef.current?.close()
  const { mutate: modifyBung, isPending } = useModifyBung()
  const 참여중인멤버수 = details.memberList.length
  const { nextImage } = useThumbnailImage()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      bungName: details.name,
      description: details.description,
      memberNumber: String(details.memberNumber),
      hasAfterRun: details.hasAfterRun,
      afterRunDescription: details.afterRunDescription,
      hashTags: details.hashtags,
      mainImage: details.mainImage || imageList[0],
    },
  })
  const selectedMainImage = watch('mainImage') || imageList[0]

  const onSubmit = (formData: FormValues) => {
    if (Number(formData.memberNumber) < 참여중인멤버수) {
      showModal({
        key: MODAL_KEY.ALERT,
        component: <AlertModal title='참가 인원 초과' description='참가 인원은 참여 중인 멤버 수보다 적어야 합니다.' />,
      })

      return
    }

    const request = {
      bungId: details.bungId,
      name: formData.bungName,
      description: formData.description,
      memberNumber: Number(formData.memberNumber),
      hasAfterRun: formData.hasAfterRun,
      afterRunDescription: formData.hasAfterRun ? formData.afterRunDescription : '',
      hashtags: formData.hashTags,
      mainImage: formData.mainImage,
    }

    modifyBung(request, {
      onSuccess: () => {
        /* 벙 상세 페이지 서버 컴포넌트 API 호출 업데이트 */
        router.refresh()
        closeModal(MODAL_KEY.MODIFY_BUNG)
      },
    })
  }

  return (
    <Dimmed onClick={handleClose}>
      <BottomSheet ref={sheetRef} onClose={() => closeModal(MODAL_KEY.MODIFY_BUNG)} fullSize>
        <header className='relative flex h-60 w-full items-center justify-center px-16'>
          <span className='text-16 font-bold'>벙 수정</span>
          <button
            className='absolute right-16 translate-x-4 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
            onClick={handleClose}>
            <BrokenXIcon size={24} color={colors.black.DEFAULT} />
          </button>
        </header>

        <section className='h-[calc(100%-110px)] overflow-y-auto'>
          <form className='flex w-full flex-col overflow-y-auto px-16' onSubmit={handleSubmit(onSubmit)}>
            <BungThumbnailPicker
              value={selectedMainImage}
              images={imageList}
              onChange={(imageUrl) => setValue('mainImage', imageUrl)}
              onRandom={() => setValue('mainImage', nextImage(selectedMainImage))}
            />

            {/** 벙 이름 */}
            <div className='mb-16 flex flex-col gap-8'>
              <FormTitle required>벙 이름</FormTitle>
              <Input
                placeholder='벙 이름을 입력하세요'
                error={errors.bungName?.message}
                {...register('bungName', {
                  required: '필수 항목입니다',
                })}
              />
            </div>

            {/** 설명 */}
            <div className='mb-16 flex flex-col gap-8'>
              <FormTitle>설명</FormTitle>
              <TextArea className='h-80 pt-10' placeholder='벙 설명을 입력하세요' {...register('description')} />
            </div>

            {/** 장소 */}
            <div className='mb-16 flex flex-col gap-8'>
              <FormTitle>장소</FormTitle>
              <Input type='text' placeholder='정확한 위치를 입력하세요' value={details.location} disabled />
            </div>

            {/** 시작 일시 (날짜 선택 + 시간 선택) */}
            <div className='relative mb-16 flex flex-col gap-8'>
              <FormTitle>시작 일시</FormTitle>
              <div className='flex w-full gap-8'>
                <Button className='cursor-default bg-gray pl-16'>
                  <CalendarIcon size={16} color={colors.gray.darken} />
                  <p className='text-gray-darken'>
                    {formatDate({ date: details.startDateTime, formatStr: 'yyyy년 M월 d일', convertUTCtoLocale: true })}
                  </p>
                </Button>
                <Button className='cursor-default bg-gray pl-16'>
                  <ClockIcon size={16} color={colors.gray.darken} />
                  <p className='text-gray-darken'>
                    {formatDate({ date: details.startDateTime, formatStr: 'hh : mm', convertUTCtoLocale: true })}
                  </p>
                </Button>
              </div>
            </div>

            {/** 예상 시간 (분) */}
            <div className='relative mb-16 flex flex-col gap-8'>
              <FormTitle>예상 시간</FormTitle>
              <NumberInput
                className='pr-40'
                value={differenceInMinutes(details.endDateTime, details.startDateTime)}
                addon={<span className='absolute bottom-10 right-16 text-14 text-gray-darken'>분</span>}
                disabled
              />
            </div>

            {/** 거리 (km) */}
            <div className='relative mb-16 flex flex-col gap-8'>
              <FormTitle>거리</FormTitle>
              <NumberInput
                className='pr-40'
                value={details.distance}
                addon={<span className='absolute bottom-10 right-16 text-14 text-gray-darken'>km</span>}
                disabled
              />
            </div>

            {/** 페이스 (n'mm") */}
            <div className='mb-16 flex flex-col gap-8'>
              <FormTitle>페이스</FormTitle>
              <div className='flex gap-8'>
                <NumberInput
                  value={details.pace.match(/\d+/g)?.[0]}
                  disabled
                  addon={
                    <span className='absolute bottom-10 right-16 text-14 font-bold italic text-gray-darken'>{"'"}</span>
                  }
                />
                <NumberInput
                  value={details.pace.match(/\d+/g)?.[1]}
                  disabled
                  addon={
                    <span className='absolute bottom-10 right-16 text-14 font-bold italic text-gray-darken'>{'"'}</span>
                  }
                />
              </div>
            </div>

            {/** 참가 인원 */}
            <div className='relative mb-16 flex flex-col gap-8'>
              <FormTitle required>참가 인원</FormTitle>
              <NumberInput
                placeholder='2명 이상 입력하세요'
                error={errors.memberNumber?.message}
                {...register('memberNumber', {
                  required: '필수 항목입니다',
                  min: { value: 2, message: '2명 이상으로 입력하세요' },
                  max: { value: 300, message: '300명 이하로 입력하세요' },
                })}
              />
            </div>

            {/** 뒷풀이 */}
            <div className='relative mb-16 flex flex-col gap-8'>
              <FormTitle required>뒷풀이</FormTitle>
              <div className='flex gap-8'>
                <Button
                  className={`justify-center ${watch('hasAfterRun') === true ? 'border-primary bg-primary/10' : 'border-gray bg-white'}`}
                  onClick={() => {
                    setValue('hasAfterRun', true)
                  }}>
                  유
                </Button>
                <Button
                  className={`justify-center ${watch('hasAfterRun') === false ? 'border-primary bg-primary/10' : 'border-gray bg-white'}`}
                  onClick={() => {
                    setValue('hasAfterRun', false)
                  }}>
                  무
                </Button>
              </div>
              {watch('hasAfterRun') ? (
                <TextArea
                  className='h-80 pt-10'
                  placeholder='뒷풀이에 대한 내용을 입력하세요'
                  {...register('afterRunDescription')}
                />
              ) : null}
            </div>

            {/** 해시태그 */}
            <div className='relative mb-80 flex flex-col gap-8'>
              <FormTitle>해시태그</FormTitle>
              <div className='flex flex-wrap gap-8'>
                {watch('hashTags').map((label) => (
                  <HashTag
                    key={`HashTag-${label}`}
                    label={label}
                    onCloseButtonClick={() => {
                      setValue(
                        'hashTags',
                        watch('hashTags').filter((tag) => tag !== label),
                      )
                    }}
                  />
                ))}
              </div>
              <HashTagSearch
                onTagClick={(newTag) => {
                  setValue('hashTags', watch('hashTags').concat(newTag))
                }}
              />
            </div>

            {/** 수정 완료 버튼 */}
            <PrimaryButton type='submit' className='mb-40 app:mb-60'>
              {isPending ? <LoadingLogo className='mx-auto' /> : '수정 완료'}
            </PrimaryButton>
          </form>
        </section>
      </BottomSheet>
    </Dimmed>
  )
}
