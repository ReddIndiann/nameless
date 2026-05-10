import { motion } from 'framer-motion'
import { ArrowRight, Palette, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'

export const Home = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Design Your <span className="text-red-500">Identity.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-lg">
              Premium apparel for those who refuse to be categorized. Order our exclusive collections or create your own masterpiece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/catalog"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5" /> Shop Collection
              </Link>
              <Link
                to="/designer"
                className="bg-transparent border-2 border-slate-700 hover:border-red-500 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                <Palette className="w-5 h-5" /> Design Custom
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-red-500/20 blur-3xl rounded-full animate-pulse" />
            <img
              src={heroImage}
              alt="Premium Apparel"
              className="relative rounded-2xl shadow-2xl border border-slate-800"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Nameless?</h2>
            <div className="h-1 w-20 bg-red-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Premium Quality',
                desc: 'We use the finest fabrics to ensure comfort and durability.',
                icon: <ShoppingBag className="w-8 h-8 text-red-500" />
              },
              {
                title: 'Unique Designs',
                desc: 'Our default collections are crafted by world-class artists.',
                icon: <ArrowRight className="w-8 h-8 text-red-500" />
              },
              {
                title: 'Total Control',
                desc: 'Our designer studio gives you the power to create anything.',
                icon: <Palette className="w-8 h-8 text-red-500" />
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-red-500/50 transition-colors group"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
