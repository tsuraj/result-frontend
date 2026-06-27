import Link from 'next/link'
import { FaChevronRight } from 'react-icons/fa'

// Visible breadcrumb trail rendered above the H1 on detail and category pages.
// The matching BreadcrumbList JSON-LD is emitted separately (via breadcrumb()
// in lib/seo.js) — this component is the human-readable counterpart so users
// see what crawlers see.
//
// items: [{ name, href? }] — drop href on the last item to render it as
// plain text (the current page).
export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => {
          const last = idx === items.length - 1
          return (
            <li key={`${item.name}-${idx}`} className="flex items-center gap-1.5 min-w-0">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-gray-900 truncate">{item.name}</Link>
              ) : (
                <span className={last ? 'text-gray-700 font-medium truncate' : 'truncate'}>{item.name}</span>
              )}
              {!last && <FaChevronRight size={8} className="text-gray-300 flex-shrink-0" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
