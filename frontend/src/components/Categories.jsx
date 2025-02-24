import React from 'react';
import { Cpu, Briefcase, Code, Leaf, Palette } from 'lucide-react';

function Categories({ selectedCategory, setSelectedCategory }) {
  const categories = [
    { id: 'tech', name: 'Technology', icon: <Cpu className="w-5 h-5" /> },
    { id: 'business', name: 'Business', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'software', name: 'Software', icon: <Code className="w-5 h-5" /> },
    { id: 'sustainability', name: 'Green Tech', icon: <Leaf className="w-5 h-5" /> },
    { id: 'creative', name: 'Creative', icon: <Palette className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-white shadow-sm mt-4">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === category.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;