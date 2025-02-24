import React from 'react';
import { Rocket, Search, Bell, UserCircle, Plus } from 'lucide-react';
import {Notifications} from './Notifications';

function Header({
  searchQuery,
  setSearchQuery,
  notifications,
  showNotifications,
  setShowNotifications,
  setShowProfile,
  setShowCreateProject,
  setNotifications,
}) {
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Rocket className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">FundHive</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateProject(true)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-600 hover:text-gray-900 relative"
              >
                <Bell className="w-6 h-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              {showNotifications && (
                <Notifications
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                  onMarkAsRead={(id) => setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))}
                />
              )}
            </div>
            <button onClick={() => setShowProfile(true)} className="text-gray-600 hover:text-gray-900">
              <UserCircle className="w-6 h-6" />
            </button>
          </nav>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;