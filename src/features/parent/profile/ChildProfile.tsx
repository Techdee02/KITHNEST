import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useParentData } from '../context/ParentDataContext'
import { fakeFetch } from '../../../lib/fakeFetch'
import { subjects } from '../../../fixtures/subjects'
import { ProgressRing } from '../../../design-system/components/ProgressRing'
import { Card } from '../../../design-system/components/Card'
import { Badge } from '../../../design-system/components/Badge'
import { Icon } from '../../../design-system/components/Icon'
import { Button } from '../../../design-system/components/Button'
import { Skeleton } from '../../../design-system/components/Skeleton'
import pupilAvatar from '../../../assets/images/pupil-avatar.webp'

export default function ChildProfile() {
  const { parentName, selectedPupil, classNameForPupil, workloadForSelectedPupil, notifications, logout, linkedSchool } =
    useParentData()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fakeFetch(true, { delayMs: 500 }).then(() => setIsLoading(false))
  }, [selectedPupil?.id])

  const completion = useMemo(() => {
    const total = workloadForSelectedPupil.length
    const completed = workloadForSelectedPupil.filter((i) => i.status === 'completed').length
    return total === 0 ? 0 : Math.round((completed / total) * 100)
  }, [workloadForSelectedPupil])

  const subjectBreakdown = useMemo(() => {
    const grouped = subjects
      .map((subject) => {
        const items = workloadForSelectedPupil.filter((i) => i.subjectId === subject.id)
        const completed = items.filter((i) => i.status === 'completed').length
        return { subject, total: items.length, completed }
      })
      .filter((row) => row.total > 0)
    return grouped
  }, [workloadForSelectedPupil])

  const achievements = notifications.filter(
    (n) => n.category === 'achievement' && n.title.includes(selectedPupil?.preferredName ?? ''),
  )

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (isLoading || !selectedPupil) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-40 w-full rounded-card" />
        <Skeleton className="h-32 w-full rounded-card" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <img
          src={pupilAvatar}
          alt={`${selectedPupil.preferredName}'s photo`}
          className="h-20 w-20 shrink-0 rounded-full object-cover shadow-warm-sm"
        />
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-900">{selectedPupil.name}</h1>
          <p className="text-sm text-ink-500">{classNameForPupil(selectedPupil)}</p>
          <p className="text-xs text-ink-400">{linkedSchool?.shortName}</p>
        </div>
      </div>

      <Card className="flex items-center gap-5 p-5">
        <ProgressRing value={completion} label="completed" colorClassName="text-teal-500" />
        <div>
          <p className="font-display text-base font-semibold text-ink-900">Term progress</p>
          <p className="mt-1 text-sm text-ink-500">
            {completion}% of posted work completed so far this term. This is a placeholder metric
            — Phase 2 will compute it from real submissions.
          </p>
        </div>
      </Card>

      {subjectBreakdown.length > 0 && (
        <Card className="p-5">
          <p className="mb-4 font-display text-base font-semibold text-ink-900">By subject</p>
          <div className="space-y-3.5">
            {subjectBreakdown.map(({ subject, total, completed }) => (
              <div key={subject.id}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-ink-700">{subject.name}</span>
                  <span className="text-ink-400">
                    {completed}/{total}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-pill bg-ink-100">
                  <div
                    className="h-full rounded-pill bg-teal-500 transition-all duration-700"
                    style={{ width: `${total === 0 ? 0 : (completed / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {achievements.length > 0 && (
        <Card className="p-5">
          <p className="mb-3 font-display text-base font-semibold text-ink-900">Achievements</p>
          <div className="space-y-2.5">
            {achievements.map((a) => (
              <div key={a.id} className="flex items-start gap-2.5">
                <Icon name="trophy" className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" />
                <p className="text-sm text-ink-700">{a.title}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <p className="mb-3 font-display text-base font-semibold text-ink-900">Account</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Parent</span>
            <span className="font-medium text-ink-800">{parentName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-500">School</span>
            <span className="font-medium text-ink-800">{linkedSchool?.shortName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-500">School code</span>
            <Badge tone="neutral">{linkedSchool?.code}</Badge>
          </div>
        </div>
        <Button variant="outline" fullWidth className="mt-5" onClick={handleLogout}>
          <Icon name="log-out" className="h-4 w-4" /> Log out
        </Button>
      </Card>
    </motion.div>
  )
}
