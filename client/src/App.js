import React, { useState } from 'react';
import ProfileForm from './components/ProfileForm';
import JobResults from './components/JobResults';
import './App.css';

export default function App() {
  const [phase, setPhase] = useState('form'); // form | searching | results
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [searchStatus, setSearchStatus] = useState('');
  const [searchSummary, setSearchSummary] = useState('');
  const [tips, setTips] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (profileData) => {
    setProfile(profileData);
    setPhase('searching');
    setError('');
    setJobs([]);

    const API_BASE = process.env.REACT_APP_API_URL || '';

    try {
      const response = await fetch(`${API_BASE}/api/find-jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profileData }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6));

              if (event.type === 'searching') {
                setSearchStatus(event.message);
              } else if (event.type === 'result') {
                setJobs(event.data.jobs || []);
                setSearchSummary(event.data.searchSummary || '');
                setTips(event.data.tips || []);
                setPhase('results');
              } else if (event.type === 'error') {
                setError(event.message);
                setPhase('form');
              }
            } catch (e) {
              // ignore parse errors on partial chunks
            }
          }
        }
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      setPhase('form');
    }
  };

  const handleReset = () => {
    setPhase('form');
    setJobs([]);
    setError('');
    setSearchStatus('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">TalentScout<span className="logo-ai">AI</span></span>
        </div>
        <p className="logo-tagline">AI-powered job matching across every platform</p>
      </header>

      <main className="app-main">
        {phase === 'form' && (
          <ProfileForm onSearch={handleSearch} error={error} />
        )}
        {phase === 'searching' && (
          <SearchingState status={searchStatus} />
        )}
        {phase === 'results' && (
          <JobResults
            jobs={jobs}
            profile={profile}
            summary={searchSummary}
            tips={tips}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="app-footer">
        <p> Built and designed by Endrit Nezir · Searches LinkedIn, Indeed, RemoteOK, WeWorkRemotely & more</p>
      </footer>
    </div>
  );``
}

function SearchingState({ status }) {
  return (
    <div className="searching-state">
      <div className="search-animation">
        <div className="orbit-ring ring-1" />
        <div className="orbit-ring ring-2" />
        <div className="orbit-ring ring-3" />
        <div className="search-core">◈</div>
      </div>
      <h2 className="searching-title">Scanning the Job Market</h2>
      <p className="searching-status">{status || 'Initializing search...'}</p>
      <div className="platform-tags">
        {['LinkedIn', 'Indeed', 'RemoteOK', 'WeWorkRemotely', 'Glassdoor', 'Wellfound'].map(p => (
          <span key={p} className="platform-tag">{p}</span>
        ))}
      </div>
    </div>
  );
}