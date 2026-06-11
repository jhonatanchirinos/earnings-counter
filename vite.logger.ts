import { createLogger } from 'vite'

const logger = createLogger()
const originalInfo = logger.info.bind(logger)

// Vite's reported Network IP is incorrect in containerized/WSL2 environments — replace it with your machine's IPv4 address.
logger.info = (message, options) => {
  const replaced = message.replace(
    /(?<=➜\s+Network:\s+)http:\/\/[\d.]+:(\d+)\//,
    'http://<your-host-ip>:$1/',
  )

  if (replaced !== message) {
    originalInfo(replaced + " (replace with your machine's IPv4)", options)
    return
  }

  originalInfo(message, options)
}

export { logger }
