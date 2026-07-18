import type { ReactElement, SVGProps } from 'react'

export type IconName =
  | 'home'
  | 'calendar'
  | 'bell'
  | 'user'
  | 'users'
  | 'building'
  | 'wifi-off'
  | 'refresh'
  | 'check'
  | 'check-circle'
  | 'clock'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'arrow-right'
  | 'plus'
  | 'log-out'
  | 'phone'
  | 'message'
  | 'megaphone'
  | 'trophy'
  | 'alert'
  | 'upload'
  | 'search'
  | 'x'
  | 'menu'
  | 'sparkle'
  | 'book'
  | 'shield'

const paths: Record<IconName, ReactElement> = {
  home: (
    <>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16" />
    </>
  ),
  bell: (
    <>
      <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c0-3 2.5-5.3 5.5-5.3s5.5 2.3 5.5 5.3" />
      <path d="M15.5 6a2.8 2.8 0 0 1 0 5.5" />
      <path d="M18 13.7c2 .4 3.5 2.3 3.5 4.6" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3.5" width="10" height="17" rx="1.5" />
      <path d="M15 9.5h4v11h-4" />
      <path d="M8.5 7.5h.01M11.5 7.5h.01M8.5 11h.01M11.5 11h.01M8.5 14.5h.01M11.5 14.5h.01" />
    </>
  ),
  'wifi-off': (
    <>
      <path d="M3 8.5c1.9-1.8 4.3-2.9 7-3.2M14.5 5.9c1.9.4 3.7 1.3 5.5 2.9" />
      <path d="M6.5 12.3c1.5-1.2 3.3-1.9 5.2-2M17 12c.9.5 1.7 1.1 2.5 1.9" />
      <path d="M9.7 16c.7-.4 1.5-.6 2.3-.6.9 0 1.7.2 2.4.7" />
      <circle cx="12" cy="19.3" r="1" fill="currentColor" stroke="none" />
      <path d="M3 3l18 18" />
    </>
  ),
  refresh: (
    <>
      <path d="M4 12a8 8 0 0 1 13.8-5.5L20 8.5" />
      <path d="M20 4.5v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.8 5.5L4 15.5" />
      <path d="M4 19.5v-4h4" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3l2.4 2.4L15.7 9.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  'chevron-right': <path d="M9.5 5.5 16 12l-6.5 6.5" />,
  'chevron-left': <path d="M14.5 5.5 8 12l6.5 6.5" />,
  'chevron-down': <path d="M5.5 9.5 12 16l6.5-6.5" />,
  'arrow-right': (
    <>
      <path d="M4.5 12h15" />
      <path d="M13 5.5 19.5 12 13 18.5" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  'log-out': (
    <>
      <path d="M9 20H5.5a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 5.5 4H9" />
      <path d="M14.5 16.5 19 12l-4.5-4.5" />
      <path d="M19 12H9" />
    </>
  ),
  phone: (
    <path d="M6 3.5h2.5l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V16a2 2 0 0 1-2 2C10.5 18 4 11.5 4 6a2 2 0 0 1 2-2.5Z" />
  ),
  message: (
    <path d="M4 5.5h16v11H9.5L5 20v-3.5H4Z" />
  ),
  megaphone: (
    <>
      <path d="M4 10.5v3a1 1 0 0 0 1 1h1.5l1 4h2l-.8-4H11l7 3v-11l-7 3H6.5A1 1 0 0 0 4 10.5Z" />
      <path d="M18 8v8" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5.5H4.5a2 2 0 0 0 0 4H6" />
      <path d="M17 5.5h2.5a2 2 0 0 1 0 4H18" />
      <path d="M12 14v3" />
      <path d="M8.5 20.5h7l-1-3.5h-5l-1 3.5Z" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15.5V4.5" />
      <path d="M7.5 9 12 4.5 16.5 9" />
      <path d="M5 15.5v3a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-3" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M19 19l-4.3-4.3" />
    </>
  ),
  x: (
    <>
      <path d="M5.5 5.5 18.5 18.5" />
      <path d="M18.5 5.5 5.5 18.5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6.5h16" />
      <path d="M4 12h16" />
      <path d="M4 17.5h16" />
    </>
  ),
  sparkle: (
    <path d="M12 3.5 13.5 9.5 19.5 11 13.5 12.5 12 18.5 10.5 12.5 4.5 11 10.5 9.5 12 3.5Z" />
  ),
  book: (
    <>
      <path d="M4.5 5.5A2 2 0 0 1 6.5 4H12v16H6.5a2 2 0 0 0-2 2Z" />
      <path d="M19.5 5.5A2 2 0 0 0 17.5 4H12v16h5.5a2 2 0 0 1 2 2Z" />
    </>
  ),
  shield: (
    <path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6Z" />
  ),
}

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
  ...props
}: { name: IconName; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
