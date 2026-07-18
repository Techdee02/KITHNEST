import type { Subject } from '../lib/types'

export const subjects: Subject[] = [
  { id: 'sub-numeracy', name: 'Numeracy', colorToken: 'marigold' },
  { id: 'sub-english', name: 'English Studies', colorToken: 'teal' },
  { id: 'sub-phonics', name: 'Phonics', colorToken: 'coral' },
  { id: 'sub-handwriting', name: 'Handwriting', colorToken: 'marigold' },
  { id: 'sub-basicscience', name: 'Basic Science', colorToken: 'teal' },
  { id: 'sub-socialstudies', name: 'Social Studies', colorToken: 'coral' },
  { id: 'sub-creativearts', name: 'Creative Arts', colorToken: 'marigold' },
  { id: 'sub-quantreasoning', name: 'Quantitative Reasoning', colorToken: 'teal' },
  { id: 'sub-verbalreasoning', name: 'Verbal Reasoning', colorToken: 'coral' },
  { id: 'sub-phe', name: 'Physical & Health Education', colorToken: 'marigold' },
]

export const subjectById = (id: string) => subjects.find((s) => s.id === id)
