import React from 'react';
import { TrendingUp } from 'lucide-react';

function TrendingSection({ trendingProjects, loadingPosts }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Trending Projects</h2>
      </div>
      {loadingPosts ? (
        <div>Loading trending projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingProjects.map((project) => (
            <div key={project.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-2">{project.title}</h3>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.fundingPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{project.fundingPercentage.toFixed(1)}% funded</span>
                  <span>{project.hoursLeft}h left</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrendingSection;