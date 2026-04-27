import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers3, Menu, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';

const navItems = [
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-[#ddd5c7] bg-[#fffaf0]/90 py-3 shadow-[0_14px_40px_rgba(22,24,31,0.08)] backdrop-blur-xl' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10131b] text-white shadow-[0_12px_34px_rgba(16,19,27,0.2)] transition group-hover:-translate-y-0.5">
            <Layers3 className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tight text-[#10131b]">ASEA</span>
            <span className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#0f766e]">build room</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-4 py-2 text-sm font-bold text-[#3f4653] transition hover:bg-[#10131b] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-bold text-[#3f4653] transition hover:bg-[#eee6d7] hover:text-[#10131b]"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#10131b] px-5 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#253044]"
          >
            Start
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#cfc6b6] bg-[#fffaf0]/80 text-[#10131b] md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-[#ddd5c7] bg-[#fffaf0]/96 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-6 px-5 py-6">
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-black text-[#10131b] hover:bg-[#eee6d7]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="grid gap-3 border-t border-[#ddd5c7] pt-5">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg border border-[#cfc6b6] px-4 py-3 text-center text-sm font-black text-[#10131b]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#10131b] px-4 py-3 text-sm font-black text-white"
                >
                  Start a build
                  <Sparkles className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
