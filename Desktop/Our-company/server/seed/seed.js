require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const Category = require('../models/Category');
const Project = require('../models/Project');
const Admin = require('../models/Admin');

const categories = [
  { name: 'Web Development', icon: '🌐', description: 'Full-stack web applications, landing pages, e-commerce, and SaaS platforms.', color: 'blue' },
  { name: 'AI & Machine Learning', icon: '🤖', description: 'Custom AI models, chatbots, recommendation systems, and NLP applications.', color: 'purple' },
  { name: 'Data Science', icon: '📊', description: 'Data analysis, visualization dashboards, predictive analytics, and reporting.', color: 'green' },
  { name: 'Automation Tools', icon: '⚙️', description: 'Workflow automation, web scraping, bots, and process optimization scripts.', color: 'orange' },
  { name: 'Mobile Apps', icon: '📱', description: 'Cross-platform mobile apps for iOS and Android using React Native or Flutter.', color: 'pink' },
];

const adminData = {
  name: 'Admin',
  email: 'admin@devmarket.com',
  password: 'Admin@123',
};

const seed = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([Category.deleteMany(), Project.deleteMany(), Admin.deleteMany()]);
  console.log('✅ Cleared existing data');

  // Seed categories
  const createdCategories = await Category.insertMany(categories);
  const catMap = {};
  createdCategories.forEach(cat => { catMap[cat.name] = cat._id; });
  console.log('✅ Categories seeded');

  // Seed projects
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack online store with cart, payments (Stripe), admin panel, and inventory management.',
      longDescription: 'Complete e-commerce solution with product management, user authentication, shopping cart, Stripe payment gateway, order tracking, and an admin dashboard for inventory control. Built with React, Node.js, and MongoDB.',
      category: catMap['Web Development'],
      techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
      price: 799,
      priceLabel: 'Starting at $799',
      demoUrl: 'https://demo.devmarket.com',
      featured: true,
      status: 'available',
    },
    {
      title: 'SaaS Dashboard Template',
      description: 'Modern SaaS analytics dashboard with charts, user management, billing, and dark mode.',
      longDescription: 'Premium SaaS starter template with multi-tenant support, Recharts analytics, subscription billing with Stripe, role-based access control, and a responsive design system ready for production.',
      category: catMap['Web Development'],
      techStack: ['React', 'Express', 'PostgreSQL', 'Recharts', 'JWT'],
      price: 499,
      priceLabel: 'Starting at $499',
      demoUrl: 'https://demo.devmarket.com',
      featured: true,
      status: 'available',
    },
    {
      title: 'Restaurant Management System',
      description: 'Complete restaurant POS with table management, menu builder, order tracking, and reports.',
      longDescription: 'Full-featured restaurant management system with table booking, real-time order management, kitchen display, inventory tracking, and sales analytics. Includes both web and tablet interfaces.',
      category: catMap['Web Development'],
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'PDF Report'],
      price: 999,
      priceLabel: 'Starting at $999',
      featured: false,
      status: 'available',
    },
    {
      title: 'AI Chatbot Integration',
      description: 'Custom GPT-powered chatbot for your website with context memory, FAQs, and lead capture.',
      longDescription: 'Intelligent chatbot powered by OpenAI GPT-4, trained on your business data. Features conversation memory, escalation to human agents, lead capture forms, and analytics dashboard. Works with any website.',
      category: catMap['AI & Machine Learning'],
      techStack: ['Python', 'OpenAI API', 'LangChain', 'FastAPI', 'React'],
      price: 599,
      priceLabel: 'Starting at $599',
      featured: true,
      status: 'available',
    },
    {
      title: 'Sentiment Analysis Dashboard',
      description: 'Analyze customer reviews, tweets, and feedback with real-time NLP sentiment scoring.',
      longDescription: 'Real-time sentiment analysis platform that ingests data from Twitter, Amazon reviews, or custom CSV uploads. Uses BERT model for high accuracy scoring with interactive Plotly charts and exportable reports.',
      category: catMap['AI & Machine Learning'],
      techStack: ['Python', 'BERT', 'FastAPI', 'Plotly', 'PostgreSQL'],
      price: 449,
      priceLabel: 'Starting at $449',
      featured: false,
      status: 'available',
    },
    {
      title: 'Product Recommendation Engine',
      description: 'AI-powered recommendation system with collaborative filtering and real-time suggestions.',
      longDescription: 'Production-grade recommendation engine using collaborative and content-based filtering. Integrates with any e-commerce platform via REST API. Supports A/B testing, analytics, and Redis caching for low latency.',
      category: catMap['AI & Machine Learning'],
      techStack: ['Python', 'scikit-learn', 'FastAPI', 'Redis', 'Docker'],
      price: 699,
      priceLabel: 'Starting at $699',
      featured: false,
      status: 'available',
    },
    {
      title: 'Sales Analytics Dashboard',
      description: 'Interactive Power BI-style dashboard for visualizing sales KPIs, trends, and forecasts.',
      longDescription: 'Comprehensive sales analytics dashboard with interactive charts, date range filters, regional breakdowns, funnel analysis, and AI-powered sales forecasting using ARIMA models. Connects to Excel, Google Sheets, or any SQL database.',
      category: catMap['Data Science'],
      techStack: ['Python', 'Pandas', 'Plotly Dash', 'Scikit-learn', 'SQL'],
      price: 399,
      priceLabel: 'Starting at $399',
      featured: true,
      status: 'available',
    },
    {
      title: 'Customer Churn Predictor',
      description: 'ML model that predicts which customers are at risk of churning with 90%+ accuracy.',
      longDescription: 'End-to-end customer churn prediction system using XGBoost and feature engineering. Includes data pipeline, model training, REST API deployment, an explanation layer (SHAP), and a monitoring dashboard to track model drift.',
      category: catMap['Data Science'],
      techStack: ['Python', 'XGBoost', 'SHAP', 'FastAPI', 'Streamlit'],
      price: 549,
      priceLabel: 'Starting at $549',
      featured: false,
      status: 'available',
    },
    {
      title: 'Web Scraping & Data Pipeline',
      description: 'Automated web scraper with scheduled runs, proxy rotation, and structured data export.',
      longDescription: 'Highly configurable web scraping solution using Playwright and Scrapy. Supports JavaScript-heavy sites, CAPTCHA solving, proxy rotation, scheduled runs with Celery, and exports to CSV, JSON, or database. Includes a monitoring dashboard.',
      category: catMap['Automation Tools'],
      techStack: ['Python', 'Playwright', 'Scrapy', 'Celery', 'Redis'],
      price: 349,
      priceLabel: 'Starting at $349',
      featured: false,
      status: 'available',
    },
    {
      title: 'Business Workflow Automation',
      description: 'Automate your repetitive business processes—emails, reports, approvals—saving hours daily.',
      longDescription: 'Custom workflow automation connecting your tools (Gmail, Slack, Google Sheets, CRM) using n8n or custom scripts. Includes triggers, conditional logic, error alerts, and a monitoring panel. Custom integrations available.',
      category: catMap['Automation Tools'],
      techStack: ['Python', 'n8n', 'Zapier API', 'Google API', 'Slack API'],
      price: 299,
      priceLabel: 'Starting at $299',
      featured: true,
      status: 'available',
    },
    {
      title: 'Delivery Tracking App',
      description: 'Real-time delivery tracking mobile app with GPS, push notifications, and driver management.',
      longDescription: 'Cross-platform delivery tracking app for customers and drivers. Features real-time GPS tracking, push notifications, route optimization, proof of delivery (photo capture), and a web admin panel for dispatch management.',
      category: catMap['Mobile Apps'],
      techStack: ['React Native', 'Node.js', 'Socket.io', 'Google Maps', 'Firebase'],
      price: 1299,
      priceLabel: 'Starting at $1,299',
      featured: true,
      status: 'available',
    },
    {
      title: 'Fitness & Workout Tracker',
      description: 'Mobile app for tracking workouts, calories, progress charts, and custom exercise plans.',
      longDescription: 'Full-featured fitness app with workout logging, exercise library (300+ exercises), calorie tracking, progress charts, streak tracking, and AI-powered workout plan generator. Syncs with Apple Health and Google Fit.',
      category: catMap['Mobile Apps'],
      techStack: ['React Native', 'Expo', 'Node.js', 'MongoDB', 'TensorFlow Lite'],
      price: 899,
      priceLabel: 'Starting at $899',
      featured: false,
      status: 'available',
    },
  ];

  // Slugify workaround for seed — let Mongoose pre-save hook handle it
  for (const p of projects) {
    await Project.create(p);
  }
  console.log('✅ Projects seeded');

  // Seed admin
  await Admin.create(adminData);
  console.log('✅ Admin user created — email: admin@devmarket.com | password: Admin@123');

  console.log('\n🎉 Seed complete! Your DevMarket database is ready.\n');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
