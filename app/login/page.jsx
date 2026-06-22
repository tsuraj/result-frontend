import { pageMetadata } from '../../lib/seo'
import LoginForm from '../../components/LoginForm'

export const metadata = pageMetadata({
  title: 'Log in',
  description: 'Sign in to your Hire Sarkar account to bookmark jobs and manage notifications.',
  path: '/login',
  noindex: true,
})

export default function LoginPage() {
  return <LoginForm />
}
