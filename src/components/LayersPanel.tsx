import { motion } from 'framer-motion'
import { Layers, GripVertical, Trash2 } from 'lucide-react'
import type { DesignElement } from '../types/designer'

interface LayersPanelProps {
  elements: DesignElement[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export const LayersPanel = ({ elements, selectedId, onSelect, onDelete }: LayersPanelProps) => {
  // Reverse elements to show top-most first in the UI
  const reversedElements = [...elements].reverse()

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl p-4 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 px-2 mb-4">
        <Layers className="w-4 h-4 text-red-500" />
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Layers</h3>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
        {reversedElements.length === 0 ? (
          <p className="text-center py-8 text-slate-600 text-sm italic">No layers yet</p>
        ) : (
          reversedElements.map((el) => (
            <motion.div
              key={el.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`group flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                selectedId === el.id 
                  ? 'bg-red-500/10 border-red-500/50' 
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
              onClick={() => onSelect(el.id)}
            >
              <GripVertical className="w-4 h-4 text-slate-700 group-hover:text-slate-500" />
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${selectedId === el.id ? 'text-white' : 'text-slate-400'}`}>
                  {el.name || (el.type === 'text' ? (el.text || 'Untitled Text') : 'Image Layer')}
                </p>
                <p className="text-[10px] text-slate-600 uppercase font-black tracking-tighter">
                  {el.type}
                </p>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(el.id)
                  }}
                  className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
