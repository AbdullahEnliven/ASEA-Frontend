import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#050505] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-6 inline-flex">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                <div className="w-full h-full bg-[#0a0a0a] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                ASEA
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              The ultimate AI-driven e-commerce platform generator. Build, deploy, and scale your digital storefront in minutes, not months.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors p-2 hover:bg-blue-400/10 rounded-lg">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors p-2 hover:bg-blue-500/10 rounded-lg">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:hello@asea.dev" className="hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-lg">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Product</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/#integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              <li><Link to="/#changelog" className="hover:text-white transition-colors flex items-center gap-2">Changelog <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded-full font-medium">New</span></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Developer API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {currentYear} ASEA Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
