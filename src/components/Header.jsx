import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Always visible */}
        <h1 className="text-xl font-bold tracking-tighter">ASEA</h1>

        {/* Desktop Navigation - Hidden on mobile (hidden), shown on small screens (sm:flex) */}
        <nav className="hidden sm:flex items-center space-x-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">
            Docs
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors text-blue-500 font-semibold border border-blue-500/20 px-3 py-1 rounded-md bg-blue-500/5"
          >
            Github
          </a>
        </nav>

        {/* Mobile Menu Button - Visible only on mobile (block sm:hidden) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="block sm:hidden p-2 text-gray-400 hover:text-white"
        >
          <span className="sr-only">Open Menu</span>
          {/* Simple Hamburger Icon */}
          <div className="space-y-1.5">
            <div
              className={`h-0.5 w-6 bg-current transition-transform ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            ></div>
            <div
              className={`h-0.5 w-6 bg-current transition-opacity ${isMenuOpen ? "opacity-0" : ""}`}
            ></div>
            <div
              className={`h-0.5 w-6 bg-current transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></div>
          </div>
        </button>
      </div>

      {/* Mobile Dropdown - Only shows when toggled */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-white/5 bg-[#0a0a0a] px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <a href="#" className="block text-lg text-gray-300 hover:text-white">
            Docs
          </a>
          <a href="#" className="block text-lg text-blue-400">
            Github
          </a>
        </div>
      )}
    </header>
  );
}
