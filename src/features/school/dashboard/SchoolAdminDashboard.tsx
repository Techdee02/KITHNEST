import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSchoolData } from '../context/SchoolDataContext'
import { fakeFetch } from '../../../lib/fakeFetch'
import { Card } from '../../../design-system/components/Card'
import { Button } from '../../../design-system/components/Button'
import { Icon } from '../../../design-system/components/Icon'
import { Skeleton } from '../../../design-system/components/Skeleton'
import { rosterForClass } from '../../../fixtures/rosterEntries'
import { PostUpdateModal } from '../components/PostUpdateModal'

export default function SchoolAdminDashboard() {
  const { school, classes, metrics, totalConnectedParents, totalPupils } = useSchoolData()
  const [isLoading, setIsLoading] = useState(true)
  const [modal, setModal] = useState<'update' | 'workload' | null>(null)

  useEffect(() => {
    fakeFetch(true, { delayMs: 600 }).then(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-72" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-card" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-card" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-ink-500">{school.location}</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">{school.name}</h1>
          <p className="mt-1 text-sm text-ink-500">
            {totalConnectedParents} parents connected · {totalPupils} pupils across {classes.length} classes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setModal('workload')}>
            <Icon name="upload" className="h-4 w-4" /> Upload workload
          </Button>
          <Button onClick={() => setModal('update')}>
            <Icon name="megaphone" className="h-4 w-4" /> Post update
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.id} className="p-4">
            <p className="text-xs font-medium text-ink-500">{m.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink-900">{m.value}</p>
            <p
              className={
                'mt-1 flex items-center gap-1 text-[0.7rem] font-medium ' +
                (m.trendDirection === 'up'
                  ? 'text-teal-600'
                  : m.trendDirection === 'down'
                    ? 'text-coral-600'
                    : 'text-ink-400')
              }
            >
              {m.trend}
            </p>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 font-display text-base font-semibold text-ink-900">Classes</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {classes.map((cls) => {
            const roster = rosterForClass(cls.id)
            const active = roster.filter((r) => r.status === 'active').length
            return (
              <Link
                key={cls.id}
                to="/school/roster"
                className="flex items-center gap-4 rounded-card border border-ink-100 bg-white p-4 transition-shadow hover:shadow-warm-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                  <Icon name="users" className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-ink-900">
                    {cls.name} · {cls.themeName}
                  </p>
                  <p className="text-xs text-ink-500">{cls.teacherName}</p>
                </div>
                <div className="text-right text-xs text-ink-400">
                  <p className="font-semibold text-ink-700">{active}/{roster.length}</p>
                  <p>active</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <PostUpdateModal open={modal !== null} onClose={() => setModal(null)} kind={modal ?? 'update'} />
    </motion.div>
  )
}
