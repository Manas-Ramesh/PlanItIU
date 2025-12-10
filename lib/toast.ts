// Simple toast utility to replace sonner
let toastContainer: HTMLDivElement | null = null

interface ToastOptions {
  duration?: number
}

function createToastContainer() {
  if (toastContainer) return toastContainer
  
  toastContainer = document.createElement('div')
  toastContainer.id = 'toast-container'
  toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2'
  document.body.appendChild(toastContainer)
  return toastContainer
}

function showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
  const container = createToastContainer()
  const toast = document.createElement('div')
  
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }
  
  toast.className = `${bgColors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[300px] animate-in slide-in-from-right`
  toast.textContent = message
  
  container.appendChild(toast)
  
  setTimeout(() => {
    toast.style.animation = 'fade-out 0.3s ease-out'
    setTimeout(() => {
      toast.remove()
      if (container.children.length === 0) {
        container.remove()
        toastContainer = null
      }
    }, 300)
  }, duration)
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    showToast(message, 'success', options?.duration)
  },
  error: (message: string, options?: ToastOptions) => {
    showToast(message, 'error', options?.duration)
  },
  info: (message: string, options?: ToastOptions) => {
    showToast(message, 'info', options?.duration)
  }
}
