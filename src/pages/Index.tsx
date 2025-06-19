
import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import LoginForm from '@/components/LoginForm';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm border-white/50 shadow-xl rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to AI Security System
          </h1>
          <p className="text-gray-600">
            You have successfully logged in to the security dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
