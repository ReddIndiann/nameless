import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
}

export const Toast = ({ message, type = 'success', isVisible, onClose }: ToastProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl"
        >
          {type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
          {type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
          {type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
          <span className="text-sm font-medium text-white">{message}</span>
          <button 
            onClick={onClose}
            className="ml-2 text-slate-500 hover:text-white transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
