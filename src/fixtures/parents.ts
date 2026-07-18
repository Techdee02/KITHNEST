import type { ParentAccount } from '../lib/types'

export const parents: ParentAccount[] = [
  {
    id: 'par-adeyemi',
    name: 'Mrs. Amaka Adeyemi',
    phone: '0803 214 7765',
    pupilIds: ['pup-zainab', 'pup-kanyin'],
    schoolId: 'sch-brightkids',
  },
]

export const defaultParent = parents[0]
