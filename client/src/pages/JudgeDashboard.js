import React, { useState, useEffect } from 'react';
import { judgeAPI } from '../services/api';
import './JudgeDashboard.css';

const JudgeDashboard = () => {
  const [posters, setPosters] = useState([]);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [marks, setMarks] = useState('');
  const [comments, setComments] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    const res = await judgeAPI.getAssignedPosters();
    setPosters(res.data);
  };

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    try {
      await judgeAPI.submitScore({
        posterId: selectedPoster._id,
        marks: Number(marks),
        comments
      });
      setMessage('Score submitted successfully!');
      setSelectedPoster(null);
      setMarks('');
      setComments('');
      fetchPosters();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting score');
    }
  };

  return (
    <div className="judge-dashboard">
      <div className="header">
        <h1>Judge Dashboard</h1>
        <button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }} className="btn-logout">Logout</button>
      </div>

      {message && <div className="message">{message}</div>}

      {!selectedPoster ? (
        <div>
          <h2>My Assigned Posters</h2>
          <div className="posters-grid">
            {posters.length === 0 ? (
              <p>No posters assigned yet.</p>
            ) : (
              posters.map(poster => (
                <div key={poster._id} className="poster-card">
                  <img src={`${process.env.REACT_APP_API_URL || ''}${poster.imageUrl}`} alt={poster.title} />
                  <h3>{poster.title}</h3>
                  <p>{poster.description}</p>
                  {poster.scored ? (
                    <div className="scored-badge">
                      ✓ Scored: {poster.myScore}/100
                    </div>
                  ) : (
                    <button onClick={() => setSelectedPoster(poster)} className="btn-primary">
                      Score This Poster
                    </button>
                  )}
                  {poster.scored && (
                    <button onClick={() => setSelectedPoster(poster)} className="btn-secondary">
                      Update Score
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="scoring-section">
          <button onClick={() => setSelectedPoster(null)} className="btn-back">← Back to Posters</button>
          
          <div className="poster-detail">
            <img src={`${process.env.REACT_APP_API_URL || ''}${selectedPoster.imageUrl}`} alt={selectedPoster.title} />
            <h2>{selectedPoster.title}</h2>
            <p>{selectedPoster.description}</p>
          </div>

          <form onSubmit={handleSubmitScore} className="score-form">
            <h3>Submit Your Score</h3>
            <div className="form-group">
              <label>Marks (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Comments (Optional)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your feedback..."
              />
            </div>
            <button type="submit" className="btn-primary">Submit Score</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JudgeDashboard;
