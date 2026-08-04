import { useState } from 'react'
import { Modal } from '../../../design-system/components/Modal'
import { Button } from '../../../design-system/components/Button'
import { Icon } from '../../../design-system/components/Icon'
import { useSchoolData } from '../context/SchoolDataContext'

export function PostUpdateModal({ open, onClose, kind }: { open: boolean; onClose: () => void; kind: 'update' | 'workload' }) {
  const { postUpdate, isPostingUpdate, postUpdateError, totalConnectedParents } = useSchoolData()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')

  function handleClose() {
    setStatus('idle')
    setTitle('')
    setBody('')
    onClose()
  }

  async function handleSend() {
    const success = await postUpdate({
      title,
      body,
      category: kind === 'workload' ? 'workload' : 'announcement',
    })
    if (success) setStatus('sent')
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
            Live now for any parent linked to your school code
            {totalConnectedParents ? `, ${totalConnectedParents} connected` : ''}. Real SMS delivery
            is a Phase 2 follow-up.
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
          {postUpdateError && (
            <div className="flex items-start gap-2 rounded-xl bg-coral-50 px-3.5 py-3 text-sm text-coral-700">
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{postUpdateError}</span>
            </div>
          )}
          <p className="text-xs text-ink-400">
            This posts for real — any parent signed in with your school code will see it.
          </p>
          <Button fullWidth disabled={isPostingUpdate || !title || !body} onClick={handleSend}>
            {isPostingUpdate ? 'Sending…' : kind === 'update' ? 'Send update' : 'Post workload'}
          </Button>
        </div>
      )}
    </Modal>
  )
}
