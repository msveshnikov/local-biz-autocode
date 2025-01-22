import { createContext, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CampaignProvider } from './context/CampaignContext';
import Dashboard from './components/Dashboard/Dashboard';
import CampaignBuilder from './components/CampaignBuilder/CampaignBuilder';
import Templates from './components/Templates/Templates';

const ThemeContext = createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

function Navigation() {
    const { profession } = useTheme();

    return (
        <nav className={`navbar ${profession}`}>
            <div className="container">
                <Link to="/" className="brand">
                    MarketingPlatform
                </Link>
                <div className="nav-links">
                    <Link to="/dashboard">Analytics</Link>
                    <Link to="/templates">Templates</Link>
                    <Link to="/campaign">Campaign Wizard</Link>
                </div>
            </div>
        </nav>
    );
}

function App() {
    const [profession, setProfession] = useState('default');

    return (
        <CampaignProvider>
            <ThemeContext.Provider value={{ profession, setProfession }}>
                <BrowserRouter>
                    <div className="app-container">
                        <Navigation />

                        <main className="main-content">
                            <Routes>
                                <Route
                                    path="/dashboard"
                                    element={<Dashboard profession={profession} />}
                                />
                                <Route
                                    path="/templates"
                                    element={<Templates profession={profession} />}
                                />
                                <Route path="/campaign" element={<CampaignBuilder />} />
                                <Route
                                    path="/"
                                    element={
                                        <section className="hero">
                                            <h1>Boost Your Local Business ROI</h1>
                                            <p>
                                                Professional marketing solutions for service
                                                providers
                                            </p>
                                        </section>
                                    }
                                />
                            </Routes>
                        </main>

                        <footer className="app-footer">
                            <div className="container">
                                <p>© 2024 MarketingPlatform. All rights reserved.</p>
                                <div className="footer-links">
                                    <Link to="/privacy">Privacy Policy</Link>
                                    <Link to="/terms">Terms of Service</Link>
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
