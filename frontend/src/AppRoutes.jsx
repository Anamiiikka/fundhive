import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import { Login } from './components/Login.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}