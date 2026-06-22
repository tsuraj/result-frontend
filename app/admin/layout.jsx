import { pageMetadata } from '../../lib/seo'
import AdminShell from '../../components/admin/AdminShell'

export const metadata = pageMetadata({
  title: 'Admin',
  description: 'Admin console.',
  path: '/admin',
  noindex: true,
})

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>
}
