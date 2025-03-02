import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { X, User, Briefcase, ChevronRight, Settings, LogOut, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserProfile({ onClose, handleDeleteProject }) { // Add handleDeleteProject prop
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('investments');
  const [projects, setProjects] = useState([]);
  const [negotiationRequests, setNegotiationRequests] = useState([]);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        console.log('Logged-in user.sub:', user.sub);
        const response = await fetch('http://localhost:5000/api/projects', {
          headers: { 'X-User-ID': user.sub },
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        console.log('Fetched projects:', data.map(project => ({ _id: project._id, userId: project.userId })));

        const userProjects = data.filter(project => project.userId && project.userId.auth0Id === user.sub);
        console.log('User projects:', userProjects);

        const requests = userProjects.flatMap(project => 
          project.negotiationRequests.map(req => ({
            ...req,
            projectId: project._id,
            projectTitle: project.title,
          }))
        ).filter(req => req.status === 'pending');
        console.log('Pending negotiation requests:', requests);

        setProjects(userProjects);
        setNegotiationRequests(requests);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    
    fetchUserProjects();
  }, [user.sub]);

  const handleRespond = async (projectId, requestId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${projectId}/negotiate/${requestId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.sub,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to respond to negotiation');
      }

      const updatedProject = await response.json();

      setNegotiationRequests(prev => prev.filter(req => req._id !== requestId));
      if (status === 'accepted') {
        setProjects(prev =>
          prev.map(p =>
            p._id === projectId
              ? { ...p, currentFunding: updatedProject.project.currentFunding }
              : p
          )
        );
        alert('Negotiation accepted successfully! Funds have been added to the project.');
      } else {
        alert('Negotiation rejected successfully.');
      }
    } catch (err) {
      console.error('Error responding to negotiation:', err);
      alert(`Failed to ${status} negotiation: ${err.message}`);
    }
  };

  const onDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      const success = await handleDeleteProject(projectId);
      if (success) {
        setProjects(prev => prev.filter(p => p._id !== projectId));
        alert('Project deleted successfully!');
      } else {
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    const returnToUrl = `${window.location.origin}/`;
    console.log('Logging out, redirecting to:', returnToUrl);
    logout({ logoutParams: { returnTo: returnToUrl } });
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
            <img src={user?.picture || 'https://via.placeholder.com/64'} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h3 className="font-semibold">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-600">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            <button onClick={() => setActiveTab('investments')} className={`flex-1 py-2 text-center rounded-lg ${activeTab === 'investments' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Investments</button>
            <button onClick={() => setActiveTab('projects')} className={`flex-1 py-2 text-center rounded-lg ${activeTab === 'projects' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>My Projects</button>
            <button onClick={() => setActiveTab('negotiations')} className={`flex-1 py-2 text-center rounded-lg ${activeTab === 'negotiations' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Negotiations</button>
          </div>

          {activeTab === 'investments' && (
            <div className="space-y-4">
              <p className="text-gray-600">No investments yet.</p>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              {projects.length === 0 ? (
                <p className="text-gray-600">No projects created yet.</p>
              ) : (
                projects.map((project) => (
                  <div key={project._id} className="p-4 border rounded-lg relative">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{project.title}</h4>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">{project.status}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(project.currentFunding / project.fundingGoal) * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Raised: ${project.currentFunding.toLocaleString()}</span>
                        <span>Goal: ${project.fundingGoal.toLocaleString()}</span>
                      </div>
                    </div>
                    {project.currentFunding === 0 && (
                      <button
                        onClick={() => onDeleteProject(project._id)}
                        className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded-lg flex items-center space-x-1 hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'negotiations' && (
            <div className="space-y-4">
              {negotiationRequests.length === 0 ? (
                <p className="text-gray-600">No pending negotiation requests.</p>
              ) : (
                negotiationRequests.map((request) => (
                  <div key={request._id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{request.projectTitle}</h4>
                    <div className="text-sm text-gray-600">
                      <p>Proposed Amount: ${request.proposedAmount.toLocaleString()}</p>
                      <p>Proposed Equity: {request.proposedEquity}%</p>
                      <p>Investor ID: {request.investorId}</p>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleRespond(request.projectId, request._id, 'accepted')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(request.projectId, request._id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
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
            <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg text-red-600">
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5" />
                <span>Log out</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}