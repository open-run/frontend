import clsx from 'clsx'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@store/app'
import { useUserStore } from '@store/user'
import { Weather } from '@type/weather'
import AddressClipboard from '@shared/AddressClipboard'
import Avatar from '@shared/Avatar'
import { BellIcon } from '@icons/bell'
import { CopyClipboardIcon } from '@icons/clipboard'
import { UpperClothIcon } from '@icons/upper-cloth'
import useGeolocation from '@hooks/useGeolocation'
import { useReverseGeocoding } from '@apis/maps/reverse-geocoding/query'
import { useWearingNftAvatarQuery } from '@apis/v1/nft/avatar-items/query'
import { useCurrentWeather } from '@apis/weather/query'
import addDelimiter from '@utils/addDelimiter'
import { colors } from '@styles/colors'

export default function Header({ isSmallHeaderActive }: { isSmallHeaderActive: boolean }) {
  const { isApp, insets } = useAppStore()
  const router = useRouter()
  const { userInfo } = useUserStore()

  const { data: wearingAvatar } = useWearingNftAvatarQuery()
  const { location, refetch } = useGeolocation()
  const { data: reverseGeocode } = useReverseGeocoding(
    { lat: location?.lat ?? 0, lng: location?.lng ?? 0 },
    { enabled: location != null },
  )
  const { data: currentWeather } = useCurrentWeather(
    { lat: location?.lat ?? 0, lng: location?.lng ?? 0 },
    { enabled: location != null },
  )

  const isReverseGeocodeLoading = location == null || reverseGeocode == null
  const isCurrentWeatherLoading = location == null || currentWeather == null
  const weatherBackground = currentWeather
    ? getWeatherData(currentWeather.weather).background
    : weatherData.clouds.background.morning
  const appTopPadding = insets ? insets.top + 5 : isApp ? 64 : 0
  const headerHeight = (isSmallHeaderActive ? 90 : 200) + appTopPadding

  return (
    <motion.header
      initial={false}
      animate={{ height: headerHeight }}
      transition={{ type: 'spring', stiffness: 280, damping: 32, mass: 0.55 }}
      className={clsx(
        'fixed left-0 right-0 top-0 z-50 overflow-hidden',
        currentWeather == null && 'animate-pulse',
      )}
      style={{
        background: isSmallHeaderActive
          ? `${weatherBackground}, linear-gradient(to bottom, white 80%, transparent 100%)`
          : weatherBackground,
      }}>
      <motion.section
        initial={false}
        animate={{ opacity: isSmallHeaderActive ? 0 : 1, y: isSmallHeaderActive ? -18 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={clsx(
          'absolute inset-x-0 top-0 flex h-[200px] w-full justify-between',
          isSmallHeaderActive && 'pointer-events-none',
        )}
        style={{ top: appTopPadding }}>
        <div className='relative flex w-[176px] flex-shrink-0 items-end justify-end'>
          {currentWeather && (
            <Image
              className='object-cover'
              src={getWeatherData(currentWeather.weather).image}
              alt='Weather Image'
              fill
              priority
              sizes='(max-width: 768px) 100vw, 176px'
            />
          )}
          {wearingAvatar?.data && <Avatar className='absolute h-200 w-160' {...wearingAvatar.data} />}

          <div className={clsx('absolute left-16 top-8 app:top-0')}>
            <AvatarButton onClick={() => router.push('/avatar')} />
          </div>
          <div className='absolute bottom-8 left-12'>
            <SkewedLikeLabel like={300} />
          </div>
        </div>

        <div className='flex flex-col'>
          <div className='m-[8px_20px_16px] flex items-center justify-end gap-8'>
            <div className='flex flex-col items-end'>
              <span className='text-20 font-bold text-white'>{userInfo?.nickname}</span>
              <AddressClipboard>
                {(address) => (
                  <div className='flex -translate-y-2 translate-x-4 cursor-pointer items-center gap-6 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/20'>
                    <span className='font-jost text-10 tracking-[0.04em] text-white'>{address}</span>
                    <CopyClipboardIcon className='-translate-y-1' size={12} color={colors.white} />
                  </div>
                )}
              </AddressClipboard>
            </div>
            <button
              className='rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/20'
              onClick={() => router.push('/notifications')}>
              <BellIcon className='-translate-y-1 translate-x-2' size={24} color={colors.white} />
            </button>
          </div>
          <div
            className='relative mr-32 flex w-[152px] flex-1 cursor-pointer flex-col items-center'
            onClick={() => {
              refetch()
            }}>
            <div className='absolute z-0 h-full w-full rounded-[80px_80px_0_0] bg-gradient-weather opacity-30' />
            {isReverseGeocodeLoading ? (
              <div className='mt-24 h-16 w-80 animate-pulse rounded-10 bg-gray' />
            ) : (
              <span className='z-10 mt-24 text-12 text-white'>{reverseGeocode.split(' ').slice(1, 3).join(' ')}</span>
            )}
            {isCurrentWeatherLoading ? (
              <div className='mt-19 h-30 w-122 animate-pulse rounded-10 bg-gray' />
            ) : (
              <span className='z-10 mt-4 flex items-center gap-8 font-jost text-40 font-bold tracking-wide text-white'>
                <Image src={getWeatherData(currentWeather.weather).icon} alt='Weather Icon' width={41} height={24} />
                {Math.floor(currentWeather.temperature)}°
              </span>
            )}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={false}
        animate={{ opacity: isSmallHeaderActive ? 1 : 0, y: isSmallHeaderActive ? 0 : -14 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={clsx(
          'absolute inset-x-0 top-0 flex h-[90px] w-full justify-between',
          !isSmallHeaderActive && 'pointer-events-none',
        )}
        style={{ top: appTopPadding }}>
        <div className='relative flex w-[118px] flex-shrink-0 items-end justify-end'>
          {currentWeather && (
            <Image
              className='absolute object-cover'
              src={getWeatherData(currentWeather.weather).image}
              alt='Weather Image'
              width={80}
              height={90}
              priority
            />
          )}
          {wearingAvatar?.data && <Avatar className='absolute h-90 w-68' {...wearingAvatar.data} />}

          <div className={clsx('absolute left-16 top-8 app:top-0')}>
            <AvatarButton onClick={() => router.push('/avatar')} />
          </div>
          <div className='absolute bottom-8 left-8'>
            <SkewedLikeLabel like={300} />
          </div>
        </div>

        <div className='flex flex-col'>
          <div className='m-[8px_20px_10px] flex items-center justify-end gap-8'>
            <div className='flex flex-col items-end'>
              <span className='text-16 font-bold text-white'>{userInfo?.nickname}</span>
              <AddressClipboard>
                {(address) => (
                  <div className='flex -translate-y-2 translate-x-4 cursor-pointer items-center gap-6 rounded-8 p-4 active-press-duration active:scale-95 active:bg-gray/20'>
                    <span className='font-jost text-10 tracking-[0.04em] text-white'>{address}</span>
                    <CopyClipboardIcon className='-translate-y-1' size={12} color={colors.white} />
                  </div>
                )}
              </AddressClipboard>
            </div>
            <button
              className='rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/20'
              onClick={() => router.push('/notifications')}>
              <BellIcon className='-translate-y-1 translate-x-2' size={24} color={colors.white} />
            </button>
          </div>

          {isReverseGeocodeLoading || isCurrentWeatherLoading ? (
            <div className='relative mr-24 flex h-[28px] w-[160px] animate-pulse rounded-full bg-[#586587] bg-opacity-30' />
          ) : (
            <div className='relative mr-24 flex h-[28px] w-[160px] items-center justify-center gap-5 rounded-full bg-[#586587] bg-opacity-30'>
              <Image src={getWeatherData(currentWeather.weather).icon} alt='Weather Icon' width={20} height={20} />
              <span className='font-jost text-16 font-bold text-white'>{Math.floor(currentWeather.temperature)}°</span>
              <span className='text-12 text-white'>{reverseGeocode.split(' ')[1]}</span>
            </div>
          )}
        </div>
      </motion.section>
    </motion.header>
  )
}

function AvatarButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className='flex aspect-square w-40 items-center justify-center rounded-full bg-black-darken/10 active-press-duration active:scale-90 active:bg-gray/20'
      onClick={onClick}>
      <UpperClothIcon size={16} color={colors.white} />
    </button>
  )
}

function SkewedLikeLabel({ like }: { like: number }) {
  return (
    <div className='flex h-28 skew-x-[-10deg] transform items-center justify-center gap-4 rounded-lg border-2 border-black bg-white px-8'>
      <Image src='/images/icon_thumbup.png' alt='Thumb Up Icon' width={16} height={16} />
      <span className='font-jost text-16 font-[900]'>{addDelimiter(like)}</span>
    </div>
  )
}

const weatherData = {
  clear: {
    image: '/images/home/bg_clear.png',
    icon: '/images/home/icon_clear.png',
    background: {
      morning: 'linear-gradient(180deg, #81C0FF 20%, rgba(195, 225, 255, 0.00) 100%)',
      afternoon: 'linear-gradient(180deg, #AAB9DF 30%, rgba(255, 145, 107, 0.30) 60%, rgba(255, 145, 107, 0.00) 100%)',
      night: 'linear-gradient(180deg, #002A51 20%, rgba(84, 103, 195, 0.90) 60%, rgba(92, 100, 175, 0.00) 100%)',
    },
  },
  clouds: {
    image: '/images/home/bg_clouds.png',
    icon: '/images/home/icon_clouds.png',
    background: {
      morning: 'linear-gradient(180deg, #B1B9CD 20%, rgba(137, 147, 157, 0.00) 100%)',
      afternoon: 'linear-gradient(180deg, #8C93A5 20%, rgba(223, 157, 128, 0.30) 60%, rgba(232, 71, 0, 0.00) 100%)',
      night: 'linear-gradient(180deg, #53555B 20%, rgba(96, 98, 105, 0.00) 100%)',
    },
  },
  rain: {
    image: '/images/home/bg_rain.png',
    icon: '/images/home/icon_rain.png',
    background: {
      morning: 'linear-gradient(180deg, #9DC7CD 20%, rgba(104, 201, 243, 0.00) 100%)',
      afternoon: 'linear-gradient(180deg, #513853 20%, rgba(173, 77, 71, 0.90) 60%, rgba(232, 71, 0, 0.00) 100%)',
      night: 'linear-gradient(180deg, #253232 20%, rgba(84, 117, 143, 0.90) 60%, rgba(50, 118, 148, 0.00) 100%)',
    },
  },
  snow: {
    image: '/images/home/bg_snow.png',
    icon: '/images/home/icon_snow.png',
    background: {
      morning: 'linear-gradient(180deg, #C1D6FF 20%, rgba(208, 224, 255, 0.00) 100%)',
      afternoon: 'linear-gradient(180deg, #7A95C9 20%, #E3C1D5 60%, rgba(255, 219, 239, 0.00) 100%)',
      night: 'linear-gradient(180deg, #1D499F 20%, rgba(84, 103, 195, 0.90) 60%, rgba(92, 100, 175, 0.00) 100%)',
    },
  },
} as const

function getWeatherData(weather: Weather) {
  const data = weatherData[weather]

  // 현재 시간 기준 오전 6시 ~ 오후 4시 사이면 오전, 오후 4시 ~ 오전 8시 사이면 오후, 나머지는 밤
  let background: string
  const now = new Date()
  const hours = now.getHours()
  if (hours >= 6 && hours < 16) {
    background = data.background.morning
  } else if (hours >= 16 && hours < 20) {
    background = data.background.afternoon
  } else {
    background = data.background.night
  }

  return {
    image: data.image,
    icon: data.icon,
    background,
  }
}
