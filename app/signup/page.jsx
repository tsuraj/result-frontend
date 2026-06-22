import { pageMetadata } from '../../lib/seo'
import SignupForm from '../../components/SignupForm'

export const metadata = pageMetadata({
  title: 'Create your account',
  description: 'Create a free Hire Sarkar account to bookmark government jobs and get the latest updates.',
  path: '/signup',
  noindex: true,
})

export default function SignupPage() {
  return <SignupForm />
}
