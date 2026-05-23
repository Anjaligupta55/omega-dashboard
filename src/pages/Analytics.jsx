import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { productApi } from '../services/productApi';

export const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await productApi.getProducts({ limit: 100 });
        // Mocking some time-series data using product limits
        const mockTimeSeries = res.products.slice(0, 20).map((p, i) => ({
          name: `Day ${i + 1}`,
          views: Math.floor(Math.random() * 500) + 100,
          sales: Math.floor(Math.random() * 50) + 10,
        }));
        setData(mockTimeSeries);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="flex-col gap-6">
      <div className="page-header mb-2">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Visual insights from product inventory and category performance.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '24px', height: '400px' }}>
        <h3 className="font-semibold mb-4">Traffic & Sales Trend</h3>
        {loading ? <div className="flex h-full items-center justify-center">Loading...</div> : (
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
              <Tooltip contentStyle={{backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}} />
              <Area type="monotone" dataKey="views" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="sales" stroke="var(--success)" fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Analytics;
