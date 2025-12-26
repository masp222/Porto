import {
  PROMPT,
  COMMAND_COLUMN_WIDTH,
  TYPEWRITER_DELAY,
  bannerAscii,
  introLines,
  commandSummaries,
  windowBlueprints,
  projectEntries,
  WINDOW_LAYOUT_CLASS,
  PROJECT_LINK_BLUEPRINTS,
  ICON_GLYPHS,
  deriveDemoIconKey,
  type CommandKey,
  type LineContent,
  type LineSegment,
  type ReplicaLine,
  type TerminalVariant,
  type WindowDescriptor,
  type ProjectEntry,
  type IconKey,
  type ContactIcon
} from './commands'
import {
  animateBannerReveal,
  enableAsciiIdleEffects,
  attachAsciiEmbers,
  startFlagWaveAnimation,
  startSmileyCompositeAnimation,
  type FlagBannerConfig,
  type SmileyOverlayConfig
} from './animations'

const SVG_NS = 'http://www.w3.org/2000/svg'

let shell!: HTMLDivElement
let output!: HTMLDivElement
let windowPanel!: HTMLDivElement
let terminalFrame!: HTMLDivElement
let cursorLine!: HTMLDivElement
let cursorInput!: HTMLSpanElement
let typingQueue: Promise<void> = Promise.resolve()
let activeProjectModal: HTMLDivElement | null = null
let windowCleanupMap = new WeakMap<HTMLElement, Array<() => void>>()
let pageScrollIndicator: HTMLDivElement | null = null

const PAGE_SCROLL_EPSILON = 8
const AVAILABLE_COMMANDS = Array.from(
  new Set([...commandSummaries.map(({ command }) => command), 'help'])
)
const commandHistory: string[] = []
let historyIndex = 0

const windowLayoutClassList = Array.from(
  new Set(
    Object.values(WINDOW_LAYOUT_CLASS).filter((value): value is string => Boolean(value))
  )
)

export function bootstrapTerminal() {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) throw new Error('Root #app element missing')

  app.innerHTML = `
    <main class="shell" id="webshell">
      <section class="terminal-panel">
        <div class="terminal-frame">
          <div class="stacked-bars terminal-stack" aria-hidden="true">
            <div id="bar-1" class="stack-bar stack-bar-title">WebShell.x64_x86</div>
            <div id="bar-2" class="stack-bar stack-bar-accent"></div>
            <div id="bar-3" class="stack-bar stack-bar-accent"></div>
            <div id="bar-4" class="stack-bar stack-bar-accent"></div>
            <div id="bar-5" class="stack-bar stack-bar-accent"></div>
          </div>
          <div class="terminal-output" aria-live="polite"></div>
        </div>
      </section>
      <section class="window-panel" aria-live="polite"></section>
    </main>
  `

  shell = document.querySelector<HTMLDivElement>('#webshell')!
  output = shell.querySelector<HTMLDivElement>('.terminal-output')!
  windowPanel = shell.querySelector<HTMLDivElement>('.window-panel')!
  terminalFrame = shell.querySelector<HTMLDivElement>('.terminal-frame')!
  initializePageScrollIndicator()

  cursorLine = createCursorLine()
  output.appendChild(cursorLine)
  cursorInput = cursorLine.querySelector<HTMLSpanElement>('.cursor-input')!

  typingQueue = Promise.resolve()
  activeProjectModal = null
  windowCleanupMap = new WeakMap()

  focusCursorInput()
  terminalFrame.addEventListener('click', focusCursorInput)

  cursorInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      submitCommand(cursorInput.textContent ?? '')
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      handleAutocomplete()
      return
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      navigateHistory(event.key === 'ArrowUp' ? 'up' : 'down')
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      cursorInput.textContent = ''
      focusCursorInput()
    }
  })

  renderBanner()
  introLines.forEach((line) => enqueueLine(line, 'muted'))
  announceCommandList()
}

function submitCommand(rawInput: string, options: { recordHistory?: boolean } = {}) {
  const value = rawInput.trim()
  if (!value) return
  cursorInput.textContent = ''
  focusCursorInput()
  if (options.recordHistory !== false) {
    commandHistory.push(value)
    historyIndex = commandHistory.length
  }
  echoPrompt(value)
  handleCommand(value.toLowerCase())
}

function handleCommand(command: string) {
  if (command === 'help') {
    announceCommandList()
    return
  }

  if (command === 'banner') {
    renderBanner().then(() => enqueueLine('banner repainted.', 'success'))
    return
  }

  if (command === 'clear') {
    clearTerminalOutput()
    closeAllWindows()
    enqueueLine('screen cleared.', 'muted')
    return
  }

  if ((['about', 'projects', 'cv', 'education'] as const).includes(command as CommandKey)) {
    enqueueLine(`executing ${command}.sh ...`, 'success').then(() =>
      openCommandWindows(command as CommandKey)
    )
    return
  }

  enqueueLine(`command not found: ${command}`, 'error')
}

function echoPrompt(value: string) {
  const line = document.createElement('div')
  line.className = 'terminal-line prompt-echo'
  line.innerHTML = `<span class="prompt-label">${PROMPT}</span>${value}`
  insertBeforeCursor(line)
}

function enqueueLine(content: LineContent, variant: TerminalVariant = 'info') {
  typingQueue = typingQueue.then(() => typeLine(content, variant))
  return typingQueue
}

async function typeLine(content: LineContent, variant: TerminalVariant) {
  const line = document.createElement('div')
  line.className = `terminal-line ${variant}`
  insertBeforeCursor(line)

  if (typeof content === 'string') {
    await typeCharacters(line, content)
    if (!content.length) {
      scrollOutput()
    }
    return
  }

  for (const segment of content.segments) {
    const segmentElement = createLineSegmentElement(segment)
    line.appendChild(segmentElement)
    await typeCharacters(segmentElement, segment.text)
  }
}

function createLineSegmentElement(segment: LineSegment) {
  let element: HTMLElement
  if (segment.commandKey) {
    element = createCommandShortcut(segment.commandKey)
  } else {
    element = document.createElement('span')
    element.style.whiteSpace = 'pre'
  }

  if (segment.className) {
    element.classList.add(segment.className)
  }

  return element
}

function createCommandShortcut(commandKey: string) {
  const button = document.createElement('button')
  button.type = 'button'
  button.classList.add('command-link')
  button.style.whiteSpace = 'pre'
  button.dataset.command = commandKey
  button.addEventListener('click', (event) => {
    event.stopPropagation()
    submitCommand(commandKey)
  })
  return button
}

async function typeCharacters(target: HTMLElement, text: string, onProgress: () => void = scrollOutput) {
  if (!text.length) {
    onProgress()
    return
  }

  for (const char of text.split('')) {
    target.textContent += char
    onProgress()
    await delay(jitteredDelay())
  }
}

function jitteredDelay() {
  const variance = Math.random() * TYPEWRITER_DELAY * 0.8
  const sign = Math.random() < 0.5 ? -1 : 1
  const base = Math.max(2, TYPEWRITER_DELAY + sign * variance)
  return base
}

function scrollOutput() {
  output.scrollTop = output.scrollHeight
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function navigateHistory(direction: 'up' | 'down') {
  if (!commandHistory.length) {
    cursorInput.textContent = direction === 'down' ? '' : cursorInput.textContent ?? ''
    return
  }

  if (direction === 'up') {
    historyIndex = Math.max(0, historyIndex - 1)
  } else {
    historyIndex = Math.min(commandHistory.length, historyIndex + 1)
  }

  if (historyIndex === commandHistory.length) {
    cursorInput.textContent = ''
  } else {
    cursorInput.textContent = commandHistory[historyIndex]
  }
  focusCursorInput()
}

function handleAutocomplete() {
  const currentValue = cursorInput.textContent ?? ''
  const normalized = currentValue.trim().toLowerCase()
  if (!normalized) return

  const matches = AVAILABLE_COMMANDS.filter((cmd) => cmd.startsWith(normalized))
  if (!matches.length) return

  if (matches.length === 1) {
    cursorInput.textContent = matches[0]
    focusCursorInput()
    return
  }

  const prefix = findCommonPrefix(matches)
  if (prefix && prefix !== normalized) {
    cursorInput.textContent = prefix
    focusCursorInput()
    return
  }

  enqueueLine(
    {
      segments: [{ text: matches.join('  '), className: 'segment-description' }]
    },
    'info'
  )
}

function findCommonPrefix(words: string[]) {
  if (!words.length) return ''
  let prefix = words[0]
  for (const word of words.slice(1)) {
    while (!word.startsWith(prefix)) {
      prefix = prefix.slice(0, -1)
      if (!prefix) return ''
    }
  }
  return prefix
}

async function openCommandWindows(command: CommandKey) {
  await closeAllWindows(true, true)
  setWindowPresence(true)
  setWindowLayout(command)

  if (command === 'projects') {
    renderProjectWindows()
    return
  }

  const descriptors = windowBlueprints[command]
  descriptors.forEach((descriptor, index) => {
    const windowElement = createWindowElement(descriptor, index, command)
    if (command === 'about') {
      windowElement.classList.add(index < 2 ? 'about-primary' : 'about-secondary')
    }
    appendWindowElement(windowElement)
  })
  updatePageScrollIndicator()
}

function setWindowPresence(active: boolean) {
  shell.classList.toggle('has-windows', active)
  updatePageScrollIndicator()
}

function setWindowLayout(command: CommandKey | null) {
  windowLayoutClassList.forEach((cls) => windowPanel.classList.remove(cls))
  if (command && WINDOW_LAYOUT_CLASS[command]) {
    windowPanel.classList.add(WINDOW_LAYOUT_CLASS[command]!)
  }
}

function appendWindowElement(element: HTMLElement) {
  windowPanel.appendChild(element)
}

function initializePageScrollIndicator() {
  if (pageScrollIndicator?.parentElement) {
    pageScrollIndicator.remove()
  }

  pageScrollIndicator = document.createElement('div')
  pageScrollIndicator.className = 'panel-scroll-indicator'

  const label = document.createElement('span')
  label.className = 'indicator-label'
  label.textContent = 'S\nC\nR\nO\nL\nL'

  const arrowDown = document.createElement('span')
  arrowDown.className = 'indicator-arrow arrow-down'
  arrowDown.textContent = '\\V/'

  pageScrollIndicator.appendChild(label)
  pageScrollIndicator.appendChild(arrowDown)

  document.body.appendChild(pageScrollIndicator)
  window.removeEventListener('scroll', handlePageScroll)
  window.removeEventListener('resize', handlePageScroll)
  window.addEventListener('scroll', handlePageScroll)
  window.addEventListener('resize', handlePageScroll)
  updatePageScrollIndicator()
}

function handlePageScroll() {
  updatePageScrollIndicator()
}

function updatePageScrollIndicator() {
  if (!pageScrollIndicator) return
  const doc = document.documentElement
  const scrollRange = doc.scrollHeight - window.innerHeight
  const hasOverflow = scrollRange > PAGE_SCROLL_EPSILON
  const hasBelow = hasOverflow && window.scrollY < scrollRange - PAGE_SCROLL_EPSILON

  pageScrollIndicator.classList.toggle('visible', hasBelow)
  pageScrollIndicator.classList.toggle('has-below', hasBelow)
}

function closeAllWindows(immediate = false, preserveLayout = false) {
  closeProjectModal()
  const windows = windowPanel
    ? Array.from(windowPanel.querySelectorAll<HTMLElement>('.ascii-window, .terminal-shell-window'))
    : []
  if (!windows.length) {
    if (!preserveLayout) {
      setWindowPresence(false)
      setWindowLayout(null)
    }
    updatePageScrollIndicator()
    return Promise.resolve()
  }

  if (immediate) {
    windows.forEach((win) => {
      runWindowCleanups(win)
      win.remove()
    })
    if (!preserveLayout) {
      setWindowPresence(false)
      setWindowLayout(null)
    }
    updatePageScrollIndicator()
    return Promise.resolve()
  }

  return Promise.all(
    windows.map((win) => {
      runWindowCleanups(win)
      return animateClose(win)
    })
  ).then(() => {
    if (!preserveLayout) {
      setWindowPresence(false)
      setWindowLayout(null)
    }
    updatePageScrollIndicator()
  })
}

function createWindowElement(descriptor: WindowDescriptor, index: number, command: CommandKey) {
  if (descriptor.terminalReplica) {
    return createTerminalReplicaWindow(descriptor, index, command)
  }

  const wrapper = document.createElement('article')
  wrapper.className = 'ascii-window'
  wrapper.style.setProperty('--stagger', `${index * 80}ms`)
  if (descriptor.accent) {
    wrapper.classList.add(`accent-${descriptor.accent}`)
  }
  if (descriptor.photoSrc) {
    wrapper.classList.add('photo-window')
  }

  const { element: chrome, closeBtn } = buildWindowChrome(command, descriptor.title)
  wrapper.appendChild(chrome)

  let body: HTMLElement
  if (descriptor.contacts?.length) {
    body = buildContactsBody(descriptor)
  } else if (descriptor.embedUrl) {
    body = buildEmbedBody(descriptor)
  } else if (descriptor.photoSrc) {
    body = buildPhotoBody(descriptor)
  } else {
    body = buildTextBody(descriptor)
  }

  wrapper.appendChild(body)
  closeBtn.addEventListener('click', () => closeWindow(wrapper))

  return wrapper
}

function buildWindowChrome(section: CommandKey, descriptorTitle?: string) {
  const chrome = document.createElement('header')
  chrome.className = 'window-chrome'

  const title = document.createElement('span')
  title.className = 'window-title'
  title.textContent = section.toUpperCase()
  chrome.appendChild(title)

  const closeBtn = document.createElement('button')
  closeBtn.className = 'window-close'
  const closeTarget = descriptorTitle ? `${section} ${descriptorTitle}` : `${section} window`
  closeBtn.setAttribute('aria-label', `Close ${closeTarget}`)
  closeBtn.textContent = '[ x ]'
  chrome.appendChild(closeBtn)

  return { element: chrome, closeBtn }
}

function appendDescriptorHeading(target: HTMLElement, descriptor: WindowDescriptor) {
  if (!descriptor.title) return
  const heading = document.createElement('p')
  heading.className = 'window-heading'
  heading.textContent = descriptor.title
  target.appendChild(heading)
}

function buildContactsBody(descriptor: WindowDescriptor) {
  const body = document.createElement('div')
  body.className = 'window-body contacts-body'
  appendDescriptorHeading(body, descriptor)

  const list = document.createElement('ul')
  list.className = 'contacts-list'

  descriptor.contacts?.forEach((entry) => {
    const item = document.createElement('li')
    item.className = 'contact-row'

    const iconWrap = document.createElement('span')
    iconWrap.className = 'contact-icon'
    iconWrap.appendChild(createContactIcon(entry.icon))
    item.appendChild(iconWrap)

    const textWrap = document.createElement('div')
    textWrap.className = 'contact-text'

    const label = document.createElement('span')
    label.className = 'contact-label'
    label.textContent = entry.label
    textWrap.appendChild(label)

    const valueNode = entry.href ? document.createElement('a') : document.createElement('span')
    valueNode.className = 'contact-value'
    valueNode.textContent = entry.value

    if (entry.href && valueNode instanceof HTMLAnchorElement) {
      valueNode.href = entry.href
      valueNode.target = '_blank'
      valueNode.rel = 'noreferrer'
    }

    textWrap.appendChild(valueNode)
    item.appendChild(textWrap)
    list.appendChild(item)
  })

  body.appendChild(list)
  return body
}

function createTerminalReplicaWindow(descriptor: WindowDescriptor, index: number, command: CommandKey) {
  const wrapper = document.createElement('article')
  wrapper.className = 'terminal-shell-window'
  wrapper.style.setProperty('--stagger', `${index * 80}ms`)
  if (descriptor.accent) {
    wrapper.classList.add(`accent-${descriptor.accent}`)
  }

  const stack = document.createElement('div')
  stack.className = 'terminal-shell-stack'

  const titleBar = document.createElement('div')
  titleBar.className = 'shell-stack-title'
  titleBar.textContent = descriptor.title?.toUpperCase() ?? `${command} SHELL`

  const closeBtn = document.createElement('button')
  closeBtn.className = 'mini-close'
  closeBtn.type = 'button'
  closeBtn.textContent = '[ x ]'
  closeBtn.setAttribute('aria-label', `Close ${descriptor.title ?? 'terminal view'}`)
  titleBar.appendChild(closeBtn)

  stack.appendChild(titleBar)

  for (let i = 0; i < 4; i++) {
    const bar = document.createElement('div')
    bar.className = 'shell-stack-bar'
    stack.appendChild(bar)
  }

  const outputArea = document.createElement('div')
  outputArea.className = 'terminal-shell-output'

  wrapper.appendChild(stack)
  wrapper.appendChild(outputArea)

  closeBtn.addEventListener('click', () => closeWindow(wrapper))
  animateTerminalReplica(
    outputArea,
    descriptor.lines ?? [],
    descriptor.asciiArt,
    descriptor.accent,
    descriptor.flagBanner,
    descriptor.smileyOverlay,
    (cleanup) => registerWindowCleanup(wrapper, cleanup)
  )

  return wrapper
}

function buildTextBody(descriptor: WindowDescriptor) {
  const body = document.createElement('div')
  body.className = 'window-body text-body'
  appendDescriptorHeading(body, descriptor)

  const pre = document.createElement('pre')
  pre.textContent = (descriptor.lines ?? [])
    .map((line) => (typeof line === 'string' ? line : line.text))
    .join('\n')
  body.appendChild(pre)

  return body
}

function buildPhotoBody(descriptor: WindowDescriptor) {
  const wrapper = document.createElement('div')
  wrapper.className = 'window-body photo-body'
  appendDescriptorHeading(wrapper, descriptor)

  const img = document.createElement('img')
  img.src = descriptor.photoSrc!
  img.alt = descriptor.title || 'Portfolio photo'
  wrapper.appendChild(img)

  if (descriptor.lines?.length) {
    const caption = document.createElement('p')
    caption.className = 'photo-caption'
    caption.textContent = descriptor.lines
      .map((line) => (typeof line === 'string' ? line : line.text))
      .join(' / ')
    wrapper.appendChild(caption)
  }

  return wrapper
}

function buildEmbedBody(descriptor: WindowDescriptor) {
  const wrapper = document.createElement('div')
  wrapper.className = 'window-body embed-body'
  appendDescriptorHeading(wrapper, descriptor)

  const iframe = document.createElement('iframe')
  iframe.src = descriptor.embedUrl!
  iframe.title = descriptor.title || 'Embedded document'
  iframe.loading = 'lazy'
  iframe.referrerPolicy = 'no-referrer'
  iframe.setAttribute('aria-label', descriptor.title || 'Embedded document')
  wrapper.appendChild(iframe)

  if (descriptor.lines?.length) {
    const note = document.createElement('p')
    note.className = 'embed-note'
    note.textContent = descriptor.lines
      .map((line) => (typeof line === 'string' ? line : line.text))
      .join(' ')
    wrapper.appendChild(note)
  }

  if (descriptor.embedActions?.length) {
    const actions = document.createElement('div')
    actions.className = 'embed-actions'

    descriptor.embedActions.forEach((action) => {
      const link = document.createElement('a')
      link.className = 'embed-action-btn'
      link.textContent = action.label
      link.href = action.href
      link.target = action.target ?? '_blank'
      link.rel = 'noreferrer'
      if (action.download) {
        const downloadValue = action.download === true ? '' : String(action.download)
        link.setAttribute('download', downloadValue)
      }
      actions.appendChild(link)
    })

    wrapper.appendChild(actions)
  }

  return wrapper
}

function renderProjectWindows() {
  const windows = projectEntries.map((project, index) => createProjectTerminalWindow(project, index))
  windows.forEach((windowElement) => appendWindowElement(windowElement))
  updatePageScrollIndicator()
}

function createProjectTerminalWindow(project: ProjectEntry, orderIndex: number) {
  const descriptor: WindowDescriptor = {
    title: project.title,
    lines: projectLines(project),
    accent: project.accent,
    terminalReplica: true,
    asciiArt: project.asciiArt,
    flagBanner: project.flagBanner,
    smileyOverlay: project.smileyOverlay
  }

  const terminalWindow = createTerminalReplicaWindow(descriptor, orderIndex, 'projects')
  attachProjectModalTrigger(terminalWindow, project)
  return terminalWindow
}

function projectLines(project: ProjectEntry) {
  const lines: ReplicaLine[] = [
    { text: project.title.toUpperCase(), className: 'accent-title' },
    { text: project.shortDescription, className: 'accent-body' },
    '',
    { text: `stack :: ${project.techStack.join(', ')}`, className: 'accent-stack' }
  ]

  PROJECT_LINK_BLUEPRINTS.forEach(({ field, label, icon, iconResolver }) => {
    const url = project[field]
    if (!url) return
    const resolvedIcon = iconResolver ? iconResolver(url) : icon ?? 'generic'
    lines.push(formatLinkLine(label, resolvedIcon, url))
  })

  lines.push('')
  lines.push({ text: 'See more', className: 'accent-link', href: '#see-more', modalTrigger: 'project' })
  return lines
}

function formatLinkLine(label: string, icon: IconKey, url: string): ReplicaLine {
  return {
    text: label,
    className: 'accent-link',
    icon,
    href: url,
    external: true
  }
}

function applyIconGlyph(target: HTMLElement, icon: IconKey) {
  const glyph = ICON_GLYPHS[icon] ?? ICON_GLYPHS.generic
  if (glyph.trim().startsWith('<svg')) {
    target.innerHTML = glyph
  } else {
    target.textContent = glyph
  }
}

function attachProjectModalTrigger(element: HTMLElement, project: ProjectEntry) {
  element.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (target.closest('.window-close, .mini-close, button')) {
      return
    }

    const trigger = target.closest<HTMLAnchorElement>('[data-modal-trigger="project"]')
    if (!trigger) {
      return
    }

    event.preventDefault()
    openProjectModal(project)
  })
}

function openProjectModal(project: ProjectEntry) {
  closeProjectModal()

  const overlay = document.createElement('div')
  overlay.className = 'project-modal-overlay'

  const modal = document.createElement('article')
  modal.className = `ascii-window project-modal accent-${project.accent}`
  modal.style.setProperty('--stagger', '0ms')

  const chrome = document.createElement('header')
  chrome.className = 'window-chrome project-modal-chrome'

  const title = document.createElement('span')
  title.className = 'window-title'
  title.textContent = project.title
  chrome.appendChild(title)

  const closeBtn = document.createElement('button')
  closeBtn.className = 'window-close'
  closeBtn.type = 'button'
  closeBtn.textContent = '[ x ]'
  closeBtn.setAttribute('aria-label', `Close ${project.title} modal`)
  chrome.appendChild(closeBtn)

  modal.appendChild(chrome)

  const body = document.createElement('div')
  body.className = 'window-body project-modal-body'

  const gallery = document.createElement('div')
  gallery.className = 'project-modal-gallery'
  if (project.images.length) {
    const frame = document.createElement('div')
    frame.className = 'project-modal-frame'
    const heroImage = document.createElement('img')
    heroImage.src = project.images[0]
    heroImage.alt = `${project.title} frame 1`
    frame.appendChild(heroImage)

    const controls = document.createElement('div')
    controls.className = 'project-modal-controls'

    const prevBtn = document.createElement('button')
    prevBtn.type = 'button'
    prevBtn.className = 'modal-nav modal-prev'
    prevBtn.textContent = '<'
    prevBtn.setAttribute('aria-label', 'Show previous image')

    const nextBtn = document.createElement('button')
    nextBtn.type = 'button'
    nextBtn.className = 'modal-nav modal-next'
    nextBtn.textContent = '>'
    nextBtn.setAttribute('aria-label', 'Show next image')

    controls.appendChild(prevBtn)
    controls.appendChild(nextBtn)

    let currentIndex = 0
    const total = project.images.length
    const changeImage = (delta: number) => {
      currentIndex = (currentIndex + delta + total) % total
      heroImage.src = project.images[currentIndex]
      heroImage.alt = `${project.title} frame ${currentIndex + 1}`
    }

    prevBtn.addEventListener('click', () => changeImage(-1))
    nextBtn.addEventListener('click', () => changeImage(1))

    gallery.appendChild(frame)
    gallery.appendChild(controls)
  }

  const textBlock = document.createElement('div')
  textBlock.className = 'project-modal-text'
  project.modalDescription.forEach((paragraph) => {
    const p = document.createElement('p')
    p.textContent = paragraph
    textBlock.appendChild(p)
  })

  const linksRow = document.createElement('div')
  linksRow.className = 'project-modal-links'
  if (project.githubUrl) {
    const link = document.createElement('a')
    link.href = project.githubUrl
    link.target = '_blank'
    link.rel = 'noreferrer'
    link.className = 'project-link'
    const icon = document.createElement('span')
    icon.className = 'project-link-icon'
    applyIconGlyph(icon, 'github')
    const label = document.createElement('span')
    label.textContent = 'GitHub Repo'
    link.appendChild(icon)
    link.appendChild(label)
    linksRow.appendChild(link)
  }
  if (project.demoUrl) {
    const link = document.createElement('a')
    link.href = project.demoUrl
    link.target = '_blank'
    link.rel = 'noreferrer'
    link.className = 'project-link'
    const icon = document.createElement('span')
    icon.className = 'project-link-icon'
    const iconKey = deriveDemoIconKey(project.demoUrl)
    applyIconGlyph(icon, iconKey)
    const label = document.createElement('span')
    label.textContent = 'Live Demo'
    link.appendChild(icon)
    link.appendChild(label)
    linksRow.appendChild(link)
  }
  if (project.paperUrl) {
    const link = document.createElement('a')
    link.href = project.paperUrl
    link.target = '_blank'
    link.rel = 'noreferrer'
    link.className = 'project-link'
    const icon = document.createElement('span')
    icon.className = 'project-link-icon'
    applyIconGlyph(icon, 'document')
    const label = document.createElement('span')
    label.textContent = 'Published Paper'
    link.appendChild(icon)
    link.appendChild(label)
    linksRow.appendChild(link)
  }
  if (linksRow.childElementCount) {
    textBlock.appendChild(linksRow)
  }

  const techWrap = document.createElement('div')
  techWrap.className = 'project-modal-tech'
  project.modalTech.forEach((category) => {
    const card = document.createElement('section')
    card.className = 'tech-category'

    const heading = document.createElement('h4')
    heading.textContent = category.label
    card.appendChild(heading)

    const badges = document.createElement('div')
    badges.className = 'tech-badges'

    category.items.forEach((item) => {
      const badge = document.createElement('span')
      badge.className = 'tech-badge'
      if (item.logoKey) {
        const logo = document.createElement('span')
        logo.className = 'tech-badge-logo'
        applyIconGlyph(logo, item.logoKey)
        badge.appendChild(logo)
      }
      const label = document.createElement('span')
      label.textContent = item.name
      badge.appendChild(label)
      badges.appendChild(badge)
    })

    card.appendChild(badges)
    techWrap.appendChild(card)
  })

  body.appendChild(gallery)
  body.appendChild(textBlock)
  body.appendChild(techWrap)
  modal.appendChild(body)
  overlay.appendChild(modal)

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeProjectModal()
    }
  })

  closeBtn.addEventListener('click', () => closeProjectModal())
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        closeProjectModal()
      }
    },
    { once: true }
  )

  document.body.appendChild(overlay)
  activeProjectModal = overlay
}

function closeProjectModal() {
  if (activeProjectModal) {
    activeProjectModal.remove()
    activeProjectModal = null
  }
}

function createContactIcon(icon: ContactIcon) {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')
  const drawFilled = (pathData: string) => {
    svg.setAttribute('fill', 'currentColor')
    svg.setAttribute('stroke', 'none')
    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('d', pathData)
    svg.appendChild(path)
    return svg
  }

  if (icon === 'linkedin') {
    return drawFilled(
      'M19 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V5c0-1.1-.9-2-2-2zm-9.75 15H6.25v-8.5h3v8.5zm-1.5-9.75c-.83 0-1.5-.68-1.5-1.5S6.92 5.25 7.75 5.25s1.5.68 1.5 1.5-.67 1.5-1.5 1.5zM18 18h-3v-4.25c0-1.01-.02-2.31-1.41-2.31-1.41 0-1.63 1.1-1.63 2.23V18h-3v-8.5h2.87v1.16h.04c.4-.72 1.39-1.48 2.86-1.48 3.06 0 3.27 2.01 3.27 4.63V18z'
    )
  }

  if (icon === 'github') {
    return drawFilled(
      'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.05-1.61-4.05-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.25 1.83 1.25 1.07 1.83 2.82 1.3 3.51.99.11-.77.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.28 1.23a11.4 11.4 0 0 1 5.98 0c2.28-1.55 3.28-1.23 3.28-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.83.58A12 12 0 0 0 24 12C24 5.37 18.63 0 12 0z'
    )
  }

  if (icon === 'linktree') {
    return drawFilled(
      'M16.24 2 12 6.24 7.76 2 6 3.76l4.24 4.24-6.24 6.24L6 15l6-6 6 6 1.76-1.76-6.24-6.24L18 3.76 16.24 2zm-4.24 11.76L9.76 16l2.24 2.24L14.24 16 12 13.76z'
    )
  }

  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.5')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')

  const el = (tag: string, attrs: Record<string, string>) => {
    const element = document.createElementNS(SVG_NS, tag)
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value))
    svg.appendChild(element)
    return element
  }

  switch (icon) {
    case 'id': {
      el('rect', { x: '4', y: '6', width: '16', height: '12', rx: '2' })
      el('circle', { cx: '9', cy: '12', r: '2' })
      el('path', { d: 'M7 16.5c2-2 6-2 8 0' })
      el('line', { x1: '13', y1: '11', x2: '18', y2: '11' })
      el('line', { x1: '13', y1: '15', x2: '18', y2: '15' })
      break
    }
    case 'mail': {
      el('rect', { x: '3', y: '6', width: '18', height: '12', rx: '2' })
      el('polyline', { points: '3,8 12,14 21,8' })
      break
    }
    case 'phone': {
      el('rect', { x: '8', y: '4', width: '8', height: '16', rx: '2' })
      el('line', { x1: '9', y1: '7', x2: '15', y2: '7' })
      const button = el('circle', { cx: '12', cy: '18', r: '0.8' })
      button.setAttribute('fill', 'currentColor')
      button.setAttribute('stroke', 'none')
      break
    }
    default:
      break
  }

  return svg
}

function closeWindow(windowElement: HTMLElement) {
  runWindowCleanups(windowElement)
  animateClose(windowElement).then(() => {
    if (!windowPanel.querySelector('.ascii-window, .terminal-shell-window')) {
      setWindowPresence(false)
      setWindowLayout(null)
    }
  })
}

function registerWindowCleanup(windowElement: HTMLElement, cleanup: () => void) {
  if (!cleanup) return
  const callbacks = windowCleanupMap.get(windowElement) ?? []
  callbacks.push(cleanup)
  windowCleanupMap.set(windowElement, callbacks)
}

function runWindowCleanups(windowElement: HTMLElement) {
  const callbacks = windowCleanupMap.get(windowElement)
  if (!callbacks?.length) return
  callbacks.forEach((cleanup) => {
    try {
      cleanup()
    } catch (error) {
      console.error('cleanup failed', error)
    }
  })
  windowCleanupMap.delete(windowElement)
}

function animateClose(windowElement: HTMLElement) {
  return new Promise<void>((resolve) => {
    windowElement.classList.add('closing')
    windowElement.addEventListener(
      'animationend',
      () => {
        windowElement.remove()
        resolve()
      },
      { once: true }
    )
  })
}

function createCursorLine() {
  const line = document.createElement('div')
  line.className = 'terminal-line cursor-line'

  const prompt = document.createElement('span')
  prompt.className = 'prompt-label'
  prompt.textContent = PROMPT
  line.appendChild(prompt)

  const inputSpan = document.createElement('span')
  inputSpan.className = 'cursor-input'
  inputSpan.contentEditable = 'true'
  inputSpan.setAttribute('role', 'textbox')
  inputSpan.setAttribute('aria-label', 'Type a terminal command')
  inputSpan.dataset.placeholder = 'type command'
  line.appendChild(inputSpan)

  return line
}

function insertBeforeCursor(element: HTMLElement) {
  output.insertBefore(element, cursorLine)
  scrollOutput()
}

function focusCursorInput() {
  cursorInput.focus()
  placeCaretAtEnd(cursorInput)
}

function placeCaretAtEnd(element: HTMLElement) {
  const range = document.createRange()
  range.selectNodeContents(element)
  range.collapse(false)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

function renderBanner() {
  const animation = async () => {
    const banner = document.createElement('pre')
    banner.className = 'terminal-banner'
    insertBeforeCursor(banner)
    await animateBannerReveal(banner, bannerAscii.trimEnd())
    enableAsciiIdleEffects(banner)
  }

  typingQueue = typingQueue.then(animation)
  return typingQueue
}

function announceCommandList() {
  enqueueLine(
    {
      segments: [
        { text: '\navailable commands', className: 'segment-label' },
        { text: '', className: 'segment-description' }
      ]
    },
    'info'
  )

  commandSummaries.forEach(({ command, description }) => {
    const label = `'${command}'`
    const padded = label.padEnd(COMMAND_COLUMN_WIDTH, ' ')
    enqueueLine(
      {
        segments: [
          { text: padded, className: 'segment-command', commandKey: command },
          { text: description, className: 'segment-description' }
        ]
      },
      'muted'
    )
  })

  ;[
    '\nPress [Tab] for auto completion.',
    'Press [Esc] to clear the input line.',
    'Press [↑][↓] to scroll through your history of commands.\n'
  ].forEach((tip) =>
    enqueueLine(
      {
        segments: [{ text: tip, className: 'segment-description' }]
      },
      'info'
    )
  )
}

function clearTerminalOutput() {
  Array.from(output.children).forEach((node) => {
    if (node === cursorLine) return
    node.remove()
  })
}

function animateTerminalReplica(
  container: HTMLElement,
  lines: ReplicaLine[],
  asciiArt?: string,
  accent?: WindowDescriptor['accent'],
  flagBanner?: FlagBannerConfig,
  smileyOverlay?: SmileyOverlayConfig,
  registerCleanup?: (cleanup: () => void) => void
) {
  let chain = Promise.resolve()

  if (flagBanner) {
    chain = chain.then(async () => {
      const flag = document.createElement('pre')
      flag.className = 'mini-ascii flag-banner'
      container.appendChild(flag)
      attachAsciiEmbers(flag)
      const stopAnimation = startFlagWaveAnimation(flag, flagBanner)
      registerCleanup?.(stopAnimation)
      const spacer = document.createElement('div')
      spacer.className = 'mini-line ascii-spacer'
      spacer.textContent = ''
      container.appendChild(spacer)
    })
  }

  if (asciiArt) {
    chain = chain.then(async () => {
      const art = document.createElement('pre')
      art.className = 'mini-ascii'
      if (accent === 'education') {
        art.classList.add('education-banner')
      }
      container.appendChild(art)
      if (smileyOverlay) {
        attachAsciiEmbers(art)
        const stopSmiley = startSmileyCompositeAnimation(art, asciiArt.trimEnd(), smileyOverlay)
        registerCleanup?.(stopSmiley)
      } else {
        await animateBannerReveal(art, asciiArt.trimEnd())
        enableAsciiIdleEffects(art)
      }
      const spacer = document.createElement('div')
      spacer.className = 'mini-line ascii-spacer'
      spacer.textContent = ''
      container.appendChild(spacer)
    })
  }

  lines.forEach((text) => {
    chain = chain.then(async () => {
      const line = document.createElement('div')
      line.className = 'mini-line'
      if (typeof text !== 'string' && text.className) {
        line.classList.add(text.className)
      }
      if (typeof text !== 'string' && text.icon) {
        line.classList.add('mini-with-icon')
        const iconSpan = document.createElement('span')
        iconSpan.className = 'mini-icon'
        applyIconGlyph(iconSpan, text.icon)
        line.appendChild(iconSpan)
      }

      let target: HTMLElement
      if (typeof text === 'string') {
        target = line
      } else if (text.href) {
        const anchor = document.createElement('a')
        anchor.href = text.href
        anchor.className = 'inline-link'
        if (text.external) {
          anchor.target = '_blank'
          anchor.rel = 'noreferrer'
          anchor.addEventListener('click', (event) => event.stopPropagation())
        } else {
          anchor.addEventListener('click', (event) => event.preventDefault())
        }
        if (text.modalTrigger) {
          anchor.dataset.modalTrigger = text.modalTrigger
        }
        target = anchor
        line.appendChild(anchor)
      } else {
        target = document.createElement('span')
        line.appendChild(target)
      }

      const value = typeof text === 'string' ? text : text.text
      container.appendChild(line)
      await typeCharacters(target, value, () => {
        container.scrollTop = container.scrollHeight
      })
    })
  })

  return chain
}
