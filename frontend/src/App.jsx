import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamStats from './pages/TeamStats';
import MVP from './pages/MVP';
import Home from './pages/Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<TeamStats />} />
        <Route path="/mvp/:puuid" element={<MVP />} />
      </Routes>
    </Router>
  );
}
