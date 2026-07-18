import type { Pupil } from '../lib/types'

export const pupils: Pupil[] = [
  {
    id: 'pup-zainab',
    name: 'Zainab Adeyemi',
    preferredName: 'Zainab',
    classId: 'cls-sunflower',
    avatarInitials: 'ZA',
    avatarColor: 'teal',
  },
  {
    id: 'pup-kanyin',
    name: 'Kanyinsola Adeyemi',
    preferredName: 'Kanyin',
    classId: 'cls-ladybird',
    avatarInitials: 'KA',
    avatarColor: 'coral',
  },
]

export const pupilById = (id: string) => pupils.find((p) => p.id === id)
