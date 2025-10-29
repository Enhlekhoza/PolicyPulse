import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import LandingPage from './pages/LandingPage';
import PolicySimulator from './pages/PolicySimulator'; // Updated import
import PolicyComparison from './components/PolicyComparison';
import AuthPage from './pages/AuthPage';
import './App.css';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/auth" />;
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
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/simulator" element={
            <PrivateRoute>
              <div className="min-h-screen bg-gray-50">
                <PolicySimulator />
                <footer className="py-6 text-center text-sm text-gray-500 bg-white border-t">
                  <p>PolicyPulse - Making policy analysis accessible to everyone</p>
                  <p className="mt-1">© {new Date().getFullYear()} PolicyPulse. All rights reserved.</p>
                </footer>
              </div>
            </PrivateRoute>
          } />
          <Route path="/compare" element={
            <PrivateRoute>
              <div className="min-h-screen bg-gray-50">
                <PolicyComparison />
                <footer className="py-6 text-center text-sm text-gray-500 bg-white border-t">
                  <p>PolicyPulse - Making policy analysis accessible to everyone</p>
                  <p className="mt-1">© {new Date().getFullYear()} PolicyPulse. All rights reserved.</p>
                </footer>
              </div>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
