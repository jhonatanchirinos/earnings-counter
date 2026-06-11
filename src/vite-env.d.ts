/// <reference types="vite/client" />

// https://wicg.github.io/document-picture-in-picture/#api

interface DocumentPictureInPictureOptions {
  width?: number
  height?: number
  disallowReturnToOpener?: boolean
  preferInitialWindowPlacement?: boolean
}

interface DocumentPictureInPictureEventInit extends EventInit {
  window: Window
}

declare class DocumentPictureInPictureEvent extends Event {
  constructor(type: string, eventInitDict: DocumentPictureInPictureEventInit)
  readonly window: Window
}

interface DocumentPictureInPicture extends EventTarget {
  requestWindow(options?: DocumentPictureInPictureOptions): Promise<Window>
  readonly window: Window
  onenter: ((this: DocumentPictureInPicture, ev: DocumentPictureInPictureEvent) => void) | null
}

interface Window {
  readonly documentPictureInPicture?: DocumentPictureInPicture
}
