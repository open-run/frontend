import { AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import clsx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useModalContext } from '@contexts/ModalContext'
import { useAppStore } from '@store/app'
import LoadingLogo from '@shared/LoadingLogo'
import { BottomSheet } from '@shared/Modal'
import PrimaryButton from '@shared/PrimaryButton'
import BrokenXIcon from '@icons/BrokenXIcon'
import useGeolocation from '@hooks/useGeolocation'
import { useCertifyParticipation } from '@apis/bungs/certifyParticipation/mutation'
import { useGeocoding } from '@apis/maps/geocoding/query'
import { calculateDistance } from '@utils/distance'
import { colors } from '@styles/colors'

const 참여인증거리 = 500 // 500m

export default function CertifyParticipationModal({ destination, bungId }: { destination: string; bungId: string }) {
  const router = useRouter()
  const { isApp } = useAppStore()
  const { closeModal } = useModalContext()
  const { mutate: certifyParticipation } = useCertifyParticipation()
  const { location } = useGeolocation()
  const { data: coordinates } = useGeocoding({ address: destination })
  const 모든좌표가유효한가 = location != null && coordinates != null

  const distance = useMemo(() => {
    if (모든좌표가유효한가 === false) return null
    const distance = calculateDistance(location.lat, location.lng, coordinates.lat, coordinates.lng)
    console.log('Distance', {
      start: location,
      destination: coordinates,
      distance: `${distance}m`,
    })
    return distance
  }, [모든좌표가유효한가])

  const handleClick = () => {
    certifyParticipation(
      { bungId },
      {
        onSuccess: () => {
          router.refresh()
          closeModal()
        },
      },
    )
  }

  return (
    <BottomSheet className='px-16'>
      <header className='flex h-60 w-full items-center justify-center'>
        <button className='absolute left-16' onClick={closeModal}>
          <BrokenXIcon size={24} color={colors.black.default} />
        </button>
        <span className='text-16 font-bold text-black-darken'>참여 인증</span>
      </header>
      <section className='w-full'>
        {모든좌표가유효한가 === true ? (
          <GoogleMap currentPosition={location} destinationPosition={coordinates} />
        ) : (
          <div className='relative aspect-square w-full animate-pulse'>
            <Image className='object-cover' src='/images/maps/map_placeholder.png' alt='map' fill />
          </div>
        )}
      </section>
      <PrimaryButton
        className={clsx('mt-20', isApp ? 'mb-50' : 'mb-40')}
        disabled={distance == null || distance > 참여인증거리}
        onClick={handleClick}>
        {distance == null && <LoadingLogo />}
        {distance != null && distance <= 참여인증거리 && '참여 인증 완료'}
        {distance != null && distance > 참여인증거리 && '목적지까지 500m 이내여야 합니다.'}
      </PrimaryButton>
    </BottomSheet>
  )
}

function GoogleMap({
  currentPosition,
  destinationPosition,
}: {
  currentPosition: { lat: number; lng: number }
  destinationPosition: { lat: number; lng: number }
}) {
  return (
    <div className='relative aspect-square w-full'>
      <style jsx global>{`
        .gmnoprint {
          display: none !important;
        }
        .gm-style-cc {
          display: none !important;
        }
      `}</style>
      <Map
        defaultZoom={16} // 지도의 초기 줌 레벨 (1-20, 숫자가 클수록 더 가까이 확대)
        defaultCenter={currentPosition} // 지도의 초기 중심 좌표
        mapId='bung-map' // Google Cloud Console에서 생성한 지도 스타일 ID
        disableDefaultUI={true} // 기본 UI 컨트롤 모두 비활성화
        zoomControl={false} // 줌 컨트롤 비활성화
        mapTypeControl={false} // 지도/위성 전환 컨트롤 비활성화
        streetViewControl={false} // 스트리트뷰 컨트롤 비활성화
        fullscreenControl={false} // 전체화면 컨트롤 비활성화
        gestureHandling='cooperative' // 스크롤 시 지도 확대/축소 방지
        clickableIcons={false} // 지도 내 POI 클릭 비활성화
        draggableCursor='grab' // 드래그 가능한 상태일 때의 커서
        draggingCursor='grabbing' // 드래그 중일 때의 커서
        keyboardShortcuts={false} // 키보드 단축키 비활성화
        mapTypeId='roadmap' // 지도 타입 (roadmap: 일반 지도, satellite: 위성 지도)
        style={mapStyle} // 지도 컨테이너의 스타일
      >
        <AdvancedMarker position={currentPosition}>
          <Image src='/images/maps/marker_current.png' width={22} height={22} alt='Current Marker' />
        </AdvancedMarker>
        <AdvancedMarker position={destinationPosition}>
          <Image src='/images/maps/marker_destination.png' width={20} height={35} alt='Destination Marker' />
        </AdvancedMarker>
      </Map>
    </div>
  )
}

const mapStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  border: `1px solid ${colors.gray.default}`,
}
