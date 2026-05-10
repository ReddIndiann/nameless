import { motion } from 'framer-motion'
import { Trash2, Type, Move, RotateCw } from 'lucide-react'
import type { DesignElement } from '../types/designer'

interface PropertiesPanelProps {
  element: DesignElement
  onChange: (newAttrs: Partial<DesignElement>) => void
  onDelete: () => void
}

const COLORS = [
  '#ffffff', '#ff4d4d', '#ff9f43', '#feca57', 
  '#1dd1a1', '#48dbfb', '#00d2d3', '#5f27cd',
  '#222f3e', '#576574'
]

export const PropertiesPanel = ({ element, onChange, onDelete }: PropertiesPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl space-y-8"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {element.type === 'text' ? <Type className="w-5 h-5 text-red-500" /> : <Move className="w-5 h-5 text-red-500" />}
          Edit {element.type}
        </h3>
        <button 
          onClick={onDelete}
          className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {element.type === 'text' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Text Content</label>
            <input
              type="text"
              value={element.text}
              onChange={(e) => onChange({ text: e.target.value })}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Font Size</label>
            <input
              type="range"
              min="12"
              max="100"
              value={element.fontSize}
              onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
              className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Colors</label>
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onChange({ fill: color })}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${element.fill === color ? 'border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <RotateCw className="w-3 h-3" /> Rotation
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={element.rotation || 0}
          onChange={(e) => onChange({ rotation: parseInt(e.target.value) })}
          className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {element.type === 'image' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={element.opacity ?? 1}
            onChange={(e) => onChange({ opacity: parseFloat(e.target.value) })}
            className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </motion.div>
  )
}
