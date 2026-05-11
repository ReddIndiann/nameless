import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'

interface ToolButtonProps {
  icon: ComponentType<LucideProps>
  label: string
  onClick?: () => void
  active?: boolean
  disabled?: boolean
}

export const ToolButton = ({ icon: Icon, label, onClick, active, disabled }: ToolButtonProps) => {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 group w-full
        ${disabled ? 'opacity-30 cursor-not-allowed border-slate-900 bg-slate-950/20' : ''}
        ${!disabled && active 
          ? 'bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
          : !disabled ? 'bg-slate-950/50 border-slate-800 hover:border-slate-700' : ''}
      `}
    >
      <Icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${active ? 'text-red-500' : 'text-slate-400'}`} />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-white' : 'text-slate-500'}`}>
        {label}
      </span>
    </motion.button>
  )
}
