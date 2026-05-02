import { AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import Image from 'next/image'
import { memo } from 'react'
import { colors } from '@styles/colors'

function GoogleMap({ lat, lng }: { lat: number; lng: number }) {
  const coordinates = { lat, lng }
  return (
    <div className='relative h-200 w-full'>
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
        defaultCenter={coordinates} // 지도의 초기 중심 좌표
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
        <AdvancedMarker position={coordinates}>
          <Image src='/images/maps/marker_destination.png' width={20} height={35} alt='Destination Marker' />
        </AdvancedMarker>
      </Map>
    </div>
  )
}

export default memo(GoogleMap)

const mapStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  border: `1px solid ${colors.gray.DEFAULT}`,
}
