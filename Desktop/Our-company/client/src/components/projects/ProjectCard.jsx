import { Link } from 'react-router-dom';
import { ExternalLink, MessageCircle, Tag, ArrowRight } from 'lucide-react';

const techColors = {
  React: 'bg-cyan-950 text-cyan-400 border-cyan-800',
  'Node.js': 'bg-green-950 text-green-400 border-green-800',
  Python: 'bg-blue-950 text-blue-400 border-blue-800',
  MongoDB: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  'Tailwind CSS': 'bg-teal-950 text-teal-400 border-teal-800',
  Express: 'bg-gray-800 text-gray-300 border-gray-600',
  'React Native': 'bg-cyan-950 text-cyan-400 border-cyan-800',
  Docker: 'bg-blue-950 text-blue-400 border-blue-800',
  FastAPI: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  Stripe: 'bg-violet-950 text-violet-400 border-violet-800',
  default: 'bg-gray-900 text-gray-400 border-gray-700',
};

const getTechColor = (tech) => techColors[tech] || techColors.default;

const categoryColors = {
  blue: 'from-blue-600 to-cyan-500',
  purple: 'from-purple-600 to-indigo-500',
  green: 'from-green-600 to-emerald-500',
  orange: 'from-orange-600 to-amber-500',
  pink: 'from-pink-600 to-rose-500',
};

export default function ProjectCard({ project }) {
  const { title, description, techStack = [], price, priceLabel, category, slug, demoUrl, status, featured } = project;
  const gradClass = categoryColors[category?.color] || 'from-brand-600 to-purple-500';

  return (
    <div className="card card-hover flex flex-col group relative overflow-hidden">
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-10 badge bg-amber-950 text-amber-400 border border-amber-800/50">
          ⭐ Featured
        </div>
      )}

      {/* Color header strip */}
      <div className={`h-1.5 bg-gradient-to-r ${gradClass} rounded-t-2xl`} />

      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Category + Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>{category?.icon}</span>
            <span>{category?.name}</span>
          </span>
          <span className={`badge text-xs border ${
            status === 'available' ? 'bg-green-950 text-green-400 border-green-800' :
            status === 'in-progress' ? 'bg-yellow-950 text-yellow-400 border-yellow-800' :
            'bg-gray-800 text-gray-400 border-gray-700'
          }`}>
            {status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-400 transition-colors leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed flex-1 line-clamp-2">{description}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5">
          {techStack.slice(0, 4).map((tech) => (
            <span key={tech} className={`badge text-xs border ${getTechColor(tech)}`}>
              {tech}
            </span>
          ))}
          {techStack.length > 4 && (
            <span className="badge text-xs border bg-gray-900 text-gray-500 border-gray-700">
              +{techStack.length - 4} more
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <Tag className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <span className="text-brand-400 font-semibold text-sm">
            {priceLabel || (price > 0 ? `Starting at $${price.toLocaleString()}` : 'Custom Quote')}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              id={`demo-${slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold border border-gray-700 hover:border-brand-500 text-gray-300 hover:text-brand-400 rounded-lg transition-all duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </a>
          )}
          <Link
            to={`/projects/${slug}`}
            id={`view-${slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-all duration-200"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            View Details
          </Link>
        </div>

        <Link
          to={`/request?project=${slug}`}
          id={`request-${slug}`}
          className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-400 hover:text-green-400 transition-colors border border-dashed border-gray-800 hover:border-green-800 rounded-lg"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Request This Project
        </Link>
      </div>
    </div>
  );
}
