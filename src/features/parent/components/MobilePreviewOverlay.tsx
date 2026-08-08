import { Icon } from '../../../design-system/components/Icon'

/**
 * Demo control — renders the parent app inside an actual narrow iframe (not just
 * a resized div) so real responsive breakpoints (sidebar, bottom nav, grid
 * columns) render exactly as they would on a real phone, rather than reacting
 * to the laptop's real viewport width.
 */
export function MobilePreviewOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/75 p-6 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 flex items-center gap-1.5 rounded-pill bg-white/10 px-3.5 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
      >
        <Icon name="x" className="h-4 w-4" />
        Exit mobile view
      </button>

      <div
        className="relative flex overflow-hidden rounded-[2.75rem] border-[10px] border-ink-900 bg-ink-50 shadow-warm-lg"
        style={{ height: 'min(844px, 85vh)', aspectRatio: '390 / 844' }}
      >
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-ink-900" />
        <iframe src="/parent" title="Kithnest — mobile preview" className="h-full w-full flex-1 border-0" />
      </div>
    </div>
  )
}
