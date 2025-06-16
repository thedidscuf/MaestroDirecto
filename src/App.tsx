import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ProfessionalDetail from './pages/ProfessionalDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import Dashboard from './pages/Dashboard';
import HowItWorks from './pages/HowItWorks';
import ForProfessionals from './pages/ForProfessionals';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Routes>
            {/* Routes with Header and Footer */}
            <Route path="/" element={
              <>
                <Header />
                <main className="flex-1">
                  <Home />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/buscar" element={
              <>
                <Header />
                <main className="flex-1">
                  <SearchResults />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/profesional/:id" element={
              <>
                <Header />
                <main className="flex-1">
                  <ProfessionalDetail />
                </main>
                <Footer />
              </>
            } />

            <Route path="/como-funciona" element={
              <>
                <Header />
                <main className="flex-1">
                  <HowItWorks />
                </main>
                <Footer />
              </>
            } />

            <Route path="/para-profesionales" element={
              <>
                <Header />
                <main className="flex-1">
                  <ForProfessionals />
                </main>
                <Footer />
              </>
            } />

            {/* Auth Routes without Header and Footer */}
            <Route path="/registro" element={<Register />} />
            <Route path="/registro-profesional" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;