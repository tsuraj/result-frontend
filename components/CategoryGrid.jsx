import Link from 'next/link'
import { TOPICS } from '../lib/topics'

// Home page "Popular categories" strip. One compact row of brand-coloured
// chips that navigate to /category/<slug>. Distinct from the sidebar
// "Browse by category" panel (which is an in-page job filter) — different
// affordance, different visual weight, different copy.
export default function CategoryGrid({ summary }) {
  const counts = {}
  if (summary?.topics) {
    summary.topics.forEach((t) => { counts[t.slug] = t.total })
  }

  return (
    <section className="container pt-4 pb-2" aria-label="Popular categories">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 mr-1">Popular categories:</span>
        {TOPICS.map(({ slug, name, Icon, accent, iconClass }) => {
          const total = counts[slug]
          return (
            <Link
              key={slug}
              href={`/category/${slug}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${accent}`}
            >
              <Icon size={11} className={iconClass} />
              <span>{name}</span>
              {typeof total === 'number' && total > 0 && (
                <span className="text-[10px] font-bold text-gray-500">· {total}</span>
              )}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
