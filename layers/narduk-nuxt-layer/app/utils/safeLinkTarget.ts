export function safeLinkTarget(target: string | null | undefined): string | undefined {
  if (!target || typeof target !== 'string' || target.trim() === '') {
    return undefined
  }
  // Optional: Add logic here to reject malformed routes or unsafe protocols
  if (target.startsWith('javascript:')) {
    return undefined
  }
  return target
}
