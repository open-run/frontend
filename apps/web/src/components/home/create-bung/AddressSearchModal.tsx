import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { Dimmed } from '@shared/Modal'
import { TargetIcon } from '@icons/target'
import { BrokenXIcon } from '@icons/x'
import useDebounce from '@hooks/useDebounce'
import useGeolocation from '@hooks/useGeolocation'
import { ResponseType } from '@apis/maps/places'
import { usePlacesAutocomplete } from '@apis/maps/places/mutation'
import { useReverseGeocodingMutation } from '@apis/maps/reverse-geocoding/mutation'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'

type Suggestion = {
  placeId: string
  mainAddress: string
  secondaryAddress: string
}

export default function AddressSearchModal({ onComplete }: { onComplete: (address: string) => void }) {
  const { closeModal } = useModal()
  const { location } = useGeolocation()

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedSuggestionPlaceId, setSelectedSuggestionPlaceId] = useState<string | null>(null)

  const { mutate: fetchPlacesAutocomplete } = usePlacesAutocomplete()
  const { mutate: fetchReverseGeocoding, isPending: isReverseGeocodingLoading } = useReverseGeocodingMutation()

  const renderHighlightKeyword = (text: string, keyword: string) => {
    if (keyword === '') return text

    const parts = text.split(keyword)
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && <span className='font-bold'>{keyword}</span>}
      </span>
    ))
  }

  const handleCurrentLocationClick = () => {
    if (location == null) return

    fetchReverseGeocoding(
      { lat: location.lat, lng: location.lng },
      {
        onSuccess: (data) => {
          setSearch(data)
        },
      },
    )
  }

  useEffect(() => {
    if (debouncedSearch === '') {
      setSuggestions([])
      return
    }

    fetchPlacesAutocomplete(
      { input: debouncedSearch },
      {
        onSuccess: ({ suggestions }: ResponseType) => {
          setSuggestions(
            suggestions.map(({ placePrediction: { placeId, structuredFormat } }) => ({
              placeId,
              mainAddress: structuredFormat.mainText.text,
              secondaryAddress: structuredFormat.secondaryText.text,
            })),
          )
        },
      },
    )
  }, [debouncedSearch])

  return (
    <Dimmed onClick={() => closeModal(MODAL_KEY.ADDRESS_SEARCH)}>
      <article
        className='absolute left-1/2 top-1/2 aspect-[328/480] max-h-[650px] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-10 bg-white'
        onClick={(e) => e.stopPropagation()}>
        <div className='h-full w-full'>
          <header className='relative mb-16 flex h-60 w-full items-center'>
            <h2 className='w-full text-center font-bold'>주소검색</h2>
            <button
              className='absolute right-8 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
              onClick={() => closeModal(MODAL_KEY.ADDRESS_SEARCH)}>
              <BrokenXIcon size={24} color={colors.black.DEFAULT} />
            </button>
          </header>

          <div className='h-[calc(100%-76px)] px-24'>
            <div className='mb-8 flex items-center gap-4'>
              <input
                className='flex-1 rounded-8 border border-gray p-12 text-16 focus:border-primary focus:outline-none'
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='도로명, 건물명, 지번 입력'
                disabled={isReverseGeocodingLoading}
              />
              {search.length > 0 && (
                <button
                  className='translate-x-8 rounded-8 px-8 py-4 text-14 active-press-duration active:scale-95 active:bg-gray/50'
                  onClick={() => {
                    setSearch('')
                    setSuggestions([])
                  }}>
                  취소
                </button>
              )}
            </div>
            <div className='h-[calc(100%-74px)] overflow-y-auto scrollbar-hide'>
              {suggestions.length === 0 ? (
                <div className='flex flex-col'>
                  <button
                    className='active:scale-98 mb-24 flex h-32 w-full items-center justify-center gap-4 rounded-8 bg-gray-lighten active-press-duration active:bg-gray/50 disabled:text-gray-darker'
                    disabled={location == null || isReverseGeocodingLoading}
                    onClick={handleCurrentLocationClick}>
                    <span className='text-14'>현재 위치</span>
                    <TargetIcon size={16} color={colors.black.darken} />
                  </button>
                  <span className='mb-8 text-14 font-bold'>검색 팁</span>
                  <span className='text-14 text-gray-darker'>도로명 + 건물번호</span>
                  <span className='mb-8 text-14 text-pink'>여의서로 330</span>
                  <span className='text-14 text-gray-darker'>지번 주소</span>
                  <span className='mb-8 text-14 text-pink'>잠실동 47</span>
                  <span className='text-14 text-gray-darker'>장소명</span>
                  <span className='mb-24 text-14 text-pink'>뚝섬한강공원, 서울숲</span>
                  <span className='text-14 font-bold'>
                    러닝을 시작할 정확한 위치는 &apos;상세주소&apos;란에 적어주세요
                  </span>
                  <span className='text-14'>
                    <span className='text-gray-darker'>종로3가역</span>{' '}
                    <span className='text-pink'>&apos;2-1번 출구 인근 물품보관함&apos;</span>
                  </span>
                </div>
              ) : (
                <ul className='flex flex-col divide-y divide-gray pb-24 pt-16'>
                  {suggestions.map(({ placeId, mainAddress, secondaryAddress }) => (
                    <li
                      key={placeId}
                      className={clsx(
                        'group flex cursor-pointer flex-col p-8',
                        selectedSuggestionPlaceId === null && 'rounded-8 active-press-duration active:bg-gray/50',
                      )}
                      onClick={() => {
                        if (selectedSuggestionPlaceId === placeId) {
                          setSelectedSuggestionPlaceId(null)
                        } else {
                          setSelectedSuggestionPlaceId(placeId)
                        }
                      }}>
                      <div
                        className={clsx(
                          'flex items-center justify-between gap-8',
                          selectedSuggestionPlaceId === null && 'active-press-duration group-active:scale-95',
                        )}>
                        <div className='flex flex-col'>
                          <span className='text-14'>{renderHighlightKeyword(mainAddress, search)}</span>
                          <span className='text-14 text-gray-darker'>{secondaryAddress}</span>
                        </div>
                        {selectedSuggestionPlaceId === placeId && (
                          <button
                            className='flex-shrink-0 rounded-20 bg-black-darken px-18 py-4 text-14 text-white active-press-duration active:scale-90 active:bg-black-darken/80'
                            onClick={(e) => {
                              e.stopPropagation()
                              onComplete(`${secondaryAddress} ${mainAddress}`)
                              closeModal(MODAL_KEY.ADDRESS_SEARCH)
                            }}>
                            선택
                          </button>
                        )}
                      </div>
                      {selectedSuggestionPlaceId === placeId && (
                        <div className='relative mt-8 aspect-[264/210] w-full'>
                          {/* https://developers.google.com/maps/documentation/maps-static/start?hl=ko */}
                          <Image
                            className='rounded-10 border border-gray'
                            src={`https://maps.googleapis.com/maps/api/staticmap?center=${mainAddress}&zoom=16&size=400x400&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                            alt='Google Static Map'
                            fill
                            unoptimized
                            placeholder='blur'
                            blurDataURL='/images/maps/map_placeholder.png'
                          />
                          <Image
                            className='absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2'
                            src='/images/maps/marker_destination.png'
                            alt='Destination Marker'
                            width={20}
                            height={35}
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </article>
    </Dimmed>
  )
}
