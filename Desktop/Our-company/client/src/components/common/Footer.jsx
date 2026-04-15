import { Link } from 'react-router-dom';
import { Code2, Mail, ArrowRight, ExternalLink } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Browse Projects', href: '/projects' },
    { label: 'Request Project', href: '/request' },
    { label: 'Admin Panel', href: '/admin/login' },
  ],
  Categories: [
    { label: 'Web Development', href: '/projects?category=web-development' },
    { label: 'AI & Machine Learning', href: '/projects?category=ai-machine-learning' },
    { label: 'Data Science', href: '/projects?category=data-science' },
    { label: 'Automation Tools', href: '/projects?category=automation-tools' },
    { label: 'Mobile Apps', href: '/projects?category=mobile-apps' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">Dev<span className="gradient-text">Market</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              Professional software development services for startups and businesses. From web apps to AI solutions, we build what matters.
            </p>
            <Link to="/request" className="btn-primary py-2.5 px-5 text-sm w-fit">
              Start a Project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-gray-400 hover:text-brand-400 text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} DevMarket. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[
              { label: 'GitHub', href: 'https://github.com', text: 'GH' },
              { label: 'Twitter', href: 'https://twitter.com', text: 'TW' },
              { label: 'LinkedIn', href: 'https://linkedin.com', text: 'LI' },
              { label: 'Email', href: 'mailto:admin@devmarket.com', text: 'EM' },
            ].map(({ label, href, text }) => (
              <a key={label} href={href} aria-label={label} className="w-8 h-8 rounded-full bg-gray-800 hover:bg-brand-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 text-xs font-bold">
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
