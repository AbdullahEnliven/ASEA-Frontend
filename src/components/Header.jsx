import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Rocket, Sparkles, BookOpen, Layers, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featureDropdown, setFeatureDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setFeatureDropdown(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <div className="w-full h-full bg-[#0a0a0a] rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>
          </div>
          <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            ASEA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Features Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setFeatureDropdown(true)}
            onMouseLeave={() => setFeatureDropdown(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors py-2">
              Features
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${featureDropdown ? 'rotate-180 text-white' : 'text-gray-500'}`} />
            </button>
            
            <AnimatePresence>
              {featureDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full -left-12 pt-2 pb-2 w-[280px]"
                >
                  <div className="bg-[#111] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                    <Link to="/features" className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="mt-0.5 p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white mb-0.5">Core Features</div>
                        <div className="text-xs text-gray-400">Everything you need to build faster</div>
                      </div>
                    </Link>
                    <Link to="/docs" className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="mt-0.5 p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white mb-0.5">Documentation</div>
                        <div className="text-xs text-gray-400">Learn how to use ASEA</div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-all bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 hover:scale-105 active:scale-95"
          >
            <span>Get Started</span>
            <Rocket className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 -mr-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-6">
              <nav className="flex flex-col gap-4">
                <Link to="/features" className="text-base font-medium text-gray-300 hover:text-white">Features</Link>
                <Link to="/pricing" className="text-base font-medium text-gray-300 hover:text-white">Pricing</Link>
                <Link to="/about" className="text-base font-medium text-gray-300 hover:text-white">About Us</Link>
                <Link to="/contact" className="text-base font-medium text-gray-300 hover:text-white">Contact</Link>
              </nav>
              
              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                <Link 
                  to="/login" 
                  className="w-full py-3 px-4 text-center text-sm font-medium text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="w-full py-3 px-4 text-center text-sm font-semibold bg-white text-black rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 group"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
