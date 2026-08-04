import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Blob } from '../design-system/components/Blob'
import { Logomark, Wordmark } from '../design-system/components/Logomark'
import { Icon, type IconName } from '../design-system/components/Icon'
import { cn } from '../design-system/cn'
import heroImg from '../assets/images/hero-parent-child.webp'
import teacherImg from '../assets/images/teacher-posting-update.webp'

const PILLARS: { icon: IconName; tone: 'marigold' | 'teal' | 'coral'; title: string; body: string }[] = [
  {
    icon: 'calendar',
    tone: 'marigold',
    title: 'See what’s due, at a glance',
    body: 'No more decoding a teacher’s shorthand. Every assignment, project, and test shows up visually, exactly when it’s due, not buried in a list.',
  },
  {
    icon: 'wifi-off',
    tone: 'teal',
    title: 'Built for real Nigerian networks',
    body: 'Nothing important needs a live connection to open. Kithnest saves what matters to your phone and syncs the moment you’re back online.',
  },
  {
    icon: 'message',
    tone: 'coral',
    title: 'Reaches parents who never open the app',
    body: 'Critical updates go out by SMS too, not as a fallback, but as a first-class way to stay in the loop, no data required.',
  },
]

const STEPS = [
  {
    title: 'School posts',
    body: 'A teacher or admin posts a workload item or update in seconds, with no extra work.',
  },
  {
    title: 'Parents are notified',
    body: 'It lands in-app instantly, and by SMS for anything urgent, whichever way a parent actually checks.',
  },
  {
    title: 'Everyone stays in sync',
    body: 'Check in like you would a banking app: quick, reassuring, and always current.',
  },
]

const toneClasses: Record<'marigold' | 'teal' | 'coral', string> = {
  marigold: 'bg-marigold-100 text-marigold-700',
  teal: 'bg-teal-100 text-teal-700',
  coral: 'bg-coral-100 text-coral-700',
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' as const },
}

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const heroItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}

export default function Landing() {
  return (
    <div className="relative overflow-hidden bg-ink-50">
      <Blob tone="marigold" className="pointer-events-none absolute -top-16 -left-20 h-72 w-72" />
      <Blob tone="teal" className="pointer-events-none absolute top-[38rem] -right-24 h-80 w-80 opacity-50" />
      <Blob tone="coral" className="pointer-events-none absolute bottom-24 left-1/2 h-64 w-64 -translate-x-1/2 opacity-20" />

      {/* Top bar */}
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2">
          <Logomark className="h-8 w-8" />
          <Wordmark className="text-xl" />
        </div>
        <a
          href="#get-started"
          className="rounded-pill bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Get started
        </a>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-6 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pb-24 lg:pt-12">
        <motion.div initial="hidden" animate="visible" variants={heroContainer}>
          <motion.p
            variants={heroItem}
            className="inline-flex items-center gap-1.5 rounded-pill bg-white px-3 py-1 text-xs font-semibold text-marigold-700 shadow-warm-sm"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon name="sparkle" className="h-3.5 w-3.5" />
            </motion.span>
            Built for Nigerian schools &amp; families
          </motion.p>
          <motion.h1
            variants={heroItem}
            className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-ink-900 sm:text-5xl"
          >
            The school-to-home connection your family can keep up with.
          </motion.h1>
          <motion.p variants={heroItem} className="mt-4 max-w-md text-base text-ink-600 sm:text-lg">
            See what your child is learning, what&apos;s due, and what school said, all without
            digging through group chats.
          </motion.p>
          <motion.div variants={heroItem} className="mt-7 flex flex-wrap gap-3">
            <motion.a
              href="#get-started"
              whileTap={{ scale: 0.96 }}
              className="rounded-pill bg-marigold-500 px-6 py-3.5 text-sm font-semibold text-ink-900 shadow-warm-sm transition-transform hover:-translate-y-0.5"
            >
              Get started
            </motion.a>
            <motion.a
              href="#why"
              whileTap={{ scale: 0.96 }}
              className="rounded-pill border border-ink-200 px-6 py-3.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-white"
            >
              Why Kithnest
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src={heroImg}
              alt="A Nigerian parent and child looking at a phone together at home"
              className="aspect-[5/4] w-full rounded-card object-cover shadow-warm-lg"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Pillars */}
      <section id="why" className="relative mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <motion.div {...fadeUp} className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
            Why Kithnest
          </h2>
          <p className="mt-3 text-ink-600">
            Every existing player builds for the teacher or the school office first. Kithnest
            inverts that: the parent is the primary user, on three non-negotiables.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="rounded-card border border-ink-100 bg-white p-6 shadow-warm-sm"
            >
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-full', toneClasses[pillar.tone])}>
                <Icon name={pillar.icon} className="h-5 w-5" />
              </div>
              <p className="mt-4 font-display text-base font-semibold text-ink-900">{pillar.title}</p>
              <p className="mt-2 text-sm text-ink-500">{pillar.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div {...fadeUp}>
            <img
              src={teacherImg}
              alt="A teacher helping a pupil post an update on a tablet in a classroom"
              className="aspect-[5/4] w-full rounded-card object-cover shadow-warm-lg"
            />
          </motion.div>

          <div>
            <motion.h2 {...fadeUp} className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
              How it works
            </motion.h2>

            <ol className="mt-8 space-y-8">
              {STEPS.map((step, i) => (
                <motion.li
                  key={step.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                  className="relative flex gap-4 pl-0"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 font-display text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    {i < STEPS.length - 1 && <span className="mt-1 h-full w-px flex-1 border-l border-dashed border-ink-200" />}
                  </div>
                  <div className="pb-2">
                    <p className="font-display text-base font-semibold text-ink-900">{step.title}</p>
                    <p className="mt-1 text-sm text-ink-500">{step.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Entry CTA */}
      <section id="get-started" className="relative mx-auto max-w-md px-6 py-16 sm:px-10">
        <motion.div {...fadeUp} className="text-center">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Get started</h2>
          <p className="mt-2 text-sm text-ink-500">Pick the experience that fits you.</p>
        </motion.div>

        <div className="mt-8 space-y-3">
          <Link
            to="/parent/login"
            className="group flex items-center gap-4 rounded-card border border-ink-100 bg-white p-5 shadow-warm-sm transition-all hover:-translate-y-0.5 hover:shadow-warm-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-marigold-100 text-marigold-700">
              <Icon name="user" className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-display text-base font-semibold text-ink-900">I&apos;m a parent</p>
              <p className="text-sm text-ink-500">Check in on your child&apos;s day</p>
            </div>
            <Icon
              name="chevron-right"
              className="h-5 w-5 text-ink-300 transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          <Link
            to="/school/login"
            className="group flex items-center gap-4 rounded-card border border-ink-100 bg-white p-5 shadow-warm-sm transition-all hover:-translate-y-0.5 hover:shadow-warm-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <Icon name="building" className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-display text-base font-semibold text-ink-900">I&apos;m a school admin</p>
              <p className="text-sm text-ink-500">Manage classes, parents, and updates</p>
            </div>
            <Icon
              name="chevron-right"
              className="h-5 w-5 text-ink-300 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-ink-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-8 text-center sm:px-10">
          <div className="flex items-center gap-2">
            <Logomark className="h-6 w-6" />
            <Wordmark className="text-base" />
          </div>
          <p className="text-xs text-ink-400">
            Kithnest Phase 1 demo · Team 6, Intellect Africa Fellowship
          </p>
        </div>
      </footer>
    </div>
  )
}
