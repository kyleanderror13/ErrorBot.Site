export function plural(text: string, count: number): string {
  return count === 1 ? text : text + 's'
}