import { Link } from 'react-router-dom';
import { Github, Layers3, Linkedin, Mail, Twitter } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Dashboard', to: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Account', to: '/account' },
    ],
  },
  {
    title: 'Launch',
    links: [
      { label: 'New project', to: '/projects/new' },
      { label: 'Billing', to: '/account/billing' },
      { label: 'Login', to: '/login' },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#d9d1c1] bg-[#fffaf0] px-5 py-14 text-[#10131b] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="mb-6 inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10131b] text-white">
                <Layers3 className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xl font-black tracking-tight">ASEA</span>
                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0f766e]">commerce build room</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-[#5c6270]">
              AI-generated commerce projects with storefronts, databases, admin tooling, and export paths designed to stay in your hands.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[#3f4653]">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="rounded-lg border border-[#d7d0c1] p-2 transition hover:bg-[#10131b] hover:text-white" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-lg border border-[#d7d0c1] p-2 transition hover:bg-[#10131b] hover:text-white" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-lg border border-[#d7d0c1] p-2 transition hover:bg-[#10131b] hover:text-white" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="mailto:hello@asea.dev" className="rounded-lg border border-[#d7d0c1] p-2 transition hover:bg-[#10131b] hover:text-white" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#8a7142]">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm font-bold text-[#4f5664] transition hover:text-[#10131b]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#d9d1c1] pt-6 text-sm font-bold text-[#68707d] sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {currentYear} ASEA Inc. All rights reserved.</p>
          <p className="rounded-lg bg-[#e9f6f1] px-3 py-2 text-[#0f766e]">Generation systems operational</p>
        </div>
      </div>
    </footer>
  );
}
