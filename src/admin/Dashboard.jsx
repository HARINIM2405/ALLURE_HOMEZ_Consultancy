import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import {
  People, Group, Inventory2, ContactSupport
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalClients: 0,
    activeWorkers: 0,
    totalStockItems: 0,
    pendingEnquiries: 0,
    enquiryStatus: [], // used in the chart
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/summary');
        const data = await res.json();
        if (res.ok) {
          setSummary({
            totalClients: data.totalClients,
            activeWorkers: data.activeWorkers,
            totalStockItems: data.totalStockItems,
            pendingEnquiries: data.pendingEnquiries,
            enquiryStatus: data.enquiryStatus || [],
          });
        } else {
          console.error('Failed to fetch summary:', data.message);
        }
      } catch (err) {
        console.error('Error fetching summary:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const enquiryStatus = summary.enquiryStatus;

  const summaryData = [
    {
      label: 'Total Clients',
      value: summary.totalClients,
      
      icon: <People className="icon purple" />,
      color: 'green',
    },
    {
      label: 'Active Workers',
      value: summary.activeWorkers,
     
      icon: <Group className="icon blue" />,
      color: 'green',
    },
    {
      label: 'Stock Items',
      value: summary.totalStockItems,
      
      icon: <Inventory2 className="icon red" />,
      color: 'red',
    },
    {
      label: 'Pending Enquiries',
      value: summary.pendingEnquiries,
     
      icon: <ContactSupport className="icon yellow" />,
      color: 'green',
    },
  ];

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p className="subtitle">Overview of your business metrics</p>

      <Grid container spacing={2}>
        {summaryData.map((item, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <Card className="summary-card">
              <CardContent>
                <div className="card-header">
                  <Typography variant="subtitle2">{item.label}</Typography>
                  {item.icon}
                </div>
                <Typography variant="h5" className="value">
                  {loading ? '...' : item.value}
                </Typography>
                
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Enquiries Status Chart Only */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Enquiries Status</Typography>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enquiryStatus} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="status" tick={{ fontSize: 14 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FBBF24" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
