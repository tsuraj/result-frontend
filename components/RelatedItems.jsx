import Link from 'next/link'
import { FaRegCalendarAlt } from 'react-icons/fa'

const fmtDate = (v) => {
  if (!v) return null
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Related-content section rendered near the bottom of every detail page.
// Two SEO wins:
//   1. Adds 4-6 unique internal links per detail page — improves crawl
//      graph density and helps Google discover / index sibling content.
//   2. Adds unique content (varying titles, categories, dates) so each
//      detail page no longer looks identical to its neighbours, which
//      the "Duplicate without user-selected canonical" bucket was
//      complaining about.
export default function RelatedItems({ items = [], basePath, heading = 'Related' }) {
  if (!items.length) return null
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">{heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const dateStr = fmtDate(item.date || item.last_date)
          return (
            <Link
              key={item.id}
              href={`${basePath}/${item.slug || item.id}`}
              className="block rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-3"
            >
              <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{item.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                {item.category && <span>{item.category}</span>}
                {item.category && dateStr && <span aria-hidden>·</span>}
                {dateStr && (
                  <span className="inline-flex items-center gap-1">
                    <FaRegCalendarAlt size={10} className="text-gray-400" /> {dateStr}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
