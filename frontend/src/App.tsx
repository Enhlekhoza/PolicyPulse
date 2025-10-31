import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import LandingPage from './pages/LandingPage';
import PolicySimulator from './pages/PolicySimulator';
import PolicyComparison from './components/PolicyComparison';
import PolicyDashboard from './components/PolicyDashboard';
import AppLayout from './components/Layout/AppLayout';
import PolicyGlobe from './components/PolicyGlobe/PolicyGlobe';
import AIPolicyAdvisor from './components/AIPolicyAdvisor/AIPolicyAdvisor';
import LiveEconomicFeed from './components/LiveEconomicFeed/LiveEconomicFeed';
import Gamification from './components/Gamification/Gamification';
import './App.css';

// Mock data for PolicyGlobe props
const mockGlobeProps = {
  policyImpact: {
    region: 'global',
    impactScore: 0.75,
    confidence: 0.85,
    metrics: {
      gdp: 2.5,
      employment: 1.2,
      environment: -0.8,
    },
  },
  onRegionSelect: (region: string) => {
    console.log('Selected region:', region);
  },
};

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppLayout><Outlet /></AppLayout>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PolicyDashboard />} />
            <Route path="simulator" element={<PolicySimulator />} />
            <Route path="impact" element={<PolicyComparison />} />
            <Route path="globe" element={<PolicyGlobe {...mockGlobeProps} />} />
            <Route path="advisor" element={<AIPolicyAdvisor />} />
            <Route path="feed" element={<LiveEconomicFeed />} />
            <Route path="gamification" element={<Gamification />} />
            <Route path="community" element={<div>Community Page</div>} />
            <Route path="settings" element={<div>Settings Page</div>} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <footer className="py-6 text-center text-sm text-gray-500 bg-white border-t">
          <p>PolicyPulse - Making policy analysis accessible to everyone</p>
          <p className="mt-1">© {new Date().getFullYear()} PolicyPulse. All rights reserved.</p>
        </footer>
      </Router>
    </ConfigProvider>
  );
}

export default App;
