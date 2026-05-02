'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallbackComponent?: ReactNode
}

type State = {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent != null) {
        return <>{this.props.fallbackComponent}</>
      }

      return <div>{/* Your default error fallback UI */}</div>
    }

    return this.props.children
  }
}
