import clsx from 'clsx'

// CSS animation으로 구현 — framer-motion 11에서 SVG의 percentage keyframe transform이
// state 변경에 반영되지 않는 이슈가 확인되어 vanilla CSS로 옮겼다.
//
// 타이밍 (총 1.7s 사이클):
//  0       → 100ms (delay)
//  100ms   → 460ms : slide-in   (translateX 150% → 0%, scale 0.5 → 1, opacity 0 → 1)
//  460ms   → 1180ms: hold       (가운데 머무름)
//  1180ms  → 1300ms: slide-out  (translateX 0% → -150%, scale 1 → 0.5, opacity 1 → 0)
//  1300ms  → 1700ms: 다음 사이클 전 정지 구간 (repeatDelay 500ms 효과)
const LOADING_LOGO_KEYFRAMES = `
@keyframes openrun-loading-logo {
  0% { transform: translateX(150%) scale(0.5); opacity: 0; }
  21.18% { transform: translateX(0%) scale(1); opacity: 1; }
  69.41% { transform: translateX(0%) scale(1); opacity: 1; }
  76.47% { transform: translateX(-150%) scale(0.5); opacity: 0; }
  100% { transform: translateX(-150%) scale(0.5); opacity: 0; }
}
.openrun-loading-logo {
  animation: openrun-loading-logo 1.7s ease-in-out 100ms infinite;
  transform-origin: center;
  display: inline-block;
}
`

export default function LoadingLogo({ className }: { className?: string }) {
  return (
    <div className={clsx('relative flex h-[22px] w-[250px] items-center justify-center overflow-hidden', className)}>
      <style>{LOADING_LOGO_KEYFRAMES}</style>
      <div className='openrun-loading-logo'>
        <svg width='30' height='22' viewBox='0 0 30 22' fill='none' display='block'>
            <path
            d='M21.9129 20.6463C20.5445 21.1905 19.1595 21.4517 17.6191 21.4644L17.619 21.4649H0L0.95238 15.9794H10.7092L10.7093 15.9788C10.711 15.979 10.7126 15.9792 10.7143 15.9794H18.4524C18.9286 15.9794 19.2857 15.8602 19.6429 15.7409C20.2339 15.4805 20.9524 15.1447 21.5848 14.5789C22.0281 14.1324 22.4344 13.6114 22.7299 13.016C23.0254 12.4207 23.2427 11.6408 23.3535 10.971C23.4643 10.3384 23.4274 9.37119 23.3535 8.7758C23.2796 8.18042 23.1319 7.65946 22.8733 7.21292C22.6147 6.76638 22.2454 6.39427 21.8021 6.09657C21.3354 5.84339 20.5952 5.48548 19.4048 5.48548L12.8571 5.48563C11.9047 5.48563 10.9483 5.8035 10.3613 6.0639C9.77425 6.32431 9.22392 6.65912 8.78365 7.14273C8.30669 7.58914 7.93981 8.10996 7.64629 8.70517C7.35278 9.30039 7.13265 9.93281 7.02258 10.6396C6.91252 11.272 6.91252 11.8673 6.98589 12.4625V12.3881C7.05927 12.9833 7.20603 13.5041 7.46285 13.9505C7.47745 13.9759 7.49205 14.0015 7.50676 14.0273C7.64071 14.2622 7.78449 14.5143 8.03605 14.787H1.03353C1.03022 14.781 1.0269 14.775 1.02356 14.7689C0.602021 13.5945 0.381888 12.0533 0.602021 10.5652C0.822155 9.00278 1.29911 7.58914 2.03289 6.32431C2.76667 5.02228 3.68389 3.90625 4.78456 2.97623C5.88523 2.0462 7.13265 1.30218 8.52683 0.781368C9.85177 0.286418 11.6077 0.0321987 13.1014 0.00817108L13.1028 0H21.4285L21.4257 0.0162492C22.6648 0.0901177 23.7805 0.348416 24.7941 0.812538C26.013 1.3335 27.0473 2.11494 27.8969 3.04523C28.7095 4.01273 29.3005 5.12907 29.6699 6.43148C30.0393 7.73388 30.0762 9.11071 29.8915 10.5992C29.6699 12.1621 29.1897 13.5761 28.4879 14.8785C27.7491 16.1809 26.8626 17.3344 25.7175 18.3392C24.6094 19.3067 23.3166 20.0881 21.9129 20.6463Z'
            fill='white'
            fillOpacity={0.3}
          />
        </svg>
      </div>
    </div>
  )
}
