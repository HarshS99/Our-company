import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchCategories } from '../services/api';
import ProjectCard from '../components/projects/ProjectCard';
import { Search, Filter, Loader2, PackageSearch } from 'lucide-react';

function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');

  const debouncedSearch = useDebounce(search);

  // Sync URL params
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeCategory !== 'all') params.category = activeCategory;
    setSearchParams(params);
  }, [debouncedSearch, activeCategory]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects', debouncedSearch, activeCategory],
    queryFn: () => fetchProjects({
      search: debouncedSearch || undefined,
      category: activeCategory !== 'all' ? activeCategory : undefined,
      limit: 50,
    }),
  });

  const categories = categoriesData?.data?.data || [];
  const projects = projectsData?.data?.data || [];
  const total = projectsData?.data?.total || 0;

  return (
    <>
      <Helmet>
        <title>Browse Projects — DevMarket</title>
        <meta name="description" content="Explore our full catalog of software development projects. Filter by category and find the perfect solution." />
      </Helmet>

      {/* Header */}
      <div className="pt-24 pb-12 bg-gray-900/40 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Browse <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-gray-400 text-lg">{total} projects across {categories.length} categories</p>

          {/* Search */}
          <div className="mt-6 relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              id="projects-search"
              type="text"
              placeholder="Search projects, tech stack…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            id="filter-all"
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === 'all'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700'
            }`}
          >
            All Projects
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              id={`filter-${cat.slug}`}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeCategory === cat.slug
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="text-xs opacity-60">({cat.projectCount})</span>
            </button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PackageSearch className="w-16 h-16 text-gray-700 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No projects found</h3>
            <p className="text-gray-600">Try a different search term or category.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6 text-gray-500 text-sm">
              <Filter className="w-4 h-4" />
              Showing {projects.length} of {total} projects
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
