import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          ASEA
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Docs
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/20 px-3 py-1 rounded-md bg-blue-500/5"
          >
            GitHub
          </a>
          <Link
            to="/login"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="block sm:hidden p-2 text-gray-400 hover:text-white"
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <div className={`h-0.5 w-6 bg-current transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`h-0.5 w-6 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`h-0.5 w-6 bg-current transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-white/5 bg-[#0a0a0a] px-4 py-6 space-y-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white">
            Docs
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block text-blue-400">
            GitHub
          </a>
          <Link to="/login" className="block text-gray-300 hover:text-white">
            Log in
          </Link>
          <Link
            to="/register"
            className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
