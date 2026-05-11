import { motion } from 'framer-motion'
import { Box, Undo2, Redo2, Maximize2, Monitor, Share2 } from 'lucide-react'

interface ControlPanelProps {
  view: '2d' | '3d'
  onViewChange: (view: '2d' | '3d') => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

export const ControlPanel = ({ view, onViewChange, onUndo, onRedo, canUndo, canRedo }: ControlPanelProps) => {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-2 rounded-2xl shadow-2xl flex items-center gap-1">
        <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onViewChange('2d')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              view === '2d' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Monitor className="w-4 h-4" /> Studio
          </button>
          <button
            onClick={() => onViewChange('3d')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              view === '3d' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Box className="w-4 h-4" /> 3D Preview
          </button>
        </div>

        <div className="w-px h-6 bg-slate-800 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-slate-800 mx-2" />

        <button className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <Share2 className="w-4 h-4" />
        </button>
        <button className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
