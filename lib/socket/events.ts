import type {
  Slide, PresentationMode, ServiceItem,
  SocketSlideChangePayload, SocketModeChangePayload,
  SocketStageMessagePayload, SocketTimerPayload, Theme
} from '@/types'

export interface ServerToClientEvents {
  'slide:change':    (payload: SocketSlideChangePayload) => void
  'mode:change':     (payload: SocketModeChangePayload) => void
  'service:update':  (payload: { items: ServiceItem[] }) => void
  'stage:message':   (payload: SocketStageMessagePayload) => void
  'stage:timer':     (payload: SocketTimerPayload) => void
  'theme:change':    (payload: { theme: Theme }) => void
  'connected':       (payload: { room: string }) => void
}

export interface ClientToServerEvents {
  'operator:slide':   (payload: { slide: Slide; next: Slide | null }) => void
  'operator:mode':    (payload: { mode: PresentationMode }) => void
  'operator:message': (payload: { text: string }) => void
  'operator:timer':   (payload: SocketTimerPayload) => void
  'join:room':        (payload: { room: 'output' | 'stage' | 'operator' }) => void
}

export const SOCKET_ROOMS = {
  OPERATOR: 'operator',
  OUTPUT: 'output',
  STAGE: 'stage',
} as const
