const HONORIFICS = new Set(['mr.', 'mrs.', 'miss', 'dr.', 'alhaji', 'alhaja', 'chief', 'engr.', 'barr.'])

export function firstNameOf(fullName: string): string {
  const parts = fullName.split(' ').filter(Boolean)
  const withoutHonorific = parts.filter((p) => !HONORIFICS.has(p.toLowerCase()))
  return withoutHonorific[0] ?? fullName
}
