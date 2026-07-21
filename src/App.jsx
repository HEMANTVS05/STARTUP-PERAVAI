import React from 'react';
import MainLayout from './components/MainLayout';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="relative w-full min-h-screen bg-grid-pattern overflow-x-hidden">
        <MainLayout />
      </div>
    </AuthProvider>
  );
}

export default App;
