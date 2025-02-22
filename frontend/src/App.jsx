import React, { useState } from 'react';
import { Post } from './components/Post';
import { CreateProject } from './components/CreateProject';
import { UserProfile } from './components/UserProfile';
import { Notifications } from './components/Notifications';
import { Rocket, Search, TrendingUp, Briefcase, Code, Leaf, Cpu, Palette, Bell, UserCircle, Plus } from 'lucide-react';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'investment',
      message: 'New $5,000 investment in AI Workspace Pro!',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'milestone',
      message: 'SolarTech Solutions reached 75% of funding goal!',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    }
  ]);

  const categories = [
    { id: 'tech', name: 'Technology', icon: <Cpu className="w-5 h-5" /> },
    { id: 'business', name: 'Business', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'software', name: 'Software', icon: <Code className="w-5 h-5" /> },
    { id: 'sustainability', name: 'Green Tech', icon: <Leaf className="w-5 h-5" /> },
    { id: 'creative', name: 'Creative', icon: <Palette className="w-5 h-5" /> },
  ];

  const trendingProjects = [
    { id: '1', title: 'EcoCharge - Solar Power Bank', fundingPercentage: 85, hoursLeft: 48 },
    { id: '2', title: 'SmartLearn AI Tutor', fundingPercentage: 92, hoursLeft: 24 },
    { id: '3', title: 'Urban Vertical Farm', fundingPercentage: 75, hoursLeft: 72 },
  ];

  const posts = [
    {
      username: "TechStartup",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content: {
        type: "image",
        url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80"
      },
      description: "Introducing our revolutionary AI-powered productivity platform that helps teams collaborate more effectively. Looking for seed funding to scale our operations.",
      businessDetails: {
        title: "AI Workspace Pro",
        fundingGoal: 500000,
        equityOffered: 10
      },
      category: 'tech'
    },
    {
      username: "GreenEnergy",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content: {
        type: "image",
        url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80"
      },
      description: "Our innovative solar panel technology increases energy efficiency by 40%. Join us in revolutionizing renewable energy.",
      businessDetails: {
        title: "SolarTech Solutions",
        fundingGoal: 1000000,
        equityOffered: 15
      },
      category: 'sustainability'
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      post.businessDetails.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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
                    onMarkAsRead={(id) => {
                      setNotifications(notifications.map(n => 
                        n.id === id ? { ...n, read: true } : n
                      ));
                    }}
                  />
                )}
              </div>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="text-gray-600 hover:text-gray-900"
              >
                <UserCircle className="w-6 h-6" />
              </button>
            </nav>
          </div>
          
          {/* Search Bar */}
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

      {/* Categories */}
      <div className="bg-white shadow-sm mt-4">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Trending Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingProjects.map((project) => (
              <div key={project.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">{project.title}</h3>
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${project.fundingPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{project.fundingPercentage}% funded</span>
                    <span>{project.hoursLeft}h left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-8">
          {filteredPosts.map((post, index) => (
            <Post key={index} {...post} />
          ))}
        </div>
      </div>

      {/* Modals */}
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}

      {showCreateProject && (
        <CreateProject onClose={() => setShowCreateProject(false)} />
      )}
    </div>
  );
}

export default App;