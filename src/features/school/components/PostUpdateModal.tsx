import { useState } from 'react'
import { Modal } from '../../../design-system/components/Modal'
import { Button } from '../../../design-system/components/Button'
import { Icon } from '../../../design-system/components/Icon'
import { fakeFetch } from '../../../lib/fakeFetch'
import { totalConnectedParents } from '../../../fixtures/engagementMetrics'

export function PostUpdateModal({ open, onClose, kind }: { open: boolean; onClose: () => void; kind: 'update' | 'workload' }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  function handleClose() {
    setStatus('idle')
    setTitle('')
    setBody('')
    onClose()
  }

  async function handleSend() {
    setStatus('sending')
    await fakeFetch(true, { delayMs: 900 })
    setStatus('sent')
  }

  return (
    <Modal open={open} onClose={handleClose} title={kind === 'update' ? 'Post an update' : 'Upload workload'}>
      {status === 'sent' ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700">
            <Icon name="check" className="h-6 w-6" />
          </div>
          <p className="font-display text-base font-semibold text-ink-900">
            {kind === 'update' ? 'Update sent' : 'Workload posted'}
          </p>
          <p className="text-sm text-ink-500">
            Delivered to {totalConnectedParents} connected parents, in-app and via SMS for critical
            items.
          </p>
          <Button onClick={handleClose} className="mt-2">
            Done
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-800">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={kind === 'update' ? 'e.g. Founder’s Day rehearsal update' : 'e.g. Numeracy — fractions worksheet'}
              className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-marigold-400 focus:outline-none focus:ring-2 focus:ring-marigold-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-800">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Write what parents should know…"
              className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-marigold-400 focus:outline-none focus:ring-2 focus:ring-marigold-100"
            />
          </div>
          <p className="text-xs text-ink-400">
            This is a Phase 1 preview — sending here won&apos;t deliver a real notification yet.
          </p>
          <Button fullWidth disabled={status === 'sending' || !title} onClick={handleSend}>
            {status === 'sending' ? 'Sending…' : kind === 'update' ? 'Send update' : 'Post workload'}
          </Button>
        </div>
      )}
    </Modal>
  )
}
