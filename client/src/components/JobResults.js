import React, { useState } from 'react';

function ScoreRing({ score }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#63deb1' : score >= 60 ? '#f0c060' : '#e86b4f';

  return (
    <div className="match-score">
      <div className="score-ring">
        <svg viewBox="0 0 48 48" width="52" height="52">
          <circle className="track" cx="24" cy="24" r={r} />
          <circle
            className="fill"
            cx="24" cy="24" r={r}
            stroke={color}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '24px 24px' }}
          />
          <text
            x="24" y="28"
            textAnchor="middle"
            fill={color}
            fontSize="11"
            fontFamily="'DM Mono', monospace"
            fontWeight="500"
            style={{ transform: 'none' }}
          >
            {score}%
          </text>
        </svg>
      </div>
      <div className="score-label">MATCH</div>
    </div>
  );
}

function JobCard({ job, index }) {
  return (
    <div className="job-card" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="job-card-top">
        <div className="job-card-title">
          <h3>{job.title}</h3>
          <div className="company">{job.company}</div>
        </div>
        <ScoreRing score={job.matchScore || 0} />
      </div>

      <div className="job-meta">
        <span className="meta-tag platform">{job.platform}</span>
        <span className="meta-tag location">📍 {job.location}</span>
        {job.remote && <span className="meta-tag remote">🌍 Remote</span>}
        {job.type && <span className="meta-tag type">{job.type}</span>}
        {job.salary && job.salary !== 'Not Listed' && (
          <span className="meta-tag salary">💰 {job.salary}</span>
        )}
        {job.visaSponsorship === true && (
          <span className="meta-tag visa">✈ Visa Sponsorship</span>
        )}
      </div>

      {job.matchReasons && job.matchReasons.length > 0 && (
        <div className="match-reasons">
          <div className="match-reasons-title">Why you match</div>
          <div className="match-reasons-list">
            {job.matchReasons.map((r, i) => (
              <span key={i} className="reason-chip">{r}</span>
            ))}
          </div>
        </div>
      )}

      <div className="job-card-bottom">
        <span className="posted-date">{job.postedDate || 'Recently posted'}</span>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="apply-btn"
          onClick={e => {
            if (!job.url || job.url === '#') {
              e.preventDefault();
              alert('Direct link not available — search "' + job.title + ' ' + job.company + '" on ' + job.platform);
            }
          }}
        >
          Apply Now →
        </a>
      </div>
    </div>
  );
}

export default function JobResults({ jobs, profile, summary, tips, onReset }) {
  const [filter, setFilter] = useState('All');

  const platforms = ['All', ...new Set((jobs || []).map(j => j.platform).filter(Boolean))];

  const filtered = filter === 'All'
    ? jobs
    : jobs.filter(j => j.platform === filter);

  const sorted = [...(filtered || [])].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  return (
    <div className="job-results">
      <div className="results-header">
        <div className="results-title">
          <h2>Found {jobs.length} matching jobs</h2>
          <p>
            For: {profile?.jobTitle || profile?.skills?.split(',')[0]} ·
            From: {profile?.country} ·
            {profile?.workPreference}
          </p>
        </div>
        <button className="reset-btn" onClick={onReset}>← New Search</button>
      </div>

      {tips && tips.length > 0 && (
        <div className="tips-bar">
          <h3>💡 AI Career Tips</h3>
          <ul>
            {tips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>
      )}

      {platforms.length > 2 && (
        <div className="platform-filter">
          {platforms.map(p => (
            <button
              key={p}
              className={`pref-toggle ${filter === p ? 'active' : ''}`}
              onClick={() => setFilter(p)}
              style={{ marginBottom: '20px' }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="jobs-grid">
        {sorted.map((job, i) => (
          <JobCard key={i} job={job} index={i} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '14px'
        }}>
          No jobs found for this filter. Try "All".
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button className="reset-btn" onClick={onReset}>Search Again with Different Profile</button>
      </div>
    </div>
  );
}
