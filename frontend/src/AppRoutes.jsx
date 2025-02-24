import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import { Login } from './components/Login.jsx'; // This is correct as is
import { Auth0Callback } from './components/Auth0Callback.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Auth0Callback />} />
    </Routes>
  );
}