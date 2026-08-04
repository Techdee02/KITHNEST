import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSchoolData } from '../context/SchoolDataContext'
import { Button } from '../../../design-system/components/Button'
import { Icon } from '../../../design-system/components/Icon'
import { Blob } from '../../../design-system/components/Blob'
import { Logomark } from '../../../design-system/components/Logomark'

export default function SchoolLogin() {
  const { login, isSubmitting, authError } = useSchoolData()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const success = await login(email, password)
    if (success) navigate('/school')
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-ink-900">
      <Blob tone="teal" className="absolute -top-24 -left-16 h-72 w-72 opacity-30" />
      <Blob tone="marigold" className="absolute bottom-0 -right-20 h-72 w-72 opacity-20" />

      <div className="relative mx-auto flex min-h-svh max-w-md flex-col px-6 py-8">
        <Link to="/" className="inline-flex w-fit items-center gap-2 text-ink-300">
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
          <p className="text-xs font-semibold uppercase tracking-widest text-marigold-400">
            School Management Portal
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-white">
            Sign in to your school workspace
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink-200">
              Admin email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourschool.ng"
              type="email"
              autoComplete="email"
              className="w-full rounded-2xl border border-ink-700 bg-ink-800 px-4 py-3.5 text-white placeholder:text-ink-500 focus:border-marigold-400 focus:outline-none focus:ring-2 focus:ring-marigold-900"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink-200">
              Password
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-2xl border border-ink-700 bg-ink-800 px-4 py-3.5 text-white placeholder:text-ink-500 focus:border-marigold-400 focus:outline-none focus:ring-2 focus:ring-marigold-900"
            />
          </div>

          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 overflow-hidden rounded-xl bg-coral-900/40 px-3.5 py-3 text-sm text-coral-300"
              >
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
            {!isSubmitting && <Icon name="arrow-right" className="h-4 w-4" />}
          </Button>

          <p className="text-center text-sm text-ink-400">
            New school?{' '}
            <Link to="/school/signup" className="font-semibold text-marigold-400 hover:text-marigold-300">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
