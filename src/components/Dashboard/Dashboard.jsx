import React, { useEffect, useState, Suspense } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import PropTypes from 'prop-types';
import './Dashboard.css';

const Dashboard = ({ profession }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulated API call
                await new Promise((resolve) => setTimeout(resolve, 1500));
                const mockData = {
                    roi: [
                        { month: 'Jan', value: 65 },
                        { month: 'Feb', value: 75 },
                        { month: 'Mar', value: 85 }
                    ],
                    leads: [
                        { source: 'Web', count: 45 },
                        { source: 'Social', count: 30 },
                        { source: 'Direct', count: 25 }
                    ],
                    financials: [
                        { week: 'W1', cost: 2400, revenue: 4000 },
                        { week: 'W2', cost: 2100, revenue: 3800 },
                        { week: 'W3', cost: 2600, revenue: 4300 }
                    ]
                };
                setDashboardData(mockData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getProfessionColor = () => {
        const colors = {
            plumber: '#4A90E2',
            lawyer: '#8B5CF6',
            doctor: '#10B981'
        };
        return colors[profession] || '#4A90E2';
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">
                {profession.charAt(0).toUpperCase() + profession.slice(1)} Performance Dashboard
            </h2>

            <div className="metrics-grid">
                <div className="metric-card">
                    <h3>ROI Trend</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dashboardData.roi}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={getProfessionColor()}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="metric-card">
                    <h3>Lead Sources</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dashboardData.leads}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="source" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill={getProfessionColor()} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="metric-card">
                    <h3>Cost vs Revenue</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={dashboardData.financials}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    fill={getProfessionColor()}
                                    stroke={getProfessionColor()}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="cost"
                                    fill="#FF6B6B"
                                    stroke="#FF6B6B"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

Dashboard.propTypes = {
    profession: PropTypes.oneOf(['plumber', 'lawyer', 'doctor']).isRequired
};

export default Dashboard;
