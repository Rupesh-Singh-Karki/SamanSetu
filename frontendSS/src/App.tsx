import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/pages/HomePage';
import Login from './components/pages/Login';
import Signup from './components/pages/SignUp';
import BuyerDashboard from './components/pages/BuyerDashboard';
import OwnerDashboard from './components/pages/OwnerDashboard';
import UnauthorisedPage from './components/pages/UnauthorisedPage';
import Header from './components/Header/Header';
import SearchPage from './components/pages/SearchPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<SearchPage />} />
              
              <Route path="/buyer/dashboard" element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/dashboard" element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/unauthorized" element={<UnauthorisedPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;