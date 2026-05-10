import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart } from 'lucide-react'
import { Toast } from '../components/Toast'

const MOCK_PRODUCTS = [
  { id: 1, name: 'Obsidian Tee', price: 45, category: 'Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Cyber Cap', price: 30, category: 'Accessories', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800' },
  { id: 3, name: 'Neon Hoodie', price: 75, category: 'Hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800' },
  { id: 4, name: 'Void Tote', price: 25, category: 'Accessories', image: 'https://images.unsplash.com/photo-1544816153-12ad5d714b21?auto=format&fit=crop&q=80&w=800' },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export const Catalog = () => {
  const [toast, setToast] = useState({ show: false, message: '' })

  const addToCart = (name: string) => {
    setToast({ show: true, message: `${name} added to cart!` })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Our Collection</h1>
          <p className="text-slate-400 font-medium text-lg">Browse our signature designs.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <select className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 text-white px-6 py-3 rounded-2xl font-semibold outline-none focus:border-red-500 transition-colors w-full sm:w-auto">
            <option>All Categories</option>
            <option>Shirts</option>
            <option>Accessories</option>
            <option>Hoodies</option>
          </select>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {MOCK_PRODUCTS.map((product) => (
          <motion.div
            key={product.id}
            variants={item}
            className="group"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 mb-5 shadow-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                <button 
                  onClick={() => addToCart(product.name)}
                  className="bg-white text-black p-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button className="bg-white text-black p-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 active:scale-95">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">{product.name}</h3>
              <div className="flex items-center justify-between">
                <p className="text-red-500 font-black text-lg">${product.price}</p>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{product.category}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Toast 
        message={toast.message} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  )
}
