export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-slate-100 mb-4">NAMELESS</h3>
            <p className="text-slate-400 max-w-xs">
              Redefining apparel through custom designs and premium quality. Express yourself without saying a word.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-red-500 transition-colors">Default Designs</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Custom Shirts</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Accessories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-red-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-900 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Nameless Apparel. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
