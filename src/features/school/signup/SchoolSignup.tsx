import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSchoolData } from '../context/SchoolDataContext'
import { Button } from '../../../design-system/components/Button'
import { Icon } from '../../../design-system/components/Icon'
import { Blob } from '../../../design-system/components/Blob'
import { Logomark } from '../../../design-system/components/Logomark'

export default function SchoolSignup() {
  const { register, isSubmitting, authError, uploadLogo, isUploadingLogo, logoError } = useSchoolData()
  const navigate = useNavigate()
  const [step, setStep] = useState<'details' | 'logo'>('details')

  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [location, setLocation] = useState('')
  const [motto, setMotto] = useState('')
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [password, setPassword] = useState('')

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  async function handleDetailsSubmit(e: FormEvent) {
    e.preventDefault()
    const success = await register({ name, shortName, location, motto, adminName, adminEmail, password })
    if (success) setStep('logo')
  }

  function handleLogoSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function handleFinish() {
    if (logoFile) await uploadLogo(logoFile)
    navigate('/school')
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-ink-900">
      <Blob tone="teal" className="absolute -top-24 -left-16 h-72 w-72 opacity-30" />
      <Blob tone="marigold" className="absolute bottom-0 -right-20 h-72 w-72 opacity-20" />

      <div className="relative mx-auto flex min-h-svh max-w-md flex-col px-6 py-8">
        {step === 'details' ? (
          <Link to="/school/login" className="inline-flex w-fit items-center gap-2 text-ink-300">
            <Icon name="chevron-left" className="h-4 w-4" />
            <span className="text-sm font-medium">Back to sign in</span>
          </Link>
        ) : (
          <div className="h-5" />
        )}

        <div className="mt-8 flex items-center gap-2">
          <Logomark className="h-9 w-9" />
        </div>

        <div className="mt-6 flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-marigold-400">
            School Management Portal
          </p>
          <span className="text-xs text-ink-500">· Step {step === 'details' ? '1' : '2'} of 2</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 'details' ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mt-2 font-display text-2xl font-semibold text-white">
                Create your school&apos;s account
              </h1>
              <p className="mt-1 text-sm text-ink-400">Takes about a minute. You can add a logo next.</p>

              <form onSubmit={handleDetailsSubmit} className="mt-6 space-y-4">
                <Field label="School name" htmlFor="name">
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bright Kids Nursery & Primary School"
                    required
                    className={inputClass}
                  />
                </Field>

                <Field label="Short name" htmlFor="shortName">
                  <input
                    id="shortName"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="e.g. Bright Kids"
                    required
                    className={inputClass}
                  />
                </Field>

                <Field label="Location" htmlFor="location">
                  <input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lekki Phase 1, Lagos"
                    required
                    className={inputClass}
                  />
                </Field>

                <Field label="Motto (optional)" htmlFor="motto">
                  <input
                    id="motto"
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    placeholder="e.g. Nurturing Curious Minds"
                    className={inputClass}
                  />
                </Field>

                <div className="border-t border-ink-800 pt-4">
                  <Field label="Admin name" htmlFor="adminName">
                    <input
                      id="adminName"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Admin email" htmlFor="adminEmail">
                  <input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="you@yourschool.ng"
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </Field>

                <Field label="Password" htmlFor="password">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className={inputClass}
                  />
                </Field>

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
                  {isSubmitting ? 'Creating account…' : 'Continue'}
                  {!isSubmitting && <Icon name="arrow-right" className="h-4 w-4" />}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mt-2 font-display text-2xl font-semibold text-white">Add your school&apos;s logo</h1>
              <p className="mt-1 text-sm text-ink-400">
                It shows up as a subtle watermark behind your dashboard. Square images work best.
              </p>

              <div className="mt-6 rounded-2xl border-2 border-dashed border-ink-700 bg-ink-800/50 p-8 text-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="mx-auto h-24 w-24 rounded-2xl bg-white object-contain p-2"
                  />
                ) : (
                  <Icon name="upload" className="mx-auto h-8 w-8 text-ink-400" />
                )}
                <p className="mt-3 text-sm text-ink-300">{logoFile ? logoFile.name : 'PNG or JPG'}</p>
                <label className="mt-4 inline-block cursor-pointer rounded-pill border border-ink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-700">
                  {logoFile ? 'Choose a different file' : 'Choose a file'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoSelect} />
                </label>
              </div>

              {logoError && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-coral-900/40 px-3.5 py-3 text-sm text-coral-300">
                  <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{logoError}</span>
                </div>
              )}

              <Button onClick={handleFinish} fullWidth size="lg" disabled={isUploadingLogo} className="mt-6">
                {isUploadingLogo ? 'Uploading…' : logoFile ? 'Upload logo & continue' : 'Continue to dashboard'}
              </Button>

              {logoFile && (
                <button
                  type="button"
                  onClick={() => navigate('/school')}
                  className="mt-3 w-full text-center text-sm text-ink-400 hover:text-ink-200"
                >
                  Skip for now
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const inputClass =
  'w-full rounded-2xl border border-ink-700 bg-ink-800 px-4 py-3.5 text-white placeholder:text-ink-500 focus:border-marigold-400 focus:outline-none focus:ring-2 focus:ring-marigold-900'

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink-200">
        {label}
      </label>
      {children}
    </div>
  )
}
