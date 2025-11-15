import React, { useState, useEffect } from 'react';
import { judgeAPI } from '../services/api';
import './JudgeDashboard.css';

const JudgeDashboard = () => {
  const [posters, setPosters] = useState([]);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [marksForTitle, setMarksForTitle] = useState('');
  const [marksForObjectives, setMarksForObjectives] = useState('');
  const [marksForMethodology, setMarksForMethodology] = useState('');
  const [marksForResults, setMarksForResults] = useState('');
  const [marksForPresentationQA, setMarksForPresentationQA] = useState('');
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
        marksForTitle: Number(marksForTitle),
        marksForObjectives: Number(marksForObjectives),
        marksForMethodology: Number(marksForMethodology),
        marksForResults: Number(marksForResults),
        marksForPresentationQA: Number(marksForPresentationQA),
        comments
      });
      setMessage('Score submitted successfully!');
      setSelectedPoster(null);
      setMarksForTitle('');
      setMarksForObjectives('');
      setMarksForMethodology('');
      setMarksForResults('');
      setMarksForPresentationQA('');
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
                  <p><strong>Authors:</strong> {poster.authors?.join(', ') || 'N/A'}</p>
                  <p>{poster.description}</p>
                  {poster.scored ? (
                    <div className="scored-badge">
                      ✓ Scored: {poster.myScore}/25
                      <div style={{fontSize: '10px', marginTop: '5px'}}>
                        T: {poster.myScoreBreakdown?.marksForTitle} | 
                        O: {poster.myScoreBreakdown?.marksForObjectives} | 
                        M: {poster.myScoreBreakdown?.marksForMethodology} |
                        R: {poster.myScoreBreakdown?.marksForResults} |
                        P: {poster.myScoreBreakdown?.marksForPresentationQA}
                      </div>
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
            <p><strong>Authors:</strong> {selectedPoster.authors?.join(', ') || 'N/A'}</p>
            <p>{selectedPoster.description}</p>
          </div>

          <form onSubmit={handleSubmitScore} className="score-form">
            <h3>Submit Your Score</h3>
            
            <div className="form-group">
              <label>Title (0-3 marks)</label>
              <input
                type="number"
                min="0"
                max="3"
                step="0.5"
                value={marksForTitle}
                onChange={(e) => setMarksForTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Objectives (0-3 marks)</label>
              <input
                type="number"
                min="0"
                max="3"
                step="0.5"
                value={marksForObjectives}
                onChange={(e) => setMarksForObjectives(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Methodology (0-8 marks)</label>
              <input
                type="number"
                min="0"
                max="8"
                step="0.5"
                value={marksForMethodology}
                onChange={(e) => setMarksForMethodology(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Results (0-6 marks)</label>
              <input
                type="number"
                min="0"
                max="6"
                step="0.5"
                value={marksForResults}
                onChange={(e) => setMarksForResults(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Presentation & Q&A (0-5 marks)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.5"
                value={marksForPresentationQA}
                onChange={(e) => setMarksForPresentationQA(e.target.value)}
                required
              />
            </div>

            <div className="total-score">
              <strong>Total Score: {(Number(marksForTitle) || 0) + (Number(marksForObjectives) || 0) + (Number(marksForMethodology) || 0) + (Number(marksForResults) || 0) + (Number(marksForPresentationQA) || 0)}/25</strong>
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
