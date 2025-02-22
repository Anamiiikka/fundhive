import React from 'react';
import { Bell, MessageCircle, Heart, Target, X } from 'lucide-react';

export function Notifications({ notifications, onClose, onMarkAsRead }) {
  const getIcon = (type) => {
    switch (type) {
      case 'investment':
        return <Bell className="w-5 h-5 text-green-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'milestone':
        return <Target className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}