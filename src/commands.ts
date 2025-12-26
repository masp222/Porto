import bannerArt from './banner.txt?raw'
import educationBanner from './edubanner.txt?raw'
import defakeNetBanner from './projects/defakenet/projbanner.txt?raw'
import prabowonomicsFlagBanner from './projects/prabowonomics/projbanner.txt?raw'
import streamSageBanner from './projects/streamsage/projbanner.txt?raw'
import type { FlagBannerConfig, SmileyOverlayConfig } from './animations'

export type TerminalVariant = 'info' | 'muted' | 'success' | 'error'
export type CommandKey = 'about' | 'projects' | 'cv' | 'education'
export type ContactIcon = 'id' | 'mail' | 'phone' | 'linkedin' | 'github' | 'linktree'

export type LineSegment = {
  text: string
  className?: string
  commandKey?: string
}

export type LineContent = string | { segments: LineSegment[] }

export type IconKey =
  | 'github'
  | 'huggingface'
  | 'vercel'
  | 'netlify'
  | 'generic'
  | 'document'
  | 'pytorch'
  | 'resnet'
  | 'yolov8'
  | 'opencv'
  | 'numpy'
  | 'fastapi'
  | 'python'
  | 'stateless'
  | 'health'
  | 'nextjs'
  | 'tailwind'
  | 'static'
  | 'docker'
  | 'hardware'
  | 'machinelearning'
  | 'deeplearning'
  | 'nlp'
  | 'computerVision'
  | 'indobert'
  | 'streamlit'
  | 'recommendation'
  | 'scikitlearn'
  | 'react'
  | 'sql'
  | 'git'
  | 'pandas'
  | 'nltk'
  | 'imbalearn'
  | 'surprise'
  | 'vite'
  | 'jupyter'
  | 'ultralytics'

export type ReplicaLine =
  | string
  | {
      text: string
      className?: string
      icon?: IconKey
      href?: string
      external?: boolean
      modalTrigger?: 'project'
    }

export type ContactEntry = {
  icon: ContactIcon
  label: string
  value: string
  href?: string
}

export type CommandSummary = {
  command: string
  description: string
}

export type WindowDescriptor = {
  title?: string
  lines?: ReplicaLine[]
  accent?: 'teal' | 'amber' | 'violet' | 'forensic' | 'education' | 'indonesia' | 'cv' | 'crimson'
  photoSrc?: string
  embedUrl?: string
  embedActions?: EmbedAction[]
  contacts?: ContactEntry[]
  terminalReplica?: boolean
  asciiArt?: string
  flagBanner?: FlagBannerConfig
  smileyOverlay?: SmileyOverlayConfig
}

export type EmbedAction = {
  label: string
  href: string
  target?: '_blank' | '_self'
  download?: boolean | string
}

export type TechBadge = {
  name: string
  logoKey?: IconKey
}

export type TechCategory = {
  label: string
  items: TechBadge[]
}

export type ProjectEntry = {
  title: string
  slug: string
  accent: 'teal' | 'amber' | 'violet' | 'forensic' | 'indonesia' | 'cv' | 'crimson'
  shortDescription: string
  techStack: string[]
  githubUrl?: string
  demoUrl?: string
  paperUrl?: string
  images: string[]
  modalDescription: string[]
  modalTech: TechCategory[]
  asciiArt?: string
  flagBanner?: FlagBannerConfig
  smileyOverlay?: SmileyOverlayConfig
}

export const PROMPT = 'guest@WebShell:~$'
export const COMMAND_COLUMN_WIDTH = 16
export const TYPEWRITER_DELAY = 6
export const bannerAscii = bannerArt
export const educationAscii = educationBanner

export const commandSummaries: CommandSummary[] = [
  { command: 'about', description: 'About myself.' },
  { command: 'projects', description: 'Hope you find something interesting.' },
  { command: 'cv', description: 'Curriculum Vitae.' },
  { command: 'education', description: 'Academic background and coursework.' },
  { command: 'banner', description: 'Redraw ASCII banner.' },
  { command: 'clear', description: 'Clear the terminal.' }
]

export const introLines: LineContent[] = [
  {
    segments: [
      { text: 'booting :: ', className: 'segment-label' },
      { text: 'WebShell interface coming online', className: 'segment-description' }
    ]
  },
  {
    segments: [
      { text: 'tip :: ', className: 'segment-label' },
      { text: 'Type `', className: 'segment-description' },
      { text: 'help', className: 'segment-hotkey' },
      { text: '` for available commands.', className: 'segment-description' }
    ]
  }
]

const defakeNetImages = [
  new URL('./projects/defakenet/defakenet1.png', import.meta.url).href,
  new URL('./projects/defakenet/defakenet2.png', import.meta.url).href
]

const prabowonomicsImages = [
  new URL('./projects/prabowonomics/prabowonomics1.jpg', import.meta.url).href,
  new URL('./projects/prabowonomics/prabowonomics2.jpg', import.meta.url).href,
  new URL('./projects/prabowonomics/prabowonomics3.jpg', import.meta.url).href,
  new URL('./projects/prabowonomics/prabowonomics4.jpg', import.meta.url).href,
  new URL('./projects/prabowonomics/prabowonomics5.jpg', import.meta.url).href,
  new URL('./projects/prabowonomics/prabowonomics6.jpg', import.meta.url).href,
  new URL('./projects/prabowonomics/prabowonomics7.jpg', import.meta.url).href,
  new URL('./projects/prabowonomics/prabowonomics8.jpg', import.meta.url).href,
  new URL('./projects/prabowonomics/prabowonomics9.jpg', import.meta.url).href,
  new URL('./projects/prabowonomics/prabowonomics10.jpg', import.meta.url).href,
  new URL('./projects/prabowonomics/prabowonomics11.jpg', import.meta.url).href,
  new URL('./projects/prabowonomics/prabowonomics12.jpg', import.meta.url).href
]

const streamSageImages = [
  new URL('./projects/streamsage/streamsage1.jpg', import.meta.url).href,
  new URL('./projects/streamsage/streamsage2.jpg', import.meta.url).href,
  new URL('./projects/streamsage/streamsage3.jpg', import.meta.url).href,
  new URL('./projects/streamsage/streamsage4.jpg', import.meta.url).href,
  new URL('./projects/streamsage/streamsage5.jpg', import.meta.url).href,
  new URL('./projects/streamsage/streamsage6.jpg', import.meta.url).href,
  new URL('./projects/streamsage/streamsage7.jpg', import.meta.url).href,
  new URL('./projects/streamsage/streamsage8.jpg', import.meta.url).href
]

const portraitSrc = new URL('./photo.jpeg', import.meta.url).href
export const CV_EMBED_URL = 'https://drive.google.com/file/d/1oDOgKMlarptWGUIAl_fJIH6fLRVjgEel/preview'
export const CV_VIEW_URL = 'https://drive.google.com/file/d/1oDOgKMlarptWGUIAl_fJIH6fLRVjgEel/view'
export const CV_DOWNLOAD_URL =
  'https://drive.google.com/uc?export=download&id=1oDOgKMlarptWGUIAl_fJIH6fLRVjgEel'

const DEFAKENET_ASCII = defakeNetBanner

export const projectEntries: ProjectEntry[] = [
  {
    title: 'DefakeNet',
    slug: 'defakenet',
    accent: 'forensic',
    shortDescription:
      'Containerized deepfake detection lab that ingests a video upload and streams a YOLOv8 + ResNet18 verdict back through the browser.',
    techStack: [
      'PyTorch',
      'ResNet18',
      'YOLOv8',
      'FastAPI',
      'Next.js',
      'Tailwind',
      'Docker',
      'Hugging Face Spaces'
    ],
    githubUrl: 'https://github.com/BJD765/deep-learning-final-project',
    demoUrl: 'https://huggingface.co/spaces/masp307/DefakeNet',
    images: defakeNetImages,
    asciiArt: DEFAKENET_ASCII,
    smileyOverlay: { gap: 3 },
    modalDescription: [
      'DefakeNet is a web-based deepfake detection application that funnels every upload through a YOLOv8 face detector and a ResNet18 classifier inside one Dockerized pipeline. Users drop in a clip, the service slices frames, inspects faces, and responds with a confident real/fake verdict enriched with analyzed frames.',
      'The entire experience ships as a Docker-backed Hugging Face Space, so there is nothing to install or authenticate. The stack keeps each request stateless, exposes health checks, and can lean on CPU or GPU workloads depending on the host—turning a research workflow into a zero-friction interactive demo.'
    ],
    modalTech: [
      {
        label: 'Machine Learning & CV',
        items: [
          { name: 'PyTorch', logoKey: 'pytorch' },
          { name: 'ResNet18', logoKey: 'resnet' },
          { name: 'YOLOv8', logoKey: 'yolov8' },
          { name: 'OpenCV', logoKey: 'opencv' },
          { name: 'NumPy', logoKey: 'numpy' }
        ]
      },
      {
        label: 'Backend',
        items: [
          { name: 'FastAPI', logoKey: 'fastapi' },
          { name: 'Python', logoKey: 'python' },
          { name: 'Stateless API', logoKey: 'stateless' },
          { name: 'Health Endpoints', logoKey: 'health' }
        ]
      },
      {
        label: 'Frontend',
        items: [
          { name: 'Next.js', logoKey: 'nextjs' },
          { name: 'Tailwind CSS', logoKey: 'tailwind' },
          { name: 'Static Build', logoKey: 'static' }
        ]
      },
      {
        label: 'Deployment',
        items: [
          { name: 'Docker', logoKey: 'docker' },
          { name: 'Hugging Face Spaces', logoKey: 'huggingface' },
          { name: 'CPU/GPU Ready', logoKey: 'hardware' }
        ]
      }
    ]
  },
  {
    title: 'Prabowonomics Sentiment',
    slug: 'prabowonomics-sentiment',
    accent: 'indonesia',
    shortDescription:
      'Peer-reviewed sentiment analysis of Prabowonomics budget reforms comparing TF-IDF baselines with IndoBERT embeddings across Indonesian Twitter and YouTube data.',
    techStack: ['IndoBERT', 'TF-IDF', 'Scikit-learn', 'PyTorch', 'SMOTE', 'Pandas'],
    githubUrl:
      'https://github.com/masp222/Public-Sentiment-Analysis-on-Budget-Efficiency-Measures-2025-Using-IndoBERT',
    paperUrl: 'https://ieeexplore.ieee.org/document/11252163',
    images: prabowonomicsImages,
    modalDescription: [
      'This research mines anonymized Indonesian tweets and YouTube comments to gauge how citizens respond to Prabowonomics 2025 budget efficiency policies. We contrast classical TF-IDF pipelines with IndoBERT to understand how contextual language modeling and slang-aware embeddings shift sentiment accuracy.',
      'IndoBERT consistently outperforms TF-IDF features when classifying nuanced policy discussions, especially where sarcasm, mixed code-switching, and regional slang appear. The study was accepted at the 9th ICEEIE 2025 and published on IEEE Xplore, aligning NLP experimentation with practical policy evaluation.'
    ],
    modalTech: [
      {
        label: 'Data & Prep',
        items: [
          { name: 'Twitter API', logoKey: 'generic' },
          { name: 'YouTube Comments', logoKey: 'generic' },
          { name: 'Slang Normalization', logoKey: 'generic' },
          { name: 'Stopword & Noise Removal', logoKey: 'generic' }
        ]
      },
      {
        label: 'Feature Engineering',
        items: [
          { name: 'TF-IDF Vectors', logoKey: 'generic' },
          { name: 'IndoBERT Embeddings', logoKey: 'generic' }
        ]
      },
      {
        label: 'Models & Evaluation',
        items: [
          { name: 'Logistic Regression', logoKey: 'generic' },
          { name: 'SVM & Tree Ensembles', logoKey: 'generic' },
          { name: 'SMOTE Balancing', logoKey: 'generic' },
          { name: 'Accuracy / F1 Tracking', logoKey: 'generic' }
        ]
      },
      {
        label: 'Tooling',
        items: [
          { name: 'Python', logoKey: 'python' },
          { name: 'PyTorch', logoKey: 'pytorch' },
          { name: 'Scikit-learn', logoKey: 'generic' },
          { name: 'Pandas / NumPy', logoKey: 'numpy' }
        ]
      }
    ],
    flagBanner: {
      art: prabowonomicsFlagBanner
    }
  },
  {
    title: 'StreamSage Hybrid Recommender',
    slug: 'streamsage-hybrid',
    accent: 'crimson',
    shortDescription:
      'Hybrid MovieLens recommender that blends content, user-based, and item-based filtering with weighted scoring and a guided cold-start flow.',
    techStack: ['MovieLens', 'Pandas', 'NumPy', 'NLTK', 'TF-IDF', 'Surprise', 'Streamlit'],
    githubUrl: 'https://github.com/Mirekel/MLFinPro',
    demoUrl: 'https://drive.google.com/file/d/1ubw-3YAmFk1IHHP0p1BG5Gz7vwQ1SHyK/view?usp=sharing',
    images: streamSageImages,
    asciiArt: streamSageBanner,
    modalDescription: [
      'StreamSage is a hybrid movie recommendation system that layers TF-IDF content vectors on top of user- and item-based collaborative filtering built with the Surprise library. MovieLens ratings plus cleaned title/genre metadata feed three independent scorers, and a weighted blend returns balanced results even when any single signal is weak.',
      'The Streamlit interface walks newcomers through a cold-start form that gathers a handful of anchor ratings, then streams personalized picks, supporting details, and hit-rate telemetry so the team can validate every modeling tweak without leaving the browser.'
    ],
    modalTech: [
      {
        label: 'Dataset & Prep',
        items: [
          { name: 'MovieLens Dataset', logoKey: 'generic' },
          { name: 'Pandas', logoKey: 'numpy' },
          { name: 'NumPy', logoKey: 'numpy' },
          { name: 'NLTK Text Cleaning', logoKey: 'generic' }
        ]
      },
      {
        label: 'Recommendation Stack',
        items: [
          { name: 'Content-Based TF-IDF', logoKey: 'generic' },
          { name: 'User-Based CF', logoKey: 'generic' },
          { name: 'Item-Based CF', logoKey: 'generic' },
          { name: 'Hybrid Weighted Blend', logoKey: 'generic' }
        ]
      },
      {
        label: 'Application & Tooling',
        items: [
          { name: 'Python', logoKey: 'python' },
          { name: 'Scikit-learn', logoKey: 'generic' },
          { name: 'Surprise Library', logoKey: 'generic' },
          { name: 'Streamlit UI', logoKey: 'generic' }
        ]
      },
      {
        label: 'Evaluation & UX',
        items: [
          { name: 'Hit Rate Metric', logoKey: 'generic' },
          { name: 'Cold-Start Onboarding', logoKey: 'generic' },
          { name: 'Scenario Playback', logoKey: 'generic' }
        ]
      }
    ]
  }
]

export const windowBlueprints: Record<CommandKey, WindowDescriptor[]> = {
  about: [
    {
      title: 'Photo Log',
      accent: 'teal',
      photoSrc: portraitSrc
    },
    {
      title: 'Contact & Links',
      accent: 'amber',
      contacts: [
        {
          icon: 'id',
          label: 'Identity',
          value: 'Mochammad Aqsa Sandhy Pradipta'
        },
        {
          icon: 'mail',
          label: 'Email',
          value: 'maqsasp@gmail.com',
          href: 'mailto:maqsasp@gmail.com'
        },
        {
          icon: 'phone',
          label: 'Phone',
          value: '+62 811-3107-199',
          href: 'tel:+628113107199'
        },
        {
          icon: 'linkedin',
          label: 'LinkedIn',
          value: 'linkedin.com/in/mochammad-aqsa-sandhy-pradipta-27479a37b/',
          href: 'https://linkedin.com/in/mochammad-aqsa-sandhy-pradipta-27479a37b/'
        },
        {
          icon: 'github',
          label: 'GitHub',
          value: 'github.com/masp222',
          href: 'https://github.com/masp222'
        },
        {
          icon: 'linktree',
          label: 'Linktree',
          value: 'linktr.ee/maqsasp',
          href: 'https://linktr.ee/maqsasp'
        }
      ]
    },
    {
      title: 'Profile',
      lines: [
        'Curious and motivated Computer Science undergraduate witha strong interest in Machine Learning, Deep Learning, Data Science, and Artificial Intelligence.',
        '',
        'Experienced in building AI and data-driven projects through coursework and research while expanding expertise in LLMs, LangChain, LangGraph, and Retrieval-Augmented Generation.'
      ],
      accent: 'violet',
      terminalReplica: true
    },
    {
      title: 'Tech Stack',
      accent: 'teal',
      terminalReplica: true,
      lines: [
        { text: 'Python', className: 'accent-body', icon: 'python' },
        { text: 'PyTorch', className: 'accent-body', icon: 'pytorch' },
        { text: 'Scikit-learn', className: 'accent-body', icon: 'scikitlearn' },
        { text: 'OpenCV', className: 'accent-body', icon: 'opencv' },
        { text: 'Hugging Face Transformers', className: 'accent-body', icon: 'huggingface' },
        { text: 'Ultralytics YOLO', className: 'accent-body', icon: 'ultralytics' },
        { text: 'Pandas', className: 'accent-body', icon: 'pandas' },
        { text: 'NumPy', className: 'accent-body', icon: 'numpy' },
        { text: 'NLTK', className: 'accent-body', icon: 'nltk' },
        { text: 'Imbalanced-learn', className: 'accent-body', icon: 'imbalearn' },
        { text: 'Surprise', className: 'accent-body', icon: 'surprise' },
        { text: 'Streamlit', className: 'accent-body', icon: 'streamlit' },
        { text: 'FastAPI', className: 'accent-body', icon: 'fastapi' },
        { text: 'Docker', className: 'accent-body', icon: 'docker' },
        { text: 'React.js', className: 'accent-body', icon: 'react' },
        { text: 'Vite', className: 'accent-body', icon: 'vite' },
        { text: 'Tailwind CSS', className: 'accent-body', icon: 'tailwind' },
        { text: 'Git', className: 'accent-body', icon: 'git' },
        { text: 'GitHub', className: 'accent-body', icon: 'github' },
        { text: 'Jupyter Notebook', className: 'accent-body', icon: 'jupyter' },
        { text: 'Vercel', className: 'accent-body', icon: 'vercel' }
      ]
    }
  ],
  projects: [],
  cv: [
    {
      lines: [
        'If the preview does not load, open the link directly:',
        CV_VIEW_URL
      ],
      accent: 'cv',
      embedUrl: CV_EMBED_URL,
      embedActions: [
        {
          label: 'Download PDF',
          href: CV_DOWNLOAD_URL,
          download: true
        },
        {
          label: 'Open in new window',
          href: CV_VIEW_URL,
          target: '_blank'
        }
      ]
    }
  ],
  education: [
    {
      title: 'Education',
      lines: [
        { text: 'Bina Nusantara University', className: 'education-heading' },
        { text: 'School of Computer Science', className: 'education-subheading' },
        { text: 'Bachelor of Computer Science · 2023 – Present', className: 'education-meta' },
        { text: 'GPA :: 3.55 / 4.00', className: 'education-highlight' },
        '',
        { text: 'Relevant Coursework', className: 'education-label' },
        { text: '▸ Machine Learning', className: 'education-course' },
        { text: '▸ Natural Language Processing', className: 'education-course' },
        { text: '▸ Deep Learning', className: 'education-course' },
        { text: '▸ Computer Vision', className: 'education-course' }
      ],
      accent: 'education',
      terminalReplica: true,
      asciiArt: educationAscii
    }
  ]
}

export const WINDOW_LAYOUT_CLASS: Partial<Record<CommandKey, string>> = {
  about: 'about-layout',
  projects: 'projects-layout',
  cv: 'cv-layout'
}

export type ProjectLinkField = keyof Pick<ProjectEntry, 'githubUrl' | 'demoUrl' | 'paperUrl'>

export type ProjectLinkBlueprint = {
  field: ProjectLinkField
  label: string
  icon?: IconKey
  iconResolver?: (url: string) => IconKey
}

export const PROJECT_LINK_BLUEPRINTS: ProjectLinkBlueprint[] = [
  { field: 'githubUrl', label: 'Github', icon: 'github' },
  { field: 'demoUrl', label: 'Demo', iconResolver: deriveDemoIconKey },
  { field: 'paperUrl', label: 'Paper', icon: 'document' }
]

export const ICON_GLYPHS: Record<IconKey, string> = {
  github: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.93c.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.7.08-.69.08-.69 1.15.08 1.76 1.19 1.76 1.19 1.02 1.75 2.67 1.25 3.32.96.1-.74.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.68 0-1.26.45-2.3 1.18-3.11-.12-.29-.51-1.45.11-3.01 0 0 .96-.31 3.15 1.18a10.7 10.7 0 0 1 5.74 0c2.2-1.49 3.15-1.18 3.15-1.18.62 1.56.23 2.72.11 3.01.73.81 1.18 1.85 1.18 3.11 0 4.41-2.71 5.39-5.29 5.67.41.35.78 1.04.78 2.1 0 1.52-.01 2.75-.01 3.13 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>`,
  huggingface: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="24" fill="#FFCC4D"/><path d="M14 34c3.5 9 11.5 14 18 14s14.5-5 18-14" fill="none" stroke="#F28A1A" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="28" r="3" fill="#3C2C1E"/><circle cx="40" cy="28" r="3" fill="#3C2C1E"/><path d="M24 38c2.5 3 5.5 4 8 4s5.5-1 8-4" fill="none" stroke="#A04F15" stroke-width="3" stroke-linecap="round"/></svg>`,
  vercel: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M4 56h56L32 8 4 56z" fill="#ffffff"/></svg>`,
  netlify: '🌀',
  generic: '🌐',
  document: '📄',
  pytorch: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="#EE4C2C" d="M32 6l12 14a14 14 0 1 1-20 0z"/><circle cx="40" cy="36" r="10" fill="none" stroke="#EE4C2C" stroke-width="4"/></svg>`,
  resnet: '🧠',
  yolov8: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="20" fill="none" stroke="#FB7185" stroke-width="4"/><circle cx="32" cy="32" r="6" fill="#FB7185"/><line x1="32" y1="10" x2="32" y2="18" stroke="#FB7185" stroke-width="4" stroke-linecap="round"/><line x1="32" y1="46" x2="32" y2="54" stroke="#FB7185" stroke-width="4" stroke-linecap="round"/><line x1="10" y1="32" x2="18" y2="32" stroke="#FB7185" stroke-width="4" stroke-linecap="round"/><line x1="46" y1="32" x2="54" y2="32" stroke="#FB7185" stroke-width="4" stroke-linecap="round"/></svg>`,
  opencv: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="24" cy="18" r="12" fill="#ff1b2d"/><circle cx="40" cy="18" r="12" fill="#00a04e"/><circle cx="32" cy="38" r="12" fill="#0068fd"/><circle cx="24" cy="18" r="6" fill="#010409"/><circle cx="40" cy="18" r="6" fill="#010409"/><circle cx="32" cy="38" r="6" fill="#010409"/></svg>`,
  numpy: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="#4dabcf" d="M10 16h12v36H10z"/><path fill="#133c7a" d="M22 16h10l20 36H42z" opacity="0.9"/><path fill="#f6c55c" d="M32 16h12v36H32z"/></svg>`,
  fastapi: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="#059669" d="M32 6l20 12v24L32 54 12 42V18z"/><path fill="#ECFDF5" d="M38 18 28 46h8l8-28z"/></svg>`,
  python: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="#3776AB" d="M32 6c-7.2 0-13 5.8-13 13v9h26v-9c0-7.2-5.8-13-13-13z"/><circle cx="40" cy="16" r="3" fill="#fff"/><path fill="#FFD43B" d="M32 58c7.2 0 13-5.8 13-13v-9H19v9c0 7.2 5.8 13 13 13z"/><circle cx="24" cy="48" r="3" fill="#fff"/></svg>`,
  stateless: '🛰️',
  health: '🩺',
  nextjs: '⏭',
  tailwind: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="#38BDF8" d="M14 30c4-10 11-12 18-6s13 4 18-6c-4 10-11 12-18 6s-13-4-18 6zm0 18c4-10 11-12 18-6s13 4 18-6c-4 10-11 12-18 6s-13-4-18 6z"/></svg>`,
  static: '📦',
  docker: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="#2396ED" d="M10 34h44v8c0 8-7 14-15 14H25C17 56 10 50 10 42z"/><rect x="16" y="22" width="8" height="10" fill="#2AA7F0"/><rect x="26" y="22" width="8" height="10" fill="#2AA7F0"/><rect x="36" y="22" width="8" height="10" fill="#2AA7F0"/><path fill="#1D70B8" d="M52 34c0 6-4 10-9 10h-2c0-4 3-6 6-6h5z"/></svg>`,
  hardware: '💠',
  machinelearning: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="10" fill="#0D9488"/><g stroke="#134E4A" stroke-width="3" stroke-linecap="round"><line x1="32" y1="12" x2="32" y2="18"/><line x1="32" y1="46" x2="32" y2="52"/><line x1="12" y1="32" x2="18" y2="32"/><line x1="46" y1="32" x2="52" y2="32"/><line x1="18" y1="18" x2="22" y2="22"/><line x1="46" y1="18" x2="42" y2="22"/><line x1="18" y1="46" x2="22" y2="42"/><line x1="46" y1="46" x2="42" y2="42"/></g></svg>`,
  deeplearning: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="#6D28D9" d="M16 22l16-8 16 8-16 8z"/><path fill="#8B5CF6" d="M16 32l16-8 16 8-16 8z"/><path fill="#C084FC" d="M16 42l16-8 16 8-16 8z"/></svg>`,
  nlp: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M12 18h40v22H30l-8 10v-10H12z" fill="#EC4899"/><rect x="20" y="24" width="24" height="3" fill="#FCE7F3"/><rect x="20" y="30" width="16" height="3" fill="#FCE7F3"/></svg>`,
  computerVision: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect x="8" y="20" width="48" height="28" rx="6" fill="#1E293B"/><rect x="14" y="16" width="12" height="8" rx="2" fill="#475569"/><circle cx="36" cy="34" r="12" fill="#0EA5E9"/><circle cx="36" cy="34" r="6" fill="#38BDF8"/></svg>`,
  indobert: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect x="8" y="16" width="48" height="12" fill="#CE1126"/><rect x="8" y="28" width="48" height="20" fill="#fff"/><text x="32" y="46" text-anchor="middle" font-family="'Space Mono', 'IBM Plex Mono', monospace" font-size="14" fill="#111827">BERT</text></svg>`,
  streamlit: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M14 46 32 12l18 34H14z" fill="#FF4B4B"/></svg>`,
  recommendation: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="16" cy="20" r="6" fill="#FBBF24"/><circle cx="48" cy="20" r="6" fill="#F97316"/><circle cx="32" cy="44" r="8" fill="#F59E0B"/><line x1="16" y1="20" x2="32" y2="44" stroke="#EA580C" stroke-width="4" stroke-linecap="round"/><line x1="48" y1="20" x2="32" y2="44" stroke="#EA580C" stroke-width="4" stroke-linecap="round"/></svg>`,
  scikitlearn: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="20" fill="#F7991C"/><path d="M23 25h6v14h-6z" fill="#fff"/><path d="M32 25h6l3 6 3-6h6l-6 14h-6z" fill="#224056"/></svg>`,
  react: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><g fill="none" stroke="#61DAFB" stroke-width="3"><ellipse cx="32" cy="32" rx="18" ry="8"/><ellipse cx="32" cy="32" rx="18" ry="8" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="18" ry="8" transform="rotate(-60 32 32)"/></g><circle cx="32" cy="32" r="4" fill="#61DAFB"/></svg>`,
  sql: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><ellipse cx="32" cy="18" rx="16" ry="6" fill="#0EA5E9"/><rect x="16" y="18" width="32" height="22" fill="#0284C7"/><ellipse cx="32" cy="40" rx="16" ry="6" fill="#0369A1"/><text x="32" y="34" text-anchor="middle" font-family="'Space Mono', 'IBM Plex Mono', monospace" font-size="12" fill="#fff">SQL</text></svg>`,
  git: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M12 32 32 12l20 20-20 20z" fill="#F1502F"/><path d="M24 32h8v-8m0 8v8m8-8h8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="24" r="3" fill="#fff"/><circle cx="32" cy="40" r="3" fill="#fff"/><circle cx="48" cy="32" r="3" fill="#fff"/></svg>`,
  pandas: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect x="18" y="10" width="6" height="44" rx="3" fill="#1b152b"/><rect x="30" y="10" width="6" height="44" rx="3" fill="#8a3ffc"/><rect x="42" y="18" width="6" height="28" rx="3" fill="#ff70d9"/></svg>`,
  nltk: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M8 20h48v28H8z" fill="#fefefe" stroke="#0f172a" stroke-width="2"/><path d="M8 20h24v28H8z" fill="#e8f5e9"/><path d="M24 30c4-6 12-12 24-12-4 6-12 12-24 12z" fill="#34a853"/><path d="M24 34c4 2 11 6 12 12-4-2-11-6-12-12z" fill="#1b5e20"/></svg>`,
  imbalearn: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><line x1="32" y1="14" x2="32" y2="50" stroke="#0f766e" stroke-width="4" stroke-linecap="round"/><circle cx="18" cy="30" r="8" fill="#14b8a6" opacity="0.9"/><circle cx="46" cy="34" r="8" fill="#22d3ee" opacity="0.9"/><path d="M12 42c6-6 34-8 40-2" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/></svg>`,
  surprise: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><polygon points="32 6 38 24 58 24 42 36 48 54 32 43 16 54 22 36 6 24 26 24" fill="#f97316"/><circle cx="32" cy="32" r="6" fill="#fff"/></svg>`,
  vite: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M12 12 32 56l20-44H12z" fill="#ffd166"/><path d="M52 12 32 56 26 42l14-30h12z" fill="#8a4bff" opacity="0.9"/></svg>`,
  jupyter: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><ellipse cx="32" cy="24" rx="18" ry="8" fill="#f97316" opacity="0.7"/><ellipse cx="32" cy="40" rx="18" ry="8" fill="#f97316" opacity="0.7"/><circle cx="16" cy="12" r="4" fill="#9ca3af"/><circle cx="48" cy="52" r="4" fill="#9ca3af"/></svg>`,
  ultralytics: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M14 12h12v24c0 8 4 14 10 14s10-6 10-14V12h12v24c0 16-10 28-22 28S14 52 14 36z" fill="#ffbf00" stroke="#1f1300" stroke-width="2"/></svg>`
}

export function deriveDemoIconKey(url: string): IconKey {
  if (url.includes('huggingface')) return 'huggingface'
  if (url.includes('vercel')) return 'vercel'
  if (url.includes('netlify')) return 'netlify'
  if (url.includes('github')) return 'github'
  return 'generic'
}
