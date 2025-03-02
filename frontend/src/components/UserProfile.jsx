import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { X, User, Briefcase, ChevronRight, Settings, LogOut, Trash2, Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export function UserProfile({ onClose, handleDeleteProject }) {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('investments');
  const [projects, setProjects] = useState([]);
  const [negotiationRequests, setNegotiationRequests] = useState([]);
  const [aadhaarCardUrl, setAadhaarCardUrl] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${API_URL}/projects`, {
          headers: { 
            'X-User-ID': user.sub,
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();

        const userProjects = data.filter(project => project.userId && project.userId.auth0Id === user.sub);
        const requests = userProjects.flatMap(project => 
          project.negotiationRequests.map(req => ({
            ...req,
            projectId: project._id,
            projectTitle: project.title,
          }))
        ).filter(req => req.status === 'pending');

        setProjects(userProjects);
        setNegotiationRequests(requests);

        // Fetch user's Aadhaar card URL
        const userResponse = await fetch(`${API_URL}/projects`, {
          headers: { 
            'X-User-ID': user.sub,
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await userResponse.json();
        const currentUser = userData.find(p => p.userId.auth0Id === user.sub);
        setAadhaarCardUrl(currentUser?.userId.aadhaarCardUrl || null);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    
    fetchUserData();
  }, [user.sub, getAccessTokenSilently]);

  const handleAadhaarUpload = async () => {
    if (!aadhaarFile) {
      setUploadError('Please select an Aadhaar card file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('aadhaar', aadhaarFile);

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/upload-aadhaar`, {
        method: 'POST',
        headers: {
          'X-User-ID': user.sub,
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload Aadhaar card');
      }

      const result = await response.json();
      setAadhaarCardUrl(result.aadhaarCardUrl);
      setAadhaarFile(null);
      setUploadError(null);
      alert('Aadhaar card uploaded successfully!');
    } catch (err) {
      setUploadError(err.message);
      console.error('Error uploading Aadhaar card:', err);
    }
  };

  const handleRespond = async (projectId, requestId, status) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/posts/${projectId}/negotiate/${requestId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.sub,
          Authorization: `Bearer ${token}`,
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

          {/* Aadhaar Card Section */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Aadhaar Card</h3>
            <div className="border rounded-lg p-4">
              {!aadhaarCardUrl ? (
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setAadhaarFile(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <button
                    onClick={handleAadhaarUpload}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload Aadhaar Card</span>
                  </button>
                  {uploadError && <p className="text-red-600 text-sm">{uploadError}</p>}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Aadhaar Card Uploaded</p>
                  <a
                    href={aadhaarCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:underline"
                  >
                    <FileText className="w-5 h-5" />
                    <span>View Document</span>
                  </a>
                </div>
              )}
            </div>
          </div>

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