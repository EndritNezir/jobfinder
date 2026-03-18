import React, { useState } from 'react';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin',
  'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Bulgaria','Burkina Faso',
  'Cambodia','Cameroon','Canada','Chile','China','Colombia','Congo','Costa Rica',
  'Croatia','Cuba','Cyprus','Czech Republic','Denmark','Ecuador','Egypt',
  'El Salvador','Estonia','Ethiopia','Finland','France','Georgia','Germany','Ghana',
  'Greece','Guatemala','Honduras','Hungary','India','Indonesia','Iran','Iraq',
  'Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya',
  'Kosovo','Kuwait','Kyrgyzstan','Latvia','Lebanon','Libya','Lithuania','Luxembourg',
  'Malaysia','Malta','Mexico','Moldova','Mongolia','Montenegro','Morocco',
  'Mozambique','Myanmar','Nepal','Netherlands','New Zealand','Nicaragua','Nigeria',
  'North Macedonia','Norway','Pakistan','Palestine','Panama','Paraguay','Peru',
  'Philippines','Poland','Portugal','Qatar','Romania','Russia','Saudi Arabia',
  'Senegal','Serbia','Singapore','Slovakia','Slovenia','Somalia','South Africa',
  'South Korea','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria','Taiwan',
  'Tajikistan','Tanzania','Thailand','Tunisia','Turkey','Turkmenistan','Uganda',
  'Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay',
  'Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
];

const EXPERIENCE_LEVELS = [
  'Entry Level (0-1 years)',
  'Junior (1-3 years)',
  'Mid-Level (3-5 years)',
  'Senior (5-8 years)',
  'Lead / Principal (8+ years)',
  'Executive / Director',
];

export default function ProfileForm({ onSearch, error }) {
  const [form, setForm] = useState({
    jobTitle: '',
    skills: '',
    experience: '',
    country: '',
    workPreference: 'Remote',
    workAuth: '',
    languages: 'English',
    additionalInfo: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.skills || !form.country) return;
    setLoading(true);
    await onSearch(form);
    setLoading(false);
  };

  const workOptions = ['Remote', 'On-site', 'Hybrid', 'Any'];

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-hero">
        <h1>Find your <em>perfect job</em><br />anywhere in the world.</h1>
        <p>Tell us about yourself — our AI will scan every major job platform and match you to the best opportunities.</p>
      </div>

      <div className="form-grid">
        {/* Job Title */}
        <div className="form-group">
          <label>Desired Job Title</label>
          <input
            type="text"
            placeholder="e.g. Frontend Developer, Data Analyst..."
            value={form.jobTitle}
            onChange={e => set('jobTitle', e.target.value)}
          />
        </div>

        {/* Experience */}
        <div className="form-group">
          <label>Experience Level</label>
          <select value={form.experience} onChange={e => set('experience', e.target.value)}>
            <option value="">Select level...</option>
            {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Skills */}
        <div className="form-group full">
          <label>Skills & Technologies <span>*</span></label>
          <textarea
            placeholder="e.g. React, Node.js, Python, SQL, Figma, project management, customer support..."
            value={form.skills}
            onChange={e => set('skills', e.target.value)}
            required
          />
        </div>

        {/* Country */}
        <div className="form-group">
          <label>Country of Origin / Citizenship <span>*</span></label>
          <select value={form.country} onChange={e => set('country', e.target.value)} required>
            <option value="">Select your country...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Work Authorization */}
        <div className="form-group">
          <label>Work Authorization / Visa Status</label>
          <input
            type="text"
            placeholder="e.g. EU work permit, US Green Card, Open to relocation..."
            value={form.workAuth}
            onChange={e => set('workAuth', e.target.value)}
          />
        </div>

        {/* Work Preference */}
        <div className="form-group full">
          <label>Work Preference</label>
          <div className="pref-toggles">
            {workOptions.map(opt => (
              <button
                key={opt}
                type="button"
                className={`pref-toggle ${form.workPreference === opt ? 'active' : ''}`}
                onClick={() => set('workPreference', opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="form-group">
          <label>Languages</label>
          <input
            type="text"
            placeholder="e.g. English (fluent), Spanish (basic)..."
            value={form.languages}
            onChange={e => set('languages', e.target.value)}
          />
        </div>

        {/* Additional */}
        <div className="form-group">
          <label>Additional Info</label>
          <input
            type="text"
            placeholder="Salary range, industry preferences, anything else..."
            value={form.additionalInfo}
            onChange={e => set('additionalInfo', e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={loading || !form.skills || !form.country}
      >
        {loading ? 'Scanning...' : '◈ Find My Jobs Across All Platforms'}
      </button>

      {error && <div className="error-msg">⚠ {error}</div>}
    </form>
  );
}
