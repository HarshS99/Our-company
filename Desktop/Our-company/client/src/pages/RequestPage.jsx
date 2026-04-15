import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, submitRequest } from '../services/api';
import toast from 'react-hot-toast';
import { Send, CheckCircle, User, Mail, Phone, Briefcase, DollarSign, FileText, Loader2 } from 'lucide-react';

const budgetOptions = ['Under $300', '$300 - $500', '$500 - $1,000', '$1,000 - $3,000', '$3,000 - $10,000', '$10,000+', 'Discuss Budget'];

const initialForm = { name: '', email: '', phone: '', projectType: '', budget: '', description: '' };

export default function RequestPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ ...initialForm, projectType: searchParams.get('project') || '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const categories = categoriesData?.data?.data || [];

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.projectType) errs.projectType = 'Please select a project type';
    if (!form.budget) errs.budget = 'Please select a budget range';
    if (!form.description.trim()) errs.description = 'Description is required';
    else if (form.description.trim().length < 20) errs.description = 'Please provide more details (at least 20 characters)';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await submitRequest(form);
      setSubmitted(true);
      toast.success('Request submitted! We\'ll be in touch soon.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <>
      <Helmet><title>Request Submitted — DevMarket</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-950 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-800">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-3">Request Submitted!</h1>
          <p className="text-gray-400 mb-8">Thanks <strong className="text-white">{form.name}</strong>! We've received your project request and will get back to you within 24 hours at <strong className="text-brand-400">{form.email}</strong>.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/projects" className="btn-primary">Browse More Projects</Link>
            <button onClick={() => { setSubmitted(false); setForm(initialForm); }} className="btn-outline">Submit Another</button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Request a Project — DevMarket</title>
        <meta name="description" content="Submit your project request and get a custom software development proposal within 24 hours." />
      </Helmet>

      <div className="pt-24 min-h-screen pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="section-tag mx-auto w-fit mb-3"><Send className="w-3.5 h-3.5" />Start Your Project</div>
            <h1 className="font-display text-4xl font-bold text-white mb-3">Request a <span className="gradient-text">Project</span></h1>
            <p className="text-gray-400">Fill in the details below and we'll get back to you with a custom proposal within 24 hours.</p>
          </div>

          {/* Form */}
          <form id="project-request-form" onSubmit={handleSubmit} className="card p-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="w-3.5 h-3.5 inline mr-1.5" />Full Name *
              </label>
              <input id="req-name" name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} className={`input-field ${errors.name ? 'border-red-500 ring-red-500' : ''}`} />
              {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-3.5 h-3.5 inline mr-1.5" />Email *
                </label>
                <input id="req-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} className={`input-field ${errors.email ? 'border-red-500' : ''}`} />
                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="w-3.5 h-3.5 inline mr-1.5" />Phone (optional)
                </label>
                <input id="req-phone" name="phone" type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} className="input-field" />
              </div>
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Briefcase className="w-3.5 h-3.5 inline mr-1.5" />Project Type *
              </label>
              <select id="req-project-type" name="projectType" value={form.projectType} onChange={handleChange} className={`select-field ${errors.projectType ? 'border-red-500' : ''}`}>
                <option value="">Select a category…</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.icon} {cat.name}</option>
                ))}
                <option value="custom">🎯 Custom / Other</option>
              </select>
              {errors.projectType && <p className="text-red-400 text-xs mt-1.5">{errors.projectType}</p>}
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <DollarSign className="w-3.5 h-3.5 inline mr-1.5" />Budget Range *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {budgetOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    id={`budget-${opt.replace(/\s/g, '-')}`}
                    onClick={() => { setForm((f) => ({ ...f, budget: opt })); if (errors.budget) setErrors((e) => ({ ...e, budget: '' })); }}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      form.budget === opt
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {errors.budget && <p className="text-red-400 text-xs mt-1.5">{errors.budget}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FileText className="w-3.5 h-3.5 inline mr-1.5" />Project Description *
              </label>
              <textarea
                id="req-description"
                name="description"
                rows={5}
                placeholder="Describe your project, goals, features you need, timeline, and any specific requirements…"
                value={form.description}
                onChange={handleChange}
                className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? <p className="text-red-400 text-xs">{errors.description}</p> : <span />}
                <span className="text-gray-600 text-xs">{form.description.length}/2000</span>
              </div>
            </div>

            {/* Submit */}
            <button
              id="submit-request-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-base"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Submitting…' : 'Submit Request'}
            </button>

            <p className="text-center text-gray-600 text-xs">
              We'll respond within 24 hours · No spam, ever
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
