import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  fetchProjects, deleteProject, createProject, updateProject,
  fetchRequests, deleteRequest, updateRequestStatus,
  fetchCategories
} from '../services/api';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, FolderOpen, MessageSquare, LogOut, Code2,
  Plus, Pencil, Trash2, Eye, ExternalLink, X, Save, Loader2,
  TrendingUp, Users, Package, Mail, ChevronDown, Search, Star
} from 'lucide-react';

// ---- Stat Card ----
function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    blue: 'from-blue-600 to-cyan-500',
    purple: 'from-purple-600 to-indigo-500',
    green: 'from-green-600 to-emerald-500',
    orange: 'from-orange-600 to-amber-500',
  };
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 bg-gradient-to-br ${colorMap[color]} rounded-xl flex items-center justify-center shadow-lg shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="font-display text-2xl font-bold text-white">{value}</div>
        <div className="text-gray-500 text-xs">{label}</div>
      </div>
    </div>
  );
}

// ---- Project Form Modal ----
const emptyProject = { title: '', description: '', longDescription: '', category: '', techStack: '', price: '', priceLabel: '', demoUrl: '', githubUrl: '', featured: false, status: 'available' };

function ProjectModal({ project, categories, onClose, onSave, loading }) {
  const [form, setForm] = useState(project ? {
    ...project,
    category: project.category?._id || project.category || '',
    techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : '',
  } : emptyProject);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean),
      price: parseFloat(form.price) || 0,
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="font-display text-xl font-bold text-white">{project ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="Project title" className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Short Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={2} placeholder="Brief description (max 300 chars)" className="input-field resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Long Description</label>
              <textarea name="longDescription" value={form.longDescription} onChange={handleChange} rows={3} placeholder="Detailed description…" className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required className="select-field">
                <option value="">Select category…</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="select-field">
                <option value="available">Available</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Tech Stack (comma-separated)</label>
              <input name="techStack" value={form.techStack} onChange={handleChange} placeholder="React, Node.js, MongoDB, Tailwind CSS" className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Price (USD)</label>
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="499" className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Price Label</label>
              <input name="priceLabel" value={form.priceLabel} onChange={handleChange} placeholder="Starting at $499" className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Demo URL</label>
              <input name="demoUrl" type="url" value={form.demoUrl} onChange={handleChange} placeholder="https://demo.example.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">GitHub URL</label>
              <input name="githubUrl" type="url" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/…" className="input-field" />
            </div>
            <div className="flex items-center gap-3">
              <input id="featured-toggle" name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="w-4 h-4 text-brand-600 rounded border-gray-600 bg-gray-800" />
              <label htmlFor="featured-toggle" className="text-sm text-gray-300 cursor-pointer">Feature on homepage</label>
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-gray-800">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center py-3">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Saving…' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Status Badge ----
function StatusBadge({ status }) {
  const map = {
    new: 'status-badge-new',
    reviewed: 'status-badge-reviewed',
    contacted: 'status-badge-contacted',
    closed: 'status-badge-closed',
  };
  return <span className={map[status] || 'status-badge-new'}>{status}</span>;
}

// ---- Main Dashboard ----
export default function AdminDashboardPage() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [modalData, setModalData] = useState(null); // null=closed, {}=new, project=edit
  const [modalLoading, setModalLoading] = useState(false);
  const [searchProject, setSearchProject] = useState('');

  const { data: projectsData } = useQuery({ queryKey: ['admin-projects'], queryFn: () => fetchProjects({ limit: 100 }) });
  const { data: requestsData } = useQuery({ queryKey: ['admin-requests'], queryFn: () => fetchRequests({ limit: 100 }) });
  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  const projects = projectsData?.data?.data || [];
  const requests = requestsData?.data?.data || [];
  const categories = categoriesData?.data?.data || [];

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchProject.toLowerCase())
  );

  // ---- Mutations ----
  const { mutateAsync: deleteProjMutation } = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => { qc.invalidateQueries(['admin-projects']); toast.success('Project deleted.'); },
  });

  const { mutateAsync: deleteReqMutation } = useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => { qc.invalidateQueries(['admin-requests']); toast.success('Request deleted.'); },
  });

  const { mutateAsync: updateStatusMutation } = useMutation({
    mutationFn: ({ id, status }) => updateRequestStatus(id, status),
    onSuccess: () => { qc.invalidateQueries(['admin-requests']); },
  });

  const handleSaveProject = async (data) => {
    setModalLoading(true);
    try {
      if (modalData?._id) {
        await updateProject(modalData._id, data);
        toast.success('Project updated!');
      } else {
        await createProject(data);
        toast.success('Project created!');
      }
      qc.invalidateQueries(['admin-projects']);
      qc.invalidateQueries(['featured-projects']);
      setModalData(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await deleteProjMutation(id);
  };

  const handleDeleteRequest = async (id) => {
    if (!confirm('Delete this request?')) return;
    await deleteReqMutation(id);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Package },
    { id: 'requests', label: 'Requests', icon: MessageSquare },
  ];

  const newRequestsCount = requests.filter((r) => r.status === 'new').length;

  return (
    <>
      <Helmet><title>Admin Dashboard — DevMarket</title></Helmet>

      <div className="min-h-screen bg-gray-950 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 flex flex-col fixed h-full z-40 bg-gray-950">
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white">Dev<span className="gradient-text">Market</span></span>
            </div>
            <div className="mt-3 px-2 py-2 bg-gray-900 rounded-lg">
              <div className="text-xs text-gray-500">Logged in as</div>
              <div className="text-sm font-medium text-white truncate">{admin?.name || 'Admin'}</div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`admin-tab-${id}`}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === id ? 'bg-brand-950 text-brand-400 border border-brand-800/50' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {id === 'requests' && newRequestsCount > 0 && (
                  <span className="ml-auto badge bg-brand-600 text-white text-xs px-2">{newRequestsCount}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800 space-y-2">
            <a href="/" target="_blank" className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-900 hover:text-white transition-all">
              <ExternalLink className="w-4 h-4" />View Site
            </a>
            <button
              id="admin-logout-btn"
              onClick={() => { logoutAdmin(); navigate('/admin/login'); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-all"
            >
              <LogOut className="w-4 h-4" />Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8 overflow-auto">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back, {admin?.name}!</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Projects" value={projects.length} icon={Package} color="blue" />
                <StatCard label="Total Requests" value={requests.length} icon={Mail} color="purple" />
                <StatCard label="New Requests" value={newRequestsCount} icon={TrendingUp} color="orange" />
                <StatCard label="Featured Projects" value={projects.filter((p) => p.featured).length} icon={Star} color="green" />
              </div>

              {/* Recent Requests */}
              <div className="card">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-white">Recent Requests</h2>
                  <button onClick={() => setActiveTab('requests')} className="text-brand-400 text-sm hover:text-brand-300">View all →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
                        <th className="text-left px-6 py-3">Name</th>
                        <th className="text-left px-6 py-3 hidden md:table-cell">Email</th>
                        <th className="text-left px-6 py-3">Type</th>
                        <th className="text-left px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.slice(0, 5).map((req) => (
                        <tr key={req._id} className="border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors">
                          <td className="px-6 py-3 text-white font-medium">{req.name}</td>
                          <td className="px-6 py-3 text-gray-400 hidden md:table-cell">{req.email}</td>
                          <td className="px-6 py-3 text-gray-400 capitalize">{req.projectType}</td>
                          <td className="px-6 py-3"><StatusBadge status={req.status} /></td>
                        </tr>
                      ))}
                      {requests.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-600">No requests yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-white">Projects</h1>
                  <p className="text-gray-500 text-sm">{projects.length} total</p>
                </div>
                <button id="add-project-btn" onClick={() => setModalData({})} className="btn-primary">
                  <Plus className="w-4 h-4" />Add Project
                </button>
              </div>

              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search projects…"
                  value={searchProject}
                  onChange={(e) => setSearchProject(e.target.value)}
                  className="input-field pl-9 py-2.5"
                />
              </div>

              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
                        <th className="text-left px-6 py-4">Project</th>
                        <th className="text-left px-6 py-4 hidden lg:table-cell">Category</th>
                        <th className="text-left px-6 py-4 hidden md:table-cell">Price</th>
                        <th className="text-left px-6 py-4">Status</th>
                        <th className="text-right px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((p) => (
                        <tr key={p._id} className="border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {p.featured && <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                              <span className="text-white font-medium">{p.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 hidden lg:table-cell">
                            {p.category?.icon} {p.category?.name}
                          </td>
                          <td className="px-6 py-4 text-brand-400 hidden md:table-cell">
                            {p.price > 0 ? `$${p.price.toLocaleString()}` : 'Custom'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`badge border text-xs ${
                              p.status === 'available' ? 'bg-green-950 text-green-400 border-green-800' :
                              'bg-gray-800 text-gray-400 border-gray-700'
                            }`}>{p.status}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <a href={`/projects/${p.slug}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
                                <Eye className="w-4 h-4" />
                              </a>
                              <button id={`edit-project-${p._id}`} onClick={() => setModalData(p)} className="p-2 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-gray-800 transition-colors">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button id={`delete-project-${p._id}`} onClick={() => handleDeleteProject(p._id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProjects.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-600">No projects found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-white">Client Requests</h1>
                <p className="text-gray-500 text-sm">{requests.length} total · {newRequestsCount} new</p>
              </div>

              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
                        <th className="text-left px-6 py-4">Client</th>
                        <th className="text-left px-6 py-4 hidden md:table-cell">Project Type</th>
                        <th className="text-left px-6 py-4 hidden lg:table-cell">Budget</th>
                        <th className="text-left px-6 py-4">Status</th>
                        <th className="text-left px-6 py-4 hidden xl:table-cell">Date</th>
                        <th className="text-right px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <tr key={req._id} className="border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">{req.name}</div>
                            <div className="text-gray-500 text-xs">{req.email}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 capitalize hidden md:table-cell">{req.projectType}</td>
                          <td className="px-6 py-4 text-brand-400 hidden lg:table-cell">{req.budget}</td>
                          <td className="px-6 py-4">
                            <select
                              value={req.status}
                              onChange={(e) => updateStatusMutation({ id: req._id, status: e.target.value })}
                              className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                            >
                              {['new', 'reviewed', 'contacted', 'closed'].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-xs hidden xl:table-cell">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <a href={`mailto:${req.email}?subject=Re: Your DevMarket Project Request`} className="p-2 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-gray-800 transition-colors">
                                <Mail className="w-4 h-4" />
                              </a>
                              <button id={`delete-request-${req._id}`} onClick={() => handleDeleteRequest(req._id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {requests.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-600">No requests yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Project Modal */}
      {modalData !== null && (
        <ProjectModal
          project={Object.keys(modalData).length > 0 ? modalData : null}
          categories={categories}
          onClose={() => setModalData(null)}
          onSave={handleSaveProject}
          loading={modalLoading}
        />
      )}
    </>
  );
}
