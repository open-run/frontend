import { Metadata } from 'next'
import Register from '@components/register/Register'

export default function RegisterPage() {
  return <Register />
}

export const metadata: Metadata = {
  title: '회원가입',
}
