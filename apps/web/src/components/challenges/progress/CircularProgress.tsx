import Image from 'next/image'
import { ReactNode } from 'react'
import { colors } from '@styles/colors'

export default function CircularProgress({
  progress,
  total,
  circleColor = 'gray-lighten',
  children,
}: {
  progress: number
  total: number
  circleColor?: 'gray-lighten' | 'gray'
  children: ReactNode
}) {
  const size = 60
  const radius = (size - 3) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / total) * circumference

  const circleColorClass = circleColor === 'gray-lighten' ? 'text-gray-lighten' : 'text-gray'

  return (
    <div className='relative inline-flex items-center justify-center'>
      <svg width={size} height={size} className='-rotate-90 transform'>
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='currentColor'
          strokeWidth={2}
          fill='none'
          className={circleColorClass}
        />

        {/* 진행률 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='currentColor'
          strokeWidth={2}
          fill='none'
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          className='text-primary transition-all duration-300 ease-in-out'
        />
      </svg>

      <div className='absolute inset-0 flex items-center justify-center overflow-hidden rounded-full p-7'>
        {children}
      </div>
    </div>
  )
}

export function RandomGiftImage() {
  return (
    <div className='flex size-48 items-center justify-center rounded-full bg-gradient-achievement-gift'>
      <Image src='/images/achievement/img_gift.png' alt='gift' width={40} height={40} />
    </div>
  )
}

export function QuestionMarkImage() {
  return (
    <div className='flex size-48 items-center justify-center rounded-full bg-gradient-achievement-gray'>
      <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
        <path
          d='M13.2192 19.6243V19.1689C13.2192 18.1252 13.3023 17.2935 13.4685 16.6736C13.6347 16.0538 13.8808 15.5572 14.2068 15.1841C14.5329 14.8046 14.9324 14.463 15.4055 14.1594C15.8146 13.8937 16.179 13.6376 16.4986 13.3909C16.8247 13.1442 17.0804 12.8817 17.2658 12.6034C17.4575 12.3251 17.5534 12.0089 17.5534 11.6546C17.5534 11.3384 17.4767 11.0601 17.3233 10.8197C17.1699 10.5794 16.9621 10.3928 16.7 10.26C16.4379 10.1271 16.147 10.0607 15.8274 10.0607C15.4822 10.0607 15.1626 10.1398 14.8685 10.2979C14.5808 10.456 14.3475 10.6743 14.1685 10.9526C13.9959 11.2309 13.9096 11.5534 13.9096 11.9203H9C9.01279 10.5288 9.33242 9.39975 9.9589 8.53321C10.5854 7.66034 11.4164 7.02151 12.4521 6.6167C13.4877 6.20557 14.6256 6 15.8658 6C17.2338 6 18.4548 6.19924 19.5288 6.59772C20.6027 6.98988 21.4498 7.58444 22.0699 8.3814C22.69 9.17204 23 10.1619 23 11.351C23 12.1164 22.8658 12.79 22.5973 13.3719C22.3352 13.9475 21.9676 14.4567 21.4945 14.8994C21.0279 15.3359 20.4813 15.7343 19.8548 16.0949C19.3945 16.3605 19.0078 16.6357 18.6945 16.9203C18.3813 17.1986 18.1447 17.518 17.9849 17.8786C17.8251 18.2328 17.7452 18.6629 17.7452 19.1689V19.6243H13.2192ZM15.5589 26C14.8174 26 14.1813 25.7438 13.6507 25.2315C13.1265 24.7128 12.8676 24.0835 12.874 23.3435C12.8676 22.6224 13.1265 22.0057 13.6507 21.4934C14.1813 20.981 14.8174 20.7249 15.5589 20.7249C16.2621 20.7249 16.8822 20.981 17.4192 21.4934C17.9626 22.0057 18.2374 22.6224 18.2438 23.3435C18.2374 23.8368 18.1064 24.2859 17.8507 24.6907C17.6014 25.0892 17.2753 25.4086 16.8726 25.649C16.4699 25.883 16.032 26 15.5589 26Z'
          fill='white'
        />
      </svg>
    </div>
  )
}

export function RepeatImage() {
  return (
    <div className='flex size-48 items-center justify-center rounded-full bg-gradient-achievement-gray'>
      <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
        <path
          d='M18.5996 21.818C18.5662 21.7932 18.4375 21.7803 18.4375 21.7751C18.4375 21.7751 17.1648 22.0024 16.4585 22.0024C12.9697 22.0024 10.1908 19.2624 9.86477 15.8922H11.7472C11.932 15.8922 12.0999 15.7763 12.1774 15.6088C12.2068 15.545 12.2212 15.473 12.2212 15.4056C12.2212 15.2956 12.1826 15.1841 12.1084 15.0968L6.99055 9.06799C6.90078 8.96229 6.76903 8.9007 6.63024 8.90039C6.49145 8.90009 6.35939 8.95922 6.26901 9.06462L1.11342 15.0928C0.993015 15.2334 0.96544 15.4399 1.04326 15.6078C1.12047 15.7757 1.28868 15.8922 1.47374 15.8922H3.31819C3.57494 22.9391 9.3721 28.3869 16.4463 28.454C16.7879 28.4574 18.4378 28.3079 18.4378 28.3079C18.4378 28.3079 18.5126 28.2819 18.5144 28.2819C18.6305 28.2647 18.7059 28.1792 18.7059 28.0616L18.7442 22.008C18.7442 21.9329 18.6593 21.8627 18.5996 21.818Z'
          fill='white'
        />
        <path
          d='M18.7442 27.2988C18.7347 27.3012 18.7313 24.829 18.7313 24.829C17.9718 25.0177 17.1525 25.1237 16.335 25.1237C13.7081 25.1237 11.238 24.1062 9.38034 22.2486C7.66334 20.5316 6.66146 18.3437 6.5196 15.8926H3.2002C3.34512 19.2628 4.69047 22.2514 7.03433 24.5949C9.51852 27.0791 12.754 28.4695 16.2673 28.4695C16.4147 28.4695 16.7113 28.467 16.7171 28.4667C17.1987 28.4649 18.4905 28.3062 18.4923 28.3062C18.5573 28.2967 18.6381 28.2608 18.6881 28.2112C18.7028 28.2066 18.7442 28.1043 18.7442 28.0733V27.2988Z'
          fill='url(#paint0_linear_10385_2029)'
        />
        <path
          d='M13.3996 10.6517C13.433 10.6765 13.5617 10.6894 13.5617 10.6946C13.5617 10.6946 14.8344 10.4673 15.5407 10.4673C19.0295 10.4673 21.8084 13.2073 22.1344 16.5776H20.252C20.0672 16.5776 19.8993 16.6934 19.8218 16.861C19.7924 16.9247 19.778 16.9967 19.778 17.0641C19.778 17.1741 19.8166 17.2856 19.8907 17.373L25.0086 23.4017C25.0984 23.5074 25.2302 23.569 25.369 23.5693C25.5077 23.5696 25.6398 23.5105 25.7302 23.4051L30.8858 17.3769C31.0062 17.2363 31.0338 17.0298 30.9559 16.8619C30.8787 16.694 30.7105 16.5776 30.5255 16.5776H28.681C28.4239 9.53066 22.6271 4.08278 15.5529 4.01568C15.2113 4.01231 13.5614 4.16183 13.5614 4.16183C13.5614 4.16183 13.4866 4.18756 13.4848 4.18787C13.3687 4.20503 13.2933 4.29051 13.2933 4.40817L13.255 10.4618C13.255 10.5368 13.3399 10.607 13.3996 10.6517Z'
          fill='white'
        />
        <path
          d='M13.2551 5.17071C13.2646 5.16826 13.268 7.6405 13.268 7.6405C14.0275 7.45176 14.8468 7.34576 15.6639 7.34576C18.2909 7.34576 20.761 8.36327 22.6186 10.2209C24.3359 11.9379 25.3378 14.1258 25.4797 16.5769H28.7991C28.6542 13.2066 27.3088 10.2181 24.965 7.87458C22.4808 5.39039 19.2453 4 15.732 4C15.5846 4 15.288 4.00245 15.2822 4.00276C14.8005 4.0046 13.5088 4.16331 13.507 4.16331C13.442 4.1728 13.3611 4.20865 13.3112 4.25829C13.2965 4.26288 13.2554 4.36522 13.2554 4.39616L13.2551 5.17071Z'
          fill='url(#paint1_linear_10385_2029)'
        />
        <defs>
          <linearGradient
            id='paint0_linear_10385_2029'
            x1='5.00006'
            y1='15.999'
            x2='19.0001'
            y2='26.499'
            gradientUnits='userSpaceOnUse'>
            <stop stopColor={colors.gray.DEFAULT} />
            <stop offset='1' stopColor={colors.gray.lighten} />
          </linearGradient>
          <linearGradient
            id='paint1_linear_10385_2029'
            x1='27'
            y1='16.5'
            x2='13.5'
            y2='5'
            gradientUnits='userSpaceOnUse'>
            <stop stopColor={colors.gray.DEFAULT} />
            <stop offset='1' stopColor={colors.gray.lighten} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
