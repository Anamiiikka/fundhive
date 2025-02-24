import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export function useCreateProject({ onClose }) {
  const { user } = useAuth0();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    fundingGoal: '',
    equityOffered: '',
    duration: '30',
    media: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, media: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('fundingGoal', formData.fundingGoal);
    formDataToSend.append('equityOffered', formData.equityOffered);
    formDataToSend.append('duration', formData.duration);
    formDataToSend.append('name', user.name);
    formDataToSend.append('email', user.email);
    if (formData.media) {
      formDataToSend.append('media', formData.media);
    }

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'X-User-ID': user.sub,
          'X-User-Picture': user.picture || '',
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }

      const result = await response.json();
      console.log('Project created:', result);
      onClose();
    } catch (err) {
      setError(err.message);
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    formData,
    setFormData,
    error,
    loading,
    handleFileChange,
    handleSubmit,
  };
}