import { useEffect, useRef, useState } from 'react'
import { listSandboxFiles, readSandboxFile } from '@/service/sandbox-files'

interface MappingRule {
  original: string
  replacement: string
}

interface MappingFile {
  version?: string
  rules?: MappingRule[]
}

type ReplacePair = { masked: string; original: string }

let cachedPairs: ReplacePair[] | null = null
let cacheTs = 0
const CACHE_TTL = 60000

async function loadPairs(): Promise<ReplacePair[]> {
  if (cachedPairs && Date.now() - cacheTs < CACHE_TTL)
    return cachedPairs

  const sandboxPath = localStorage.getItem('sandbox_path') || ''
  if (!sandboxPath)
    return []

  try {
    const files = await listSandboxFiles(sandboxPath)
    const mappingFiles = files.filter(
      (f) => f.name.endsWith('.mapping.json'),
    )
    const pairs: ReplacePair[] = []
    for (const mf of mappingFiles) {
      try {
        const raw = await readSandboxFile(sandboxPath, mf.name)
        const data: MappingFile = JSON.parse(raw)
        if (!data.rules) continue
        for (const rule of data.rules) {
          if (rule.replacement && rule.original)
            pairs.push({ masked: rule.replacement, original: rule.original })
        }
      }
      catch { /* skip bad file */ }
    }
    pairs.sort((a, b) => b.masked.length - a.masked.length)
    cachedPairs = pairs
    cacheTs = Date.now()
    return pairs
  }
  catch {
    return cachedPairs || []
  }
}

function applyReverse(text: string, pairs: ReplacePair[]): string {
  let result = text
  for (const { masked, original } of pairs)
    result = result.split(masked).join(original)
  return result
}

export function useReverseMask(content: string): string {
  const [output, setOutput] = useState(content)
  const prevContent = useRef(content)

  useEffect(() => {
    let cancelled = false
    loadPairs().then((pairs) => {
      if (cancelled) return
      if (pairs.length === 0) {
        setOutput(content)
        return
      }
      setOutput(applyReverse(content, pairs))
    })
    return () => { cancelled = true }
  }, [content])

  if (cachedPairs && cachedPairs.length > 0 && content !== prevContent.current) {
    prevContent.current = content
    const fast = applyReverse(content, cachedPairs)
    if (fast !== output)
      return fast
  }

  return output
}

export function invalidateReverseMaskCache(): void {
  cachedPairs = null
  cacheTs = 0
}
