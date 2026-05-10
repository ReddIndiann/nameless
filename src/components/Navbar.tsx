import { Link } from 'react-router-dom'
import { ShoppingBag, Palette, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              NAMELESS
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/catalog" className="hover:text-red-500 transition-colors">Catalog</Link>
              <Link to="/designer" className="hover:text-red-500 transition-colors flex items-center gap-2">
                <Palette className="w-4 h-4" /> Custom Design
              </Link>
              <button className="relative hover:text-red-500 transition-colors">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-200">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/catalog" className="block px-3 py-2 rounded-md hover:bg-slate-800" onClick={() => setIsOpen(false)}>Catalog</Link>
              <Link to="/designer" className="block px-3 py-2 rounded-md hover:bg-slate-800" onClick={() => setIsOpen(false)}>Custom Design</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
