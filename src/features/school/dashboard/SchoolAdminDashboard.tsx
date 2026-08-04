import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSchoolData } from '../context/SchoolDataContext'
import { fakeFetch } from '../../../lib/fakeFetch'
import { Card } from '../../../design-system/components/Card'
import { Button } from '../../../design-system/components/Button'
import { Icon } from '../../../design-system/components/Icon'
import { Skeleton } from '../../../design-system/components/Skeleton'
import { rosterForClass } from '../../../fixtures/rosterEntries'
import { Badge } from '../../../design-system/components/Badge'
import { PostUpdateModal } from '../components/PostUpdateModal'

export default function SchoolAdminDashboard() {
  const { school, classes, metrics, totalConnectedParents, totalPupils, uploadLogo, isUploadingLogo } =
    useSchoolData()
  const [isLoading, setIsLoading] = useState(true)
  const [modal, setModal] = useState<'update' | 'workload' | null>(null)
  const [codeCopied, setCodeCopied] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fakeFetch(true, { delayMs: 600 }).then(() => setIsLoading(false))
  }, [])

  if (isLoading || !school) {
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

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadLogo(file)
    e.target.value = ''
  }

  async function handleCopyCode() {
    if (!school) return
    await navigator.clipboard.writeText(school.code)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div className="relative">
      {school.logoUrl && (
        <img
          src={school.logoUrl}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 w-[32rem] max-w-none -translate-x-1/2 opacity-[0.12]"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative space-y-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-ink-500">{school.location}</p>
            <h1 className="font-display text-2xl font-semibold text-ink-900">{school.name}</h1>
            <p className="mt-1 text-sm text-ink-500">
              {totalConnectedParents} parents connected · {totalPupils} pupils across {classes.length} classes
            </p>
            <button
              type="button"
              onClick={handleCopyCode}
              className="mt-2.5 flex items-center gap-1.5"
              title="Copy school code to share with parents"
            >
              <Badge tone="marigold" className="font-mono tracking-wider">
                {school.code}
              </Badge>
              <span className="flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-ink-700">
                <Icon name={codeCopied ? 'check' : 'copy'} className="h-3.5 w-3.5" />
                {codeCopied ? 'Copied' : 'Share with parents'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={isUploadingLogo}
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              <Icon name="upload" className="h-3.5 w-3.5" />
              {isUploadingLogo ? 'Uploading…' : school.logoUrl ? 'Change logo' : 'Add your school logo'}
            </button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
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
                    <p className="font-semibold text-ink-700">
                      {active}/{roster.length}
                    </p>
                    <p>active</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <PostUpdateModal open={modal !== null} onClose={() => setModal(null)} kind={modal ?? 'update'} />
      </motion.div>
    </div>
  )
}
