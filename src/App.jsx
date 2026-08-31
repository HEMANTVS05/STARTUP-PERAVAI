import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import EventsPage from './components/EventsPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative w-full min-h-screen bg-grid-pattern overflow-x-hidden">
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/events" element={<EventsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
