const HONORIFICS = new Set(['mr.', 'mrs.', 'miss', 'dr.', 'alhaji', 'alhaja', 'chief', 'engr.', 'barr.'])

/** "Mrs. Amaka Adeyemi" -> "Mrs. Adeyemi" — the polite short form used in greetings. */
export function formalNameOf(fullName: string): string {
  const parts = fullName.split(' ').filter(Boolean)
  const honorific = parts.find((p) => HONORIFICS.has(p.toLowerCase()))
  const surname = parts[parts.length - 1] ?? fullName
  return honorific ? `${honorific} ${surname}` : surname
}
