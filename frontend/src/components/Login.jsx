import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Rocket } from 'lucide-react';

export function Login() { // Named export
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Rocket className="w-12 h-12 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">FundHive</h1>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Welcome</h2>
        <p className="text-gray-600 text-center mb-8">
          Sign in to explore and fund innovative projects
        </p>
        <button
          onClick={() => loginWithRedirect()}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Log In / Sign Up</span>
        </button>
      </div>
    </div>
  );
}