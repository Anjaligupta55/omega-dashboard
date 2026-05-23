import React, { useEffect, useState } from 'react';
import { Package, Star, DollarSign, Tag } from 'lucide-react';
import { productApi } from '../services/productApi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '../utils/formatters';

const COLORS = ['#4F46E5', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    avgRating: 0,
    inventoryValue: 0,
    totalCategories: 0,
  });
  const [categoryData, setCategoryData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await productApi.getProducts({ limit: 100 });
        const products = res.products;
        
        let invVal = 0;
        let totalRating = 0;
        const catCount = {};
        const ratCount = { '1-2': 0, '2-3': 0, '3-4': 0, '4-5': 0 };

        products.forEach(p => {
          invVal += (p.price * p.stock);
          totalRating += p.rating;
          
          catCount[p.category] = (catCount[p.category] || 0) + 1;
          
          if (p.rating >= 4) ratCount['4-5']++;
          else if (p.rating >= 3) ratCount['3-4']++;
          else if (p.rating >= 2) ratCount['2-3']++;
          else ratCount['1-2']++;
        });

        setStats({
          totalProducts: products.length,
          avgRating: products.length > 0 ? (totalRating / products.length) : 0,
          inventoryValue: invVal,
          totalCategories: Object.keys(catCount).length,
        });

        const cData = Object.entries(catCount)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); // top 5
        setCategoryData(cData);

        const rData = Object.entries(ratCount).map(([name, count]) => ({ name, count }));
        setRatingData(rData);

      } catch (error) {
        console.error("Dashboard data load error", error);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="flex-col gap-6">
      {/* Welcome Message */}
      <div className="animate-welcome" style={{ marginBottom: '8px' }}>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>
          {getGreeting()}, Anjali 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here is what's happening with your store today.</p>
      </div>

      {/* Hero Section */}
      <div className="card bg-accent flex-col justify-center" style={{ height: '180px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', right: '100px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-success bg-white text-success" style={{ backgroundColor: 'white', color: 'var(--success)' }}>Live Product API</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Product Management Dashboard</h2>
        <p style={{ opacity: 0.9 }}>Track products, inventory, ratings, and category insights in one place.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <StatCard 
          title="Total Products" 
          value={loading ? '-' : formatNumber(stats.totalProducts)} 
          icon={Package} 
          trend="+12% from last month" 
          color="#4F46E5" 
        />
        <StatCard 
          title="Average Rating" 
          value={loading ? '-' : stats.avgRating.toFixed(1)} 
          icon={Star} 
          trend="+0.2 points" 
          color="#F59E0B" 
        />
        <StatCard 
          title="Inventory Value" 
          value={loading ? '-' : formatCurrency(stats.inventoryValue)} 
          icon={DollarSign} 
          trend="Stable" 
          color="#22C55E" 
        />
        <StatCard 
          title="Total Categories" 
          value={loading ? '-' : stats.totalCategories} 
          icon={Tag} 
          trend="2 new added" 
          color="#06B6D4" 
        />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ padding: '24px', height: '360px' }}>
          <h3 className="font-semibold mb-4">Top Categories</h3>
          {loading ? <div className="flex h-full items-center justify-center">Loading...</div> : (
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card" style={{ padding: '24px', height: '360px' }}>
          <h3 className="font-semibold mb-4">Rating Distribution</h3>
          {loading ? <div className="flex h-full items-center justify-center">Loading...</div> : (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip cursor={{fill: 'var(--sidebar-hover-bg)'}} contentStyle={{backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)'}} />
                <Bar dataKey="count" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="card flex-col justify-between" style={{ padding: '24px', height: '130px' }}>
    <div className="flex items-center justify-between">
      <span className="text-secondary font-medium">{title}</span>
      <div className="btn-icon" style={{ backgroundColor: `${color}20`, color }}>
        <Icon size={20} />
      </div>
    </div>
    <div>
      <h3 style={{ fontSize: '24px', fontWeight: 700 }}>{value}</h3>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{trend}</span>
    </div>
  </div>
);

export default Dashboard;
