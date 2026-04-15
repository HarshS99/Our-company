import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchCategories } from '../services/api';
import ProjectCard from '../components/projects/ProjectCard';
import {
  ArrowRight, Zap, Globe, Brain, BarChart3, Settings, Smartphone,
  Star, CheckCircle, Users, Code2, TrendingUp, Quote
} from 'lucide-react';

// ---- Typewriter effect ----
import { useEffect, useState } from 'react';

const words = ['Web Apps', 'AI Models', 'Data Tools', 'Mobile Apps', 'Automation'];

function TypeWriter() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    if (!deleting && subIndex === word.length) {
      setTimeout(() => setDeleting(true), 1500);
      return;
    }
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }
    const timeout = deleting ? 60 : 100;
    const timer = setTimeout(() => setSubIndex((s) => s + (deleting ? -1 : 1)), timeout);
    return () => clearTimeout(timer);
  }, [subIndex, deleting, index]);

  return (
    <span className="gradient-text">
      {words[index].substring(0, subIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// ---- Stats ----
const stats = [
  { label: 'Projects Delivered', value: '50+', icon: CheckCircle },
  { label: 'Happy Clients', value: '30+', icon: Users },
  { label: 'Technologies', value: '20+', icon: Code2 },
  { label: 'Success Rate', value: '99%', icon: TrendingUp },
];

// ---- Services ----
const services = [
  { icon: Globe, title: 'Web Development', desc: 'Full-stack web apps, SaaS platforms, landing pages, and e-commerce solutions.', color: 'blue', slug: 'web-development' },
  { icon: Brain, title: 'AI & Machine Learning', desc: 'GPT chatbots, recommendation engines, sentiment analysis, and NLP pipelines.', color: 'purple', slug: 'ai-machine-learning' },
  { icon: BarChart3, title: 'Data Science', desc: 'Analytics dashboards, predictive models, data pipelines, and BI reports.', color: 'green', slug: 'data-science' },
  { icon: Settings, title: 'Automation Tools', desc: 'Web scrapers, workflow automation, bots, and API integrations.', color: 'orange', slug: 'automation-tools' },
  { icon: Smartphone, title: 'Mobile Apps', desc: 'Cross-platform iOS & Android apps with React Native or Flutter.', color: 'pink', slug: 'mobile-apps' },
];

const serviceColorMap = {
  blue: 'from-blue-600 to-cyan-500 shadow-blue-900/30',
  purple: 'from-purple-600 to-indigo-500 shadow-purple-900/30',
  green: 'from-green-600 to-emerald-500 shadow-green-900/30',
  orange: 'from-orange-600 to-amber-500 shadow-orange-900/30',
  pink: 'from-pink-600 to-rose-500 shadow-pink-900/30',
};

// ---- Testimonials ----
const testimonials = [
  { name: 'Sarah Johnson', role: 'CEO, TechStartup', rating: 5, text: 'Absolutely exceptional work. The AI chatbot they built increased our customer engagement by 300%. Professional, fast, and communicative throughout.' },
  { name: 'Michael Chen', role: 'Product Manager, ScaleUp', rating: 5, text: 'Delivered a complex data pipeline on time and within budget. Code quality was outstanding with great documentation. Will definitely work together again.' },
  { name: 'Priya Sharma', role: 'Founder, E-Commerce Brand', rating: 5, text: 'Our new e-commerce platform is beautiful and performs incredibly fast. The attention to UX detail was remarkable. Highly recommend!' },
];

export default function HomePage() {
  const { data: projectsData } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: () => fetchProjects({ featured: true, limit: 6 }),
  });

  const featuredProjects = projectsData?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>DevMarket — Professional Software Development Services</title>
        <meta name="description" content="Browse and request custom software development services. Web apps, AI models, data science, mobile apps, and automation tools." />
      </Helmet>

      {/* ====== HERO ====== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gray-950">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-950/20 rounded-full blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-950/60 text-brand-400 text-sm font-medium rounded-full border border-brand-800/50 mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5" />
            Professional Software Development
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-slide-up">
            We Build <br />
            <TypeWriter />
            <br />
            <span className="text-gray-300">That Scale</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
            From concept to deployment — explore ready-made projects or request custom software solutions tailored to your business needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/projects" id="hero-browse-projects" className="btn-primary text-base py-3.5 px-8">
              Browse Projects <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/request" id="hero-request-project" className="btn-secondary text-base py-3.5 px-8">
              Request Custom Build
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass-card p-5 text-center">
                <Icon className="w-5 h-5 text-brand-400 mx-auto mb-2" />
                <div className="font-display text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-gray-500 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SERVICES ====== */}
      <section id="services" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <div className="section-tag"><Zap className="w-3.5 h-3.5" />What We Offer</div>
            <h2 className="section-title">Our <span className="gradient-text">Services</span></h2>
            <p className="section-subtitle">Full-spectrum software engineering across every modern domain — from cutting-edge AI to seamless mobile experiences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, desc, color, slug }) => (
              <Link
                key={title}
                to={`/projects?category=${slug}`}
                id={`service-${slug}`}
                className="card card-hover p-6 group flex flex-col gap-4"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${serviceColorMap[color]} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
                <div className="flex items-center gap-1 text-brand-400 text-sm font-medium mt-auto">
                  Browse Projects <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURED PROJECTS ====== */}
      <section id="featured" className="py-24 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <div className="section-tag"><Star className="w-3.5 h-3.5" />Handpicked</div>
            <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
            <p className="section-subtitle">Our most popular and highly-rated projects, ready to deploy or customize for your needs.</p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">Loading projects…</div>
          )}

          <div className="text-center mt-12">
            <Link to="/projects" id="view-all-projects" className="btn-outline">
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <div className="section-tag"><Star className="w-3.5 h-3.5" />Client Stories</div>
            <h2 className="section-title">What Clients <span className="gradient-text">Say</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, rating, text }) => (
              <div key={name} className="card p-6 flex flex-col gap-4">
                <Quote className="w-6 h-6 text-brand-500 opacity-60" />
                <p className="text-gray-300 text-sm leading-relaxed italic flex-1">{text}</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{name}</div>
                  <div className="text-gray-500 text-xs">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA BANNER ====== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-purple-700 p-12 text-center">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Ready to Build Something Amazing?</h2>
              <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">Tell us about your project and we'll get back to you within 24 hours with a custom proposal.</p>
              <Link to="/request" id="cta-request-project" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-all duration-200 shadow-2xl hover:-translate-y-0.5">
                <Zap className="w-5 h-5" />
                Request Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
