import { ComponentType, ReactNode, Suspense } from 'react'
import ErrorBoundary from '@shared/ErrorBoundary'

type Options = {
  onLoading?: ReactNode
  onError?: ReactNode
}

export default function withBoundary<Props = Record<string, never>>(
  Component: ComponentType<Props>,
  options?: Options,
) {
  return function WrapBoundary(props: Props) {
    return (
      <ErrorBoundary fallbackComponent={options?.onError}>
        <Suspense fallback={options?.onLoading}>
          <Component {...(props as any)} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}
