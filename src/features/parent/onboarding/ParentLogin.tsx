import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useParentData } from '../context/ParentDataContext'
import { Button } from '../../../design-system/components/Button'
import { Icon } from '../../../design-system/components/Icon'
import { Blob } from '../../../design-system/components/Blob'
import { Logomark } from '../../../design-system/components/Logomark'

export default function ParentLogin() {
  const { login, isLoggingIn, loginError } = useParentData()
  const navigate = useNavigate()
  const [schoolCode, setSchoolCode] = useState('BKL204')
  const [phone, setPhone] = useState('0803 214 7765')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const success = await login(schoolCode, phone)
    if (success) navigate('/parent')
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-ink-50">
      <Blob tone="teal" className="absolute -top-24 -right-16 h-72 w-72 opacity-60" />

      <div className="relative mx-auto flex min-h-svh max-w-md flex-col px-6 py-8">
        <Link to="/" className="inline-flex w-fit items-center gap-2 text-ink-500">
          <Icon name="chevron-left" className="h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>

        <div className="mt-8 flex items-center gap-2">
          <Logomark className="h-9 w-9" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Let&apos;s find your child&apos;s school
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Enter the school code from your welcome letter and the phone number your school has
            on file.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="schoolCode" className="mb-1.5 block text-sm font-semibold text-ink-800">
              School code
            </label>
            <input
              id="schoolCode"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
              placeholder="e.g. BKL204"
              autoComplete="off"
              className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3.5 font-mono text-lg tracking-widest text-ink-900 placeholder:text-ink-300 focus:border-marigold-400 focus:outline-none focus:ring-2 focus:ring-marigold-100"
            />
            <p className="mt-1.5 text-xs text-ink-400">Found on your school&apos;s welcome letter or notice board.</p>
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-ink-800">
              Phone number
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="080X XXX XXXX"
              type="tel"
              autoComplete="tel"
              className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3.5 text-ink-900 placeholder:text-ink-300 focus:border-marigold-400 focus:outline-none focus:ring-2 focus:ring-marigold-100"
            />
          </div>

          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 overflow-hidden rounded-xl bg-coral-50 px-3.5 py-3 text-sm text-coral-700"
              >
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" fullWidth size="lg" disabled={isLoggingIn}>
            {isLoggingIn ? 'Checking…' : 'Continue'}
            {!isLoggingIn && <Icon name="arrow-right" className="h-4 w-4" />}
          </Button>

          <p className="text-center text-xs text-ink-400">
            Demo credentials are pre-filled — clear a field to see what an error looks like.
          </p>
        </form>
      </div>
    </div>
  )
}
