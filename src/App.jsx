import { createContext, useState, useContext, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CampaignProvider } from './context/CampaignContext';
import { useTheme as useProfessionTheme } from './utils/theme';

const ThemeContext = createContext();

const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const CampaignBuilder = lazy(() => import('./components/CampaignBuilder/CampaignBuilder'));
const Templates = lazy(() => import('./components/Templates/Templates'));
const Reviews = lazy(() => import('./components/Reviews/Reviews'));

export function useTheme() {
    return useContext(ThemeContext);
}

function Navigation() {
    const { profession } = useTheme();
    const theme = useProfessionTheme(profession);

    return (
        <nav className={`navbar ${profession}`} style={{ backgroundColor: theme.colors.primary }}>
            <div className="container">
                <Link to="/" className="brand" style={{ color: theme.colors.background }}>
                    MarketingPlatform
                </Link>
                <div className="nav-links">
                    <Link to="/dashboard" style={{ color: theme.colors.background }}>
                        Analytics
                    </Link>
                    <Link to="/templates" style={{ color: theme.colors.background }}>
                        Templates
                    </Link>
                    <Link to="/campaign" style={{ color: theme.colors.background }}>
                        Campaign Wizard
                    </Link>
                    <Link to="/reviews" style={{ color: theme.colors.background }}>
                        Reviews
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function HomeHero() {
    const { profession } = useTheme();
    const theme = useProfessionTheme(profession);
    const ctaMap = {
        legal: 'Schedule Consultation',
        medical: 'Book Appointment',
        plumbing: 'Call Now',
        default: 'Get Started'
    };

    return (
        <section className="hero" style={{ backgroundColor: theme.colors.background }}>
            <h1 style={{ color: theme.colors.primary }}>Boost Your Local Business ROI</h1>
            <p style={{ color: theme.colors.text }}>
                Professional marketing solutions for service providers
            </p>
            <Link
                to="/campaign"
                style={{
                    backgroundColor: theme.colors.accent,
                    color: theme.colors.text,
                    padding: '12px 24px',
                    borderRadius: '4px',
                    textDecoration: 'none'
                }}
            >
                {ctaMap[profession] || ctaMap.default}
            </Link>
        </section>
    );
}

function App() {
    const [profession, setProfession] = useState('default');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
    }, [darkMode]);

    return (
        <CampaignProvider>
            <ThemeContext.Provider value={{ profession, setProfession, darkMode, setDarkMode }}>
                <BrowserRouter>
                    <div className="app-container">
                        <Navigation />
                        <main className="main-content">
                            <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
                                <Routes>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/templates" element={<Templates />} />
                                    <Route path="/campaign" element={<CampaignBuilder />} />
                                    <Route path="/reviews" element={<Reviews />} />
                                    <Route path="/" element={<HomeHero />} />
                                </Routes>
                            </Suspense>
                        </main>
                        <footer
                            className="app-footer"
                            style={useProfessionTheme(profession).colors}
                        >
                            <div className="container">
                                <p>© 2024 MarketingPlatform. All rights reserved.</p>
                                <div className="footer-links">
                                    <Link to="/privacy">Privacy Policy</Link>
                                    <Link to="/terms">Terms of Service</Link>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </div>
                </BrowserRouter>
            </ThemeContext.Provider>
        </CampaignProvider>
    );
}

export default App;