const BANNER_GLYPHS = '░▒▓█#?/<>-+*=|'
const ASCII_SHIMMER_MIN_DELAY = 2000
const ASCII_SHIMMER_MAX_DELAY = 5000
const ASCII_SHIMMER_FLICKER_DURATION = 220
const ASCII_EMBER_COUNT = 5
const ANSI_ESCAPE = '\u001b['
const ANSI_RESET = `${ANSI_ESCAPE}0m`
const ANSI_RED = `${ANSI_ESCAPE}31m`
const ANSI_WHITE = `${ANSI_ESCAPE}37m`
const GLITCH_SYMBOLS = '@#%X?!$'
const NORMAL_SMILEY_FACE = [
  "       _.-'''''-._",
  "     .'  _     _  '.",
  "    /   (o)   (o)   \\",
  '   |                 |',
  '   |  \\           /  |',
  "    \\  '.       .'  /",
  "     '.  `'---'`  .'",
  "       '-._____.-'"
]
const IMPOSTER_SMILEY_FACE = [
  "  , ; ,   .-'\"\"'-.    , ; ,",
  "  \\\\|/  .'         '.  \\|//",
  '   \\-;-/   ()   ()   \\-;-/ ',
  '   // ;               ; \\\\',
  '  //__; :.         .; ;__\\',
  " `-----\\'.'-.....-'.'\\-----'",
  "        '.'.-.-,_.'.'",
  "          '(  (..-'",
  "            '-'"
]

const asciiIdleTargets = new WeakSet<HTMLElement>()

export type FlagBannerConfig = {
  art: string
  frameInterval?: number
}

export type SmileyOverlayConfig = {
  gap?: number
}

export async function animateBannerReveal(element: HTMLElement, finalText: string) {
  const targetChars = finalText.split('')
  const displayChars = targetChars.map((char) => (char === '\n' ? '\n' : randomBannerGlyph()))
  const revealable = targetChars
    .map((char, index) => (char === '\n' ? -1 : index))
    .filter((index) => index >= 0)

  shuffleArray(revealable)
  const batchSize = Math.max(1, Math.floor(revealable.length / 18))

  while (revealable.length) {
    for (let i = 0; i < batchSize && revealable.length; i++) {
      const index = revealable.pop()!
      displayChars[index] = targetChars[index]
    }

    for (let i = 0; i < displayChars.length; i++) {
      if (targetChars[i] === '\n') continue
      if (displayChars[i] !== targetChars[i]) {
        displayChars[i] = randomBannerGlyph()
      }
    }

    element.textContent = displayChars.join('')
    await delay(30)
  }

  element.textContent = finalText
}

export function enableAsciiIdleEffects(element: HTMLElement) {
  element.classList.add('ascii-idle')
  element.style.setProperty('--cursor-delay', `${randomBetween(0, 4).toFixed(2)}s`)

  if (asciiIdleTargets.has(element)) {
    return
  }

  asciiIdleTargets.add(element)
  scheduleAsciiShimmer(element)
  attachAsciiEmbers(element)
}

export function attachAsciiEmbers(element: HTMLElement) {
  if (element.dataset.embersAttached === 'true') return
  if (!element.parentElement) return

  const emberRow = document.createElement('div')
  emberRow.className = 'ascii-embers'

  for (let i = 0; i < ASCII_EMBER_COUNT; i++) {
    const ember = document.createElement('span')
    ember.className = 'ascii-ember'
    ember.textContent = '░'
    ember.style.animationDelay = `${randomBetween(0, 3).toFixed(2)}s`
    emberRow.appendChild(ember)
  }

  element.insertAdjacentElement('afterend', emberRow)
  element.dataset.embersAttached = 'true'
}

export function startFlagWaveAnimation(target: HTMLElement, config: FlagBannerConfig) {
  const lines = prepareFlagBannerLines(config.art)
  if (!lines.length) {
    target.textContent = ''
    return () => {}
  }

  const totalRows = lines.length
  const midpoint = Math.ceil(totalRows / 2)
  const frameDelay = config.frameInterval ?? 110
  let phase = 0

  const renderFrame = () => {
    const frameLines = lines.map((_, rowIndex) => {
      const verticalShift = Math.round(Math.sin(phase + rowIndex * 0.35) * 0.6)
      const sourceIndex = clamp(rowIndex + verticalShift, 0, totalRows - 1)
      const sourceLine = lines[sourceIndex]
      const horizontalShift = Math.round(Math.sin(phase * 1.2 + rowIndex * 0.25) * 2)
      const warped = shearLine(shiftLineHorizontally(sourceLine, horizontalShift), rowIndex, phase)
      const colorCode = rowIndex < midpoint ? ANSI_RED : ANSI_WHITE
      return `${colorCode}${warped}${ANSI_RESET}`
    })

    renderAnsiString(target, frameLines.join('\n'))
    phase += 0.25
  }

  renderFrame()
  const intervalId = window.setInterval(renderFrame, frameDelay)
  return () => window.clearInterval(intervalId)
}

export function startSmileyCompositeAnimation(
  target: HTMLElement,
  asciiArt: string,
  config: SmileyOverlayConfig = {}
) {
  const rightLines = prepareFlagBannerLines(asciiArt)
  const rightWidth = maxLineWidth(rightLines)
  const smileyWidth = Math.max(maxLineWidth(NORMAL_SMILEY_FACE), maxLineWidth(IMPOSTER_SMILEY_FACE))
  const baseHeight = Math.max(rightLines.length, NORMAL_SMILEY_FACE.length, IMPOSTER_SMILEY_FACE.length)
  const paddedRight = padLinesVertically(padLinesToWidth(rightLines, rightWidth), baseHeight, rightWidth)
  const paddedNormal = padLinesVertically(padLinesToWidth(NORMAL_SMILEY_FACE, smileyWidth), baseHeight, smileyWidth)
  const paddedImposter = padLinesVertically(padLinesToWidth(IMPOSTER_SMILEY_FACE, smileyWidth), baseHeight, smileyWidth)
  const gap = ' '.repeat(Math.max(2, Math.floor(config.gap ?? 2)))

  let stablePhase: 'normal' | 'imposter' = 'normal'
  let pendingPhase: 'normal' | 'imposter' = 'imposter'
  let displayPhase: 'normal' | 'glitch' | 'imposter' = 'normal'
  let stableFrames = 0
  let glitchFramesGoal = 0
  let glitchFrameCount = 0

  const intervalId = window.setInterval(() => {
    let smileyLines: string[]

    if (displayPhase === 'glitch') {
      if (!glitchFramesGoal) {
        glitchFramesGoal = Math.floor(Math.random() * 2) + 1
      }
      const fromLines = stablePhase === 'normal' ? paddedNormal : paddedImposter
      const toLines = pendingPhase === 'normal' ? paddedNormal : paddedImposter
      smileyLines = buildSmileyGlitchFrame(fromLines, toLines)
      glitchFrameCount++
      if (glitchFrameCount >= glitchFramesGoal) {
        stablePhase = pendingPhase
        displayPhase = pendingPhase
        pendingPhase = stablePhase === 'normal' ? 'imposter' : 'normal'
        glitchFrameCount = 0
        glitchFramesGoal = 0
        stableFrames = 0
      }
    } else {
      smileyLines = displayPhase === 'normal' ? paddedNormal : paddedImposter
      stableFrames++
      const targetDuration = displayPhase === 'normal' ? 34 : 30
      if (stableFrames >= targetDuration) {
        displayPhase = 'glitch'
      }
    }

    const composite = combineAsciiBlocks(smileyLines, paddedRight, gap)
    target.textContent = composite.join('\n')
  }, 160)

  return () => window.clearInterval(intervalId)
}

function scheduleAsciiShimmer(element: HTMLElement) {
  if (!element.isConnected) return
  const delay = randomBetween(ASCII_SHIMMER_MIN_DELAY, ASCII_SHIMMER_MAX_DELAY)
  window.setTimeout(() => {
    if (!element.isConnected) return
    runAsciiShimmer(element)
    scheduleAsciiShimmer(element)
  }, delay)
}

function runAsciiShimmer(element: HTMLElement) {
  const base = element.textContent ?? ''
  if (!base.trim()) return

  const chars = base.split('')
  const candidates = chars
    .map((char, index) => (char === '\n' ? -1 : index))
    .filter((index) => index >= 0)
  if (!candidates.length) return

  shuffleArray(candidates)
  const flickerCount = Math.min(12, Math.max(3, Math.floor(candidates.length * 0.08)))
  const flickerSlots = candidates.slice(0, flickerCount)
  const scratch = [...chars]

  const interval = window.setInterval(() => {
    flickerSlots.forEach((slot) => {
      scratch[slot] = randomBannerGlyph()
    })
    element.textContent = scratch.join('')
  }, 40)

  window.setTimeout(() => {
    window.clearInterval(interval)
    if (element.isConnected) {
      element.textContent = base
    }
  }, ASCII_SHIMMER_FLICKER_DURATION)
}

function randomBannerGlyph() {
  return BANNER_GLYPHS[Math.floor(Math.random() * BANNER_GLYPHS.length)]
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function shuffleArray<T>(values: T[]) {
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[values[i], values[j]] = [values[j], values[i]]
  }
  return values
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function prepareFlagBannerLines(art: string) {
  const trimmed = art.replace(/\s+$/u, '')
  if (!trimmed.length) return []
  const rows = trimmed.split('\n')
  const width = rows.reduce((max, line) => Math.max(max, line.length), 0)
  return rows.map((line) => line.padEnd(width, ' '))
}

function shiftLineHorizontally(line: string, offset: number) {
  if (!offset) return line
  const width = line.length
  const delta = Math.min(Math.abs(offset), width)
  if (offset > 0) {
    return `${' '.repeat(delta)}${line.slice(0, width - delta)}`
  }
  return `${line.slice(delta)}${' '.repeat(delta)}`
}

function shearLine(line: string, rowIndex: number, phase: number) {
  const chars = line.split('')
  const direction = Math.sin(phase + rowIndex * 0.45) >= 0 ? 1 : -1
  for (let i = 2; i < chars.length - 2; i += 12) {
    if (chars[i] === ' ') continue
    const targetIndex = clamp(i + direction, 0, chars.length - 1)
    const temp = chars[targetIndex]
    chars[targetIndex] = chars[i]
    chars[i] = temp
  }
  return chars.join('')
}

function renderAnsiString(target: HTMLElement, text: string) {
  const fragments = parseAnsiFragments(text)
  target.replaceChildren()
  fragments.forEach(({ segment, color }) => {
    if (!segment) return
    if (color) {
      const span = document.createElement('span')
      span.style.color = color
      span.textContent = segment
      target.appendChild(span)
    } else {
      target.appendChild(document.createTextNode(segment))
    }
  })
}

function padLinesToWidth(lines: string[], width: number) {
  if (!width) return lines.slice()
  return lines.map((line) => line.padEnd(width, ' '))
}

function padLinesVertically(lines: string[], height: number, width: number) {
  if (lines.length >= height) return lines.slice()
  const blank = width ? ' '.repeat(width) : ''
  const diff = height - lines.length
  const top = Math.floor(diff / 2)
  const bottom = diff - top
  return [...Array(top).fill(blank), ...lines, ...Array(bottom).fill(blank)]
}

function combineAsciiBlocks(left: string[], right: string[], gap: string) {
  const height = Math.max(left.length, right.length)
  const rows: string[] = []
  for (let i = 0; i < height; i++) {
    const leftLine = left[i] ?? ''
    const rightLine = right[i] ?? ''
    rows.push(`${leftLine}${gap}${rightLine}`)
  }
  return rows
}

function buildSmileyGlitchFrame(fromLines: string[], toLines: string[]) {
  return fromLines.map((line, rowIndex) => {
    const target = toLines[rowIndex] ?? line
    const chars = line.split('')
    for (let i = 0; i < chars.length; i++) {
      const roll = Math.random()
      if (roll < 0.2) {
        chars[i] = GLITCH_SYMBOLS[Math.floor(Math.random() * GLITCH_SYMBOLS.length)]
      } else if (roll < 0.38) {
        chars[i] = target[i] ?? chars[i]
      }
    }
    const shiftRoll = Math.random()
    const shift = shiftRoll < 0.35 ? (shiftRoll < 0.525 ? -1 : 1) : 0
    return shiftLineHorizontally(chars.join(''), shift)
  })
}

function maxLineWidth(lines: string[]) {
  return lines.reduce((max, line) => Math.max(max, line.length), 0)
}

function parseAnsiFragments(text: string) {
  const fragments: { segment: string; color: string | null }[] = []
  const pattern = /\x1b\[(\d+)m/g
  let lastIndex = 0
  let activeColor: string | null = null
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text))) {
    const chunk = text.slice(lastIndex, match.index)
    if (chunk) {
      fragments.push({ segment: chunk, color: activeColor })
    }
    activeColor = resolveAnsiColor(match[1], activeColor)
    lastIndex = pattern.lastIndex
  }

  const tail = text.slice(lastIndex)
  if (tail) {
    fragments.push({ segment: tail, color: activeColor })
  }

  return fragments
}

function resolveAnsiColor(code: string, current: string | null) {
  if (code === '0') return null
  if (code === '31') return '#ff4d4d'
  if (code === '37') return '#fefefe'
  return current
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
