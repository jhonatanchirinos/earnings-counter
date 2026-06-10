import { createApp, ref, watch } from 'vue'
import { getActivePinia, storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import PipWidget from '@/components/PipWidget.vue'

export function usePictureInPicture() {
  const isPipSupported = 'documentPictureInPicture' in window
  const isPipActive = ref(false)

  let pipWindow: Window | null = null
  let pipApp: ReturnType<typeof createApp> | null = null
  let stopThemeWatch: (() => void) | null = null

  function cleanup() {
    stopThemeWatch?.()
    stopThemeWatch = null

    pipApp?.unmount()
    pipApp = null

    isPipActive.value = false

    pipWindow = null
  }

  async function openPip() {
    if (!isPipSupported || isPipActive.value) return

    pipWindow = await window.documentPictureInPicture!.requestWindow({
      width: 450,
      height: 180,
    })

    // Copy host styles so the pip window inherits the app's visual design
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const newLink = pipWindow!.document.createElement('link')
      newLink.rel = 'stylesheet'
      newLink.href = (link as HTMLLinkElement).href

      pipWindow!.document.head.appendChild(newLink)
    })

    document.querySelectorAll('style').forEach((style) => {
      const newStyle = pipWindow!.document.createElement('style')
      newStyle.textContent = style.textContent

      pipWindow!.document.head.appendChild(newStyle)
    })

    // Sync theme class with the main window
    const themeStore = useThemeStore()
    const { resolvedTheme } = storeToRefs(themeStore)

    pipWindow.document.documentElement.classList.add(resolvedTheme.value)

    stopThemeWatch = watch(resolvedTheme, (newTheme, oldTheme) => {
      pipWindow?.document.documentElement.classList.remove(oldTheme)
      pipWindow?.document.documentElement.classList.add(newTheme)
    })

    // Mount the pip widget into the pip window
    const container = pipWindow.document.createElement('div')

    pipWindow.document.body.style.margin = '0'
    pipWindow.document.body.style.padding = '0'
    pipWindow.document.body.appendChild(container)

    const pinia = getActivePinia()

    pipApp = createApp(PipWidget)
    if (pinia) pipApp.use(pinia)
    pipApp.mount(container)

    isPipActive.value = true

    pipWindow.addEventListener('pagehide', cleanup)
  }

  function closePip() {
    pipWindow?.close()
  }

  async function togglePip() {
    if (isPipActive.value) {
      closePip()
    } else {
      await openPip()
    }
  }

  return { isPipSupported, isPipActive, togglePip }
}
