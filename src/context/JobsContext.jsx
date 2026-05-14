import { createContext, useContext, useEffect, useState } from 'react'

const JobsContext = createContext({
  stats: { total_active: 0, posted_today: 0, closing_this_week: 0 },
  loading: true,
  updatedAt: null,
  refresh: () => {}
})

export const JobsProvider = ({ children }) => {
  const [stats, setStats] = useState({ total_active: 0, posted_today: 0, closing_this_week: 0 })
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState(null)

  const refresh = () => {
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/jobs?per_page=1&page=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.meta) {
          setStats({
            total_active: data.meta.total_active ?? data.meta.total ?? 0,
            posted_today: data.meta.posted_today ?? 0,
            closing_this_week: data.meta.closing_this_week ?? 0
          })
          setUpdatedAt(Date.now())
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { refresh() }, [])

  return (
    <JobsContext.Provider value={{ stats, loading, updatedAt, refresh }}>
      {children}
    </JobsContext.Provider>
  )
}

export const useJobs = () => useContext(JobsContext)
