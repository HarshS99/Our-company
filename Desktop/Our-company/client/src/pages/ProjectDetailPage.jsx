import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetchProject } from '../services/api';
import { ArrowLeft, ExternalLink, Code2, MessageCircle, Tag, Loader2, CheckCircle } from 'lucide-react';

export default function ProjectDetailPage() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => fetchProject(slug),
  });

  const project = data?.data?.data;

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
    </div>
  );

  if (isError || !project) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-16 text-center px-4">
      <h1 className="text-3xl font-bold text-white mb-3">Project Not Found</h1>
      <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or has been removed.</p>
      <Link to="/projects" className="btn-primary">Back to Projects</Link>
    </div>
  );

  const { title, description, longDescription, techStack = [], price, priceLabel, category, demoUrl, githubUrl, status, featured, createdAt } = project;

  return (
    <>
      <Helmet>
        <title>{title} — DevMarket</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className="pt-24 min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Link to="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-400 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <span>{category?.icon}</span>
                    <span>{category?.name}</span>
                  </span>
                  {featured && <span className="badge bg-amber-950 text-amber-400 border border-amber-800/50">⭐ Featured</span>}
                  <span className={`badge border text-sm ${
                    status === 'available' ? 'bg-green-950 text-green-400 border-green-800' : 'bg-gray-800 text-gray-400 border-gray-700'
                  }`}>{status}</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
                <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
              </div>

              {/* Long Description */}
              {longDescription && (
                <div className="card p-6">
                  <h2 className="font-display text-xl font-bold text-white mb-4">Project Overview</h2>
                  <p className="text-gray-300 leading-relaxed">{longDescription}</p>
                </div>
              )}

              {/* Tech Stack */}
              <div className="card p-6">
                <h2 className="font-display text-xl font-bold text-white mb-4">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span key={tech} className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-400" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div className="card p-6">
                <h2 className="font-display text-xl font-bold text-white mb-4">What's Included</h2>
                <ul className="space-y-3 text-gray-300 text-sm">
                  {[
                    'Full source code with clean architecture',
                    'Detailed README & setup documentation',
                    'Database schema and seed data',
                    'Responsive design for all devices',
                    '1 month post-delivery support',
                    'Free minor revisions after delivery',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <div className="card p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Tag className="w-4 h-4 text-brand-400" />
                    <span className="text-gray-400 text-sm">Starting Price</span>
                  </div>
                  <div className="font-display text-4xl font-bold text-white">
                    {price > 0 ? `$${price.toLocaleString()}` : 'Custom'}
                  </div>
                  <div className="text-brand-400 text-sm mt-1">{priceLabel || 'Get a custom quote'}</div>
                </div>

                <div className="space-y-3">
                  <Link
                    to={`/request?project=${slug}`}
                    id="detail-request-btn"
                    className="btn-primary w-full justify-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Request This Project
                  </Link>
                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="detail-demo-btn"
                      className="btn-secondary w-full justify-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="detail-github-btn"
                      className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition-all text-sm font-medium"
                    >
                      <Code2 className="w-4 h-4" />
                      View on GitHub
                    </a>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-800 text-xs text-gray-500 text-center space-y-1">
                  <p>✅ Source code included</p>
                  <p>✅ 1 month support</p>
                  <p>✅ Free revisions</p>
                </div>
              </div>

              {/* Meta info */}
              <div className="card p-4 text-sm text-gray-500 space-y-2">
                <div className="flex justify-between"><span>Category</span><span className="text-gray-300">{category?.name}</span></div>
                <div className="flex justify-between"><span>Status</span><span className={status === 'available' ? 'text-green-400' : 'text-gray-400'}>{status}</span></div>
                <div className="flex justify-between"><span>Added</span><span className="text-gray-300">{new Date(createdAt).toLocaleDateString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
