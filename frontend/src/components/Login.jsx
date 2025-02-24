import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Rocket } from 'lucide-react';
import fundhiveImage from '../assets/Fundhive.png';

export function Login() { 
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        
       
        <h2 className="text-xl font-semibold text-center mb-2">Welcome To</h2>
        
        <div className="flex items-center justify-center mb-4">
          <Rocket className="w-10 h-10 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">FundHive</h1>
        </div>

        <img 
          src={fundhiveImage} 
          alt="Welcome Illustration" 
          className="w-full h-auto mb-4 rounded-lg"
        />

        <p className="text-gray-600 text-center mb-6 text-sm">
          Sign in to explore and fund innovative projects
        </p>
        
       
        <button
          onClick={() => loginWithRedirect()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-base font-medium"
        >
          <span>Log In / Sign Up</span>
        </button>
      </div>
    </div>
  );
}
