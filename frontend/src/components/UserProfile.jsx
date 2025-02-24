import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { X, User, Briefcase, ChevronRight, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserProfile({ onClose }) {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('investments');

  const investments = [
    { id: '1', projectName: 'AI Workspace Pro', amount: 5000, equity: 0.5, date: '2024-03-15' },
    { id: '2', projectName: 'SolarTech Solutions', amount: 10000, equity: 1.2, date: '2024-03-10' },
  ];

  const projects = [
    { id: '1', name: 'EcoFriendly Packaging', status: 'active', raised: 75000, goal: 100000 },
  ];

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin + '/login' } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Profile</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <img
              src={user?.picture || 'https://via.placeholder.com/64'}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-600">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('investments')}
              className={`flex-1 py-2 text-center rounded-lg ${
                activeTab === 'investments'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Investments
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 py-2 text-center rounded-lg ${
                activeTab === 'projects'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              My Projects
            </button>
          </div>

          {activeTab === 'investments' && (
            <div className="space-y-4">
              {investments.map((investment) => (
                <div key={investment.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{investment.projectName}</h4>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-medium">${investment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Equity</p>
                      <p className="font-medium">{investment.equity}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-medium">{investment.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                      {project.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(project.raised / project.goal) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Raised: ${project.raised.toLocaleString()}</span>
                      <span>Goal: ${project.goal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 space-y-2">
            <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <span>Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg text-red-600"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5" />
                <span>Log out</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}