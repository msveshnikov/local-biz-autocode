import { useEffect, useState } from 'react';
import { useTheme } from '../../App';
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
import { useCampaign } from '../../context/CampaignContext';
import { professionThemes } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label, explanation }) => {
    if (!active || !payload) return null;
    return (
        <div
            style={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{label}</p>
            <p style={{ margin: '0 0 5px 0' }}>
                {payload[0].name}: {payload[0].value}
            </p>
            <p style={{ fontSize: '0.8em', color: '#666', margin: 0 }}>{explanation}</p>
        </div>
    );
};

const Dashboard = () => {
    const { theme: profession } = useTheme();
    const { roiPrediction } = useCampaign();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const theme = professionThemes[profession] || professionThemes.plumbing;
    const primaryColor = theme.colors.primary;

    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                const mockData = {
                    roi: [
                        { month: 'Jan', value: 65 },
                        { month: 'Feb', value: 75 },
                        { month: 'Mar', value: roiPrediction || 85 }
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
    }, [roiPrediction]);

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
                                <Tooltip
                                    content={
                                        <CustomTooltip explanation="Return on Investment percentage based on campaign performance" />
                                    }
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={primaryColor}
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
                                <Tooltip
                                    content={
                                        <CustomTooltip explanation="Breakdown of lead generation by acquisition source" />
                                    }
                                />
                                <Bar dataKey="count" fill={primaryColor} />
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
                                <Tooltip
                                    content={
                                        <CustomTooltip explanation="Comparison of marketing costs against generated revenue" />
                                    }
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    fill={primaryColor}
                                    stroke={primaryColor}
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

export default Dashboard;
