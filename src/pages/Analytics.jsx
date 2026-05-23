import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { productApi } from '../services/productApi';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { 
  TrendingUp, Users, DollarSign, Percent, Archive, 
  Sparkles, Calendar, Download, Share2, FileText, ArrowUpRight, 
  Activity, Star, Terminal
} from 'lucide-react';
import { motion } from 'framer-motion';

const PIE_COLORS = ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 128430,
    activeUsers: 14892,
    conversionRate: 2.84,
    inventoryValue: 0,
    totalProducts: 0,
    categoriesCount: 0,
  });
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [activities, setActivities] = useState([]);
  const [actionToast, setActionToast] = useState(null);
  const [exportingReport, setExportingReport] = useState(false);

  // Fetch API products and format stats/charts
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await productApi.getProducts({ limit: 100 });
        const products = res.products || [];

        // 1. Calculate inventory values
        let invValue = 0;
        const categoryMap = {};

        products.forEach(p => {
          invValue += (p.price * (p.stock || 10));
          categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
        });

        // 2. Format Category Distribution (Pie Chart)
        const catDist = Object.entries(categoryMap).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
          value
        })).sort((a, b) => b.value - a.value).slice(0, 5);

        // 3. Format Top Performing Categories (Bar Chart)
        const topCats = Object.entries(categoryMap).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
          products: value,
          revenue: Math.floor(value * 3150) // Mock sales revenue per category
        })).sort((a, b) => b.revenue - a.revenue).slice(0, 6);

        // 4. Generate mock Traffic/Sales Trend (Area Chart)
        const mockTrend = Array.from({ length: 12 }, (_, i) => {
          const day = i + 1;
          const traffic = Math.floor(Math.random() * 500) + 400 + (i * 20);
          const sales = Math.floor(traffic * (Math.random() * 0.1 + 0.08));
          return {
            name: `Day ${day}`,
            traffic,
            sales: Math.floor(sales * 32)
          };
        });

        // 5. Generate mock Revenue Overview projection (Line Chart)
        const mockRevenueOverview = [
          { month: 'Jan', revenue: 95000, target: 90000 },
          { month: 'Feb', revenue: 102000, target: 95000 },
          { month: 'Mar', revenue: 108000, target: 100000 },
          { month: 'Apr', revenue: 115000, target: 110000 },
          { month: 'May', revenue: 128430, target: 120000 },
          { month: 'Jun', revenue: 135000, target: 128000 },
        ];

        // 6. Generate mock Activity Feed
        const activityList = [
          { id: 1, title: 'Product stock updated', desc: `${products[0]?.title || 'Product'} inventory increased to 45 units`, time: '5 mins ago', type: 'inventory', color: 'var(--accent-primary)' },
          { id: 2, title: 'New category added', desc: 'Added category "premium-electronics" to store list', time: '1 hour ago', type: 'category', color: '#10B981' },
          { id: 3, title: 'Revenue target met', desc: 'Hourly revenue exceeded normal baseline by 18%', time: '2 hours ago', type: 'revenue', color: '#F59E0B' },
          { id: 4, title: 'Product rating changed', desc: `${products[3]?.title || 'Product'} rating increased to 4.8★`, time: '4 hours ago', type: 'rating', color: '#8B5CF6' },
          { id: 5, title: 'User session logged', desc: 'Anjali Gupta logged into workspace from desktop', time: '6 hours ago', type: 'user', color: '#64748B' }
        ];

        setStats(prev => ({
          ...prev,
          inventoryValue: invValue,
          totalProducts: products.length,
          categoriesCount: Object.keys(categoryMap).length
        }));
        setData(mockTrend);
        setCategoryDistribution(catDist);
        setTopCategories(topCats);
        setRevenueTrend(mockRevenueOverview);
        setActivities(activityList);

      } catch (err) {
        console.error("Error generating analytics data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const showToast = useCallback((message) => {
    setActionToast(message);
    setTimeout(() => {
      setActionToast(null);
    }, 3000);
  }, []);

  const handleExportCSV = useCallback(() => {
    if (data.length === 0) return;
    const headers = 'Day,Traffic Views,Sales Revenue ($)\n';
    const csvRows = data.map(d => `${d.name},${d.traffic},${d.sales}`).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + csvRows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "alpha_dashboard_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV Exported successfully!");
  }, [data, showToast]);

  // Listen for CSV export events from command palette
  useEffect(() => {
    window.addEventListener('trigger-csv-export', handleExportCSV);
    return () => window.removeEventListener('trigger-csv-export', handleExportCSV);
  }, [handleExportCSV]);

  const handleDownloadReport = () => {
    setExportingReport(true);
    setTimeout(() => {
      setExportingReport(false);
      window.print();
      showToast("Report download triggered!");
    }, 1500);
  };

  const handleShareDashboard = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Shareable link copied to clipboard!");
  };

  // Sparkline data generation
  const revenueSparkline = useMemo(() => [
    { value: 110 }, { value: 115 }, { value: 108 }, { value: 120 }, { value: 118 }, { value: 124 }, { value: 128 }
  ], []);
  const usersSparkline = useMemo(() => [
    { value: 14.1 }, { value: 14.3 }, { value: 14.2 }, { value: 14.6 }, { value: 14.5 }, { value: 14.7 }, { value: 14.8 }
  ], []);
  const conversionSparkline = useMemo(() => [
    { value: 2.4 }, { value: 2.6 }, { value: 2.5 }, { value: 2.7 }, { value: 2.6 }, { value: 2.8 }, { value: 2.84 }
  ], []);
  const inventorySparkline = useMemo(() => [
    { value: 40 }, { value: 41 }, { value: 43 }, { value: 42 }, { value: 45 }, { value: 43 }, { value: 42.8 }
  ], []);

  // AI Insights
  const insights = [
    {
      id: 1,
      title: "Category Boost",
      text: "Beauty products are performing 18% better than the weekly average baseline.",
      type: "success",
      icon: Sparkles,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.08)"
    },
    {
      id: 2,
      title: "Inventory Warning",
      text: "Smartphones & Fragrances are running low in stock. Restock suggested.",
      type: "warning",
      icon: Archive,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.08)"
    },
    {
      id: 3,
      title: "Average Ratings",
      text: "User reviews increased average products rating by 6.4% to a record 4.6★.",
      type: "info",
      icon: Star,
      color: "#4F46E5",
      bgColor: "rgba(79, 70, 229, 0.08)"
    }
  ];

  if (loading) {
    return (
      <div className="flex-col gap-6 w-full h-full p-4">
        {/* Skeleton Banner */}
        <div className="shimmer" style={{ height: '180px', borderRadius: '28px', marginBottom: '24px' }}></div>
        
        {/* Skeleton Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="shimmer" style={{ height: '150px', borderRadius: '24px' }}></div>
          ))}
        </div>

        {/* Skeleton Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          <div className="shimmer" style={{ height: '380px', borderRadius: '24px' }}></div>
          <div className="shimmer" style={{ height: '380px', borderRadius: '24px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex-col gap-6"
    >
      {/* Toast Notification */}
      {actionToast && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--card-bg)',
            border: '2px solid var(--accent-primary)',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)',
            padding: '14px 20px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 99999,
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div style={{ backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--accent-primary)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}>
            <Sparkles size={16} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{actionToast}</span>
        </div>
      )}

      {/* PDF Export Overlay */}
      {exportingReport && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            zIndex: 99999
          }}
        >
          <div style={{ position: 'relative', width: '60px', height: '60px' }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '4px solid var(--border-color)',
              borderTopColor: 'var(--accent-primary)',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>Preparing PDF Report...</span>
        </div>
      )}

      {/* Welcome Hero Banner */}
      <div 
        className="card-premium" 
        style={{ 
          padding: '28px 32px', 
          position: 'relative', 
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '8px',
          flexWrap: 'wrap',
          background: 'var(--card-bg-glass)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)'
        }}
      >
        {/* Soft background glow */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, rgba(79, 70, 229, 0) 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '10px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, rgba(59, 130, 246, 0) 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        
        {/* Left Side: Info */}
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            System Telemetry & Insights
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', maxWidth: '520px', margin: 0 }}>
            Real-time analytics engine tracking catalog metrics, product inventory valuation, and sales conversion projections.
          </p>
        </div>

        {/* Right Side: Micro Metrics */}
        <div 
          style={{ 
            flex: '1 1 280px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            gap: '24px', 
            position: 'relative',
            zIndex: 1
          }}
          className="telemetry-metrics"
        >
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Database</span>
            <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', marginBottom: 0 }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span> Connected
            </h4>
          </div>
          
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Uptime</span>
            <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600, marginTop: '6px', marginBottom: 0 }}>
              99.98%
            </h4>
          </div>
          
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Latency</span>
            <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600, marginTop: '6px', marginBottom: 0 }}>
              14ms
            </h4>
          </div>
        </div>
      </div>

      {/* Header Actions Panel */}
      <div className="flex justify-between items-center w-full" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} /> Report Period: Last 30 Days (Real-time updates)
          </span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV} 
            className="btn btn-outline btn-sm card-premium glow-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)', color: 'var(--text-primary)', backgroundColor: 'var(--card-bg)' }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={handleDownloadReport} 
            className="btn btn-outline btn-sm card-premium glow-purple"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)', color: 'var(--text-primary)', backgroundColor: 'var(--card-bg)' }}
          >
            <FileText size={14} /> Download PDF
          </button>
          <button 
            onClick={handleShareDashboard} 
            className="btn btn-primary btn-sm glow-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', backgroundColor: 'var(--accent-primary)', color: '#ffffff' }}
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards (4 Columns Grid) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '24px' 
        }}
      >
        {/* Card 1: Total Revenue */}
        <div className="card-premium flex-col justify-between" style={{ padding: '24px', height: '150px', display: 'flex' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Revenue</span>
            <div className="btn-icon" style={{ backgroundColor: 'rgba(79, 70, 229, 0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '12px' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between" style={{ marginTop: '16px' }}>
            <div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {formatCurrency(stats.totalRevenue)}
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
                <TrendingUp size={12} /> +14.2% <span style={{ color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '2px' }}>vs last month</span>
              </span>
            </div>
            
            {/* Sparkline mini-graph */}
            <div style={{ width: '90px', height: '40px', opacity: 0.8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSparkline}>
                  <defs>
                    <linearGradient id="sparklineRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" fill="url(#sparklineRev)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 2: Active Users */}
        <div className="card-premium flex-col justify-between" style={{ padding: '24px', height: '150px', display: 'flex' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Active Users</span>
            <div className="btn-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '12px' }}>
              <Users size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between" style={{ marginTop: '16px' }}>
            <div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {formatNumber(stats.activeUsers)}
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
                <TrendingUp size={12} /> +8.4% <span style={{ color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '2px' }}>vs last week</span>
              </span>
            </div>
            
            {/* Sparkline mini-graph */}
            <div style={{ width: '90px', height: '40px', opacity: 0.8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usersSparkline}>
                  <defs>
                    <linearGradient id="sparklineUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="url(#sparklineUsers)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 3: Conversion Rate */}
        <div className="card-premium flex-col justify-between" style={{ padding: '24px', height: '150px', display: 'flex' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Conversion Rate</span>
            <div className="btn-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '12px' }}>
              <Percent size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between" style={{ marginTop: '16px' }}>
            <div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {stats.conversionRate}%
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
                <TrendingUp size={12} /> +0.5% <span style={{ color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '2px' }}>vs last week</span>
              </span>
            </div>
            
            {/* Sparkline mini-graph */}
            <div style={{ width: '90px', height: '40px', opacity: 0.8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={conversionSparkline}>
                  <defs>
                    <linearGradient id="sparklineConv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#sparklineConv)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 4: Inventory Value */}
        <div className="card-premium flex-col justify-between" style={{ padding: '24px', height: '150px', display: 'flex' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Inventory Value</span>
            <div className="btn-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '12px' }}>
              <Archive size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between" style={{ marginTop: '16px' }}>
            <div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {formatCurrency(stats.inventoryValue)}
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
                Stable ({stats.totalProducts} active SKUs)
              </span>
            </div>
            
            {/* Sparkline mini-graph */}
            <div style={{ width: '90px', height: '40px', opacity: 0.8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={inventorySparkline}>
                  <defs>
                    <linearGradient id="sparklineInv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="url(#sparklineInv)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* AI Smart Insights Section */}
      <div className="flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <h4 className="font-bold text-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>AI-Driven Dashboard Insights</h4>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {insights.map(ins => {
            const Icon = ins.icon;
            return (
              <div 
                key={ins.id} 
                className="card-premium flex gap-4 items-start" 
                style={{ 
                  padding: '16px 20px', 
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  display: 'flex'
                }}
              >
                <div style={{ padding: '10px', borderRadius: '14px', backgroundColor: ins.bgColor, color: ins.color, display: 'flex', flexShrink: 0 }}>
                  <Icon size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h5 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{ins.title}</h5>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{ins.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Panels & Activities */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '24px' 
        }}
      >
        {/* Chart A: Traffic & Sales Trend (Area Chart) */}
        <div className="card-premium" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Traffic & Sales Trend</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Views vs Sales Revenue generated daily</p>
            </div>
            <div className="badge badge-primary">Daily Metrics</div>
          </div>
          <div style={{ flex: 1, width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 10}} />
                <Tooltip contentStyle={{backgroundColor: 'var(--card-bg)', borderRadius: '12px', borderColor: 'var(--border-color)', color: 'var(--text-primary)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'}} />
                <Area type="monotone" name="Traffic (Views)" dataKey="traffic" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={2} />
                <Area type="monotone" name="Revenue ($)" dataKey="sales" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Category Distribution (Pie Chart) */}
        <div className="card-premium" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Category Share</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Distribution of product items in catalog</p>
            </div>
            <div className="badge badge-secondary">Stock Allocation</div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie 
                  data={categoryDistribution} 
                  cx="50%" 
                  cy="45%" 
                  innerRadius={65} 
                  outerRadius={95} 
                  paddingAngle={4} 
                  dataKey="value"
                  label={({name}) => name.split(' ')[0]}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: 'var(--card-bg)', borderRadius: '12px', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={10} wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '24px' 
        }}
      >
        {/* Chart C: Top Performing Categories (Bar Chart) */}
        <div className="card-premium" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Revenue by Category</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Revenue performance breakdown across categories</p>
            </div>
            <div className="badge badge-success">Top Sales</div>
          </div>
          <div style={{ flex: 1, width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={topCategories}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 10}} />
                <Tooltip cursor={{fill: 'var(--sidebar-hover-bg)'}} contentStyle={{backgroundColor: 'var(--card-bg)', borderRadius: '12px', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}} />
                <Bar name="Sales Revenue ($)" dataKey="revenue" fill="var(--accent-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart D: Revenue Overview Projection (Line Chart) */}
        <div className="card-premium" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Revenue Projection</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Revenue growth trend versus projection targets</p>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Targets Met</span>
          </div>
          <div style={{ flex: 1, width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 10}} />
                <Tooltip contentStyle={{backgroundColor: 'var(--card-bg)', borderRadius: '12px', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" name="Actual Revenue" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 4 }} />
                <Line type="monotone" name="Target Target" dataKey="target" stroke="var(--text-secondary)" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity and Command Palette Help Section */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
          gap: '24px',
          marginBottom: '24px'
        }}
      >
        {/* Recent Activity Feed */}
        <div className="card-premium" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '380px' }}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-secondary" />
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Live Activity Log</h3>
            </div>
            <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', backgroundColor: 'var(--border-color)', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Real-time Feed</span>
          </div>
          
          <div 
            style={{ 
              flex: 1, 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px' 
            }} 
            className="scrollbar-thin"
          >
            {activities.map((act) => (
              <div 
                key={act.id} 
                className="flex items-start gap-3" 
                style={{ 
                  padding: '10px 12px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-color)'
                }}
              >
                <div 
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: act.color, 
                    marginTop: '6px', 
                    boxShadow: `0 0 6px ${act.color}`,
                    flexShrink: 0 
                  }} 
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-xs text-primary" style={{ color: 'var(--text-primary)' }}>{act.title}</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{act.time}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Command Palette Keyboard Guide & Shortcut Widget */}
        <div 
          className="card-premium" 
          style={{ 
            padding: '32px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center',
            height: '380px',
            background: 'linear-gradient(180deg, var(--card-bg) 0%, var(--bg-color) 100%)',
            position: 'relative'
          }}
        >
          {/* Glowing subtle ring */}
          <div style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '50%', border: '1px solid var(--border-color)', opacity: 0.3, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: '180px', height: '180px', borderRadius: '50%', border: '1px dotted var(--text-secondary)', opacity: 0.15, pointerEvents: 'none' }} />
          
          <div 
            style={{ 
              backgroundColor: 'rgba(79, 70, 229, 0.08)', 
              color: 'var(--accent-primary)', 
              width: '54px', 
              height: '54px', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '20px'
            }}
          >
            <Terminal size={24} />
          </div>

          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Command Palette Shortcut
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '280px', lineHeight: '1.5', marginBottom: '24px' }}>
            Press <kbd style={{ padding: '2px 6px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--card-bg)', fontSize: '11px', fontWeight: 'bold' }}>Ctrl + K</kbd> to launch the command menu. Search pages, run actions, or query live items.
          </p>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            className="btn btn-primary btn-md glow-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px 20px', borderRadius: '12px', backgroundColor: 'var(--accent-primary)', color: '#fff', fontSize: '13px', fontWeight: 600 }}
          >
            Open Palette <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        kbd {
          font-family: inherit;
          box-shadow: 0 1px 0 rgba(0,0,0,0.1);
        }
      `}} />
    </motion.div>
  );
};

export default Analytics;
