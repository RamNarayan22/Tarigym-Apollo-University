import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('judges');
  const [judges, setJudges] = useState([]);
  const [posters, setPosters] = useState([]);
  const [scores, setScores] = useState([]);
  const [newJudge, setNewJudge] = useState({ username: '', password: '' });
  const [newPoster, setNewPoster] = useState({ posterId: '', title: '', description: '', image: null });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJudges();
    fetchPosters();
    fetchScores();
  }, []);

  const fetchJudges = async () => {
    const res = await adminAPI.getJudges();
    setJudges(res.data);
  };

  const fetchPosters = async () => {
    const res = await adminAPI.getPosters();
    setPosters(res.data);
  };

  const fetchScores = async () => {
    const res = await adminAPI.getAllScores();
    setScores(res.data);
  };

  const handleCreateJudge = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createJudge(newJudge);
      setMessage('Judge created successfully!');
      setNewJudge({ username: '', password: '' });
      fetchJudges();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating judge');
    }
  };

  const handleUploadPoster = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('posterId', newPoster.posterId);
    formData.append('title', newPoster.title);
    formData.append('description', newPoster.description);
    formData.append('image', newPoster.image);

    try {
      await adminAPI.uploadPoster(formData);
      setMessage('Poster uploaded successfully!');
      setNewPoster({ posterId: '', title: '', description: '', image: null });
      fetchPosters();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error uploading poster');
    }
  };

  const handleExportScores = async () => {
    try {
      const response = await adminAPI.exportScores();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'TARIGYM_Poster_Scores.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setMessage('Error exporting scores');
    }
  };

  const handleAssignPoster = async (posterId, judgeId) => {
    try {
      await adminAPI.assignPoster({ posterId, judgeId });
      setMessage('Poster assigned successfully!');
      fetchPosters();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error assigning poster');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }} className="btn-logout">Logout</button>
      </div>

      <div className="tabs">
        <button className={activeTab === 'judges' ? 'active' : ''} onClick={() => setActiveTab('judges')}>Judges</button>
        <button className={activeTab === 'posters' ? 'active' : ''} onClick={() => setActiveTab('posters')}>Posters</button>
        <button className={activeTab === 'assign' ? 'active' : ''} onClick={() => setActiveTab('assign')}>Assign</button>
        <button className={activeTab === 'scores' ? 'active' : ''} onClick={() => setActiveTab('scores')}>Scores</button>
        <button onClick={handleExportScores} className="btn-export">📊 Export Excel</button>
      </div>

      {message && <div className="message">{message}</div>}

      {activeTab === 'judges' && (
        <div className="tab-content">
          <h2>Create Judge</h2>
          <form onSubmit={handleCreateJudge}>
            <input
              type="text"
              placeholder="Username"
              value={newJudge.username}
              onChange={(e) => setNewJudge({ ...newJudge, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newJudge.password}
              onChange={(e) => setNewJudge({ ...newJudge, password: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary">Create Judge</button>
          </form>

          <h2>All Judges</h2>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {judges.map(judge => (
                <tr key={judge._id}>
                  <td>{judge.username}</td>
                  <td>{new Date(judge.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'posters' && (
        <div className="tab-content">
          <h2>Upload Poster</h2>
          <form onSubmit={handleUploadPoster}>
            <input
              type="text"
              placeholder="Poster ID (e.g., P001, P002)"
              value={newPoster.posterId}
              onChange={(e) => setNewPoster({ ...newPoster, posterId: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Title"
              value={newPoster.title}
              onChange={(e) => setNewPoster({ ...newPoster, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={newPoster.description}
              onChange={(e) => setNewPoster({ ...newPoster, description: e.target.value })}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewPoster({ ...newPoster, image: e.target.files[0] })}
              required
            />
            <button type="submit" className="btn-primary">Upload Poster</button>
          </form>

          <h2>All Posters</h2>
          <div className="posters-grid">
            {posters.map(poster => (
              <div key={poster._id} className="poster-card">
                <div className="poster-id-badge">{poster.posterId}</div>
                <img src={`${process.env.REACT_APP_API_URL || ''}${poster.imageUrl}`} alt={poster.title} />
                <h3>{poster.title}</h3>
                <p>{poster.description}</p>
                <p><strong>Assigned Judges:</strong> {poster.assignedJudges.map(j => j.username).join(', ') || 'None'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assign' && (
        <div className="tab-content">
          <h2>Assign Posters to Judges</h2>
          {posters.map(poster => (
            <div key={poster._id} className="assign-section">
              <h3>{poster.title}</h3>
              <select onChange={(e) => handleAssignPoster(poster._id, e.target.value)}>
                <option value="">Select Judge</option>
                {judges.map(judge => (
                  <option key={judge._id} value={judge._id}>{judge.username}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'scores' && (
        <div className="tab-content">
          <h2>All Scores</h2>
          <table>
            <thead>
              <tr>
                <th>Poster</th>
                <th>Judge</th>
                <th>Title</th>
                <th>Objectives</th>
                <th>Methodology</th>
                <th>Results</th>
                <th>Presentation Q&A</th>
                <th>Total</th>
                <th>Comments</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {scores.map(score => (
                <tr key={score._id}>
                  <td>{score.poster?.title}</td>
                  <td>{score.judge?.username}</td>
                  <td>{score.marksForTitle}/3</td>
                  <td>{score.marksForObjectives}/3</td>
                  <td>{score.marksForMethodology}/8</td>
                  <td>{score.marksForResults}/6</td>
                  <td>{score.marksForPresentationQA}/5</td>
                  <td><strong>{score.marksForOverall}/25</strong></td>
                  <td>{score.comments}</td>
                  <td>{new Date(score.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
