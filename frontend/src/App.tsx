import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import LandingPage from './pages/LandingPage';
import PolicySimulator from './components/PolicySimulator';
import './App.css';

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
          <Route path="/simulator" element={
            <div className="min-h-screen bg-gray-50">
              <PolicySimulator />
              <footer className="py-6 text-center text-sm text-gray-500 bg-white border-t">
                <p>PolicyPulse - Making policy analysis accessible to everyone</p>
                <p className="mt-1">© {new Date().getFullYear()} PolicyPulse. All rights reserved.</p>
              </footer>
            </div>
          } />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
