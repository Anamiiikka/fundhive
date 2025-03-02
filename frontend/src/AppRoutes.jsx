// frontend/src/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import { Login } from './components/Login.jsx';
import PostPage from './components/PostPage'; // New component for individual post

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/posts/:id" element={<PostPage />} />
    </Routes>
  );
}