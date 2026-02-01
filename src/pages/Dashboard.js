import { useState, useEffect } from 'react';
import { jobs, dashboard } from '../services/api';

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [newJob, setNewJob] = useState({
    jobTitle: '',
    companyName: '',
    jobLink: '',
    status: 'APPLIED',
    source: 'LINKEDIN',
    applicationMode: 'ONLINE',
    jobType: 'REMOTE',
    note: ''
  });

  const statusOptions = ['APPLIED', 'INTERVIEW', 'REJECTED', 'OFFER', 'JOINED'];
  const sourceOptions = ['CarrierPage', 'LINKEDIN', 'Naukri', 'Indeed', 'Other'];
  const applicationModeOptions = ['ONLINE', 'EMAIL', 'IN_PERSON', 'RECRUITER'];
  const jobTypeOptions = ['ONSITE', 'REMOTE', 'HYBRID'];
  
  const statusColors = {
    'APPLIED': 'primary',
    'INTERVIEW': 'warning',
    'OnlineAssisment': 'info',
    'NoResponse': 'secondary',
    'REJECTED': 'danger',
    'OFFER': 'success',
    'JOINED': 'dark'
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobsRes, statsRes] = await Promise.all([
        jobs.getAll(),
        dashboard.getStats()
      ]);
        setApplications(
  jobsRes.data.map(job => ({
    ...job,
    jobType: job.jobtype   
  }))
);

      setStats(statsRes.data);
    } catch (err) {
      alert('Error loading data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await jobs.create(newJob);
      setShowAddModal(false);
      setNewJob({
        jobTitle: '',
        companyName: '',
        jobLink: '',
        status: 'APPLIED',
        source: 'LINKEDIN',
        applicationMode: 'ONLINE',
        jobType: 'REMOTE',
        note: ''
      });
      loadData();
    } catch (err) {
      alert('Error adding job: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await jobs.updateStatus(id, newStatus);
      loadData();
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this application?')) {
      try {
        await jobs.delete(id);
        loadData();
      } catch (err) {
        alert('Error deleting job: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEdit = (job) => {
    setEditingJob({
      id: job.id,
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      jobLink: job.jobLink || '',
      status: job.status,
      source: job.source,
      applicationMode: job.applicationMode,
      jobType: job.jobType,
      note: job.note || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await jobs.update(editingJob.id, editingJob);
      setShowEditModal(false);
      setEditingJob(null);
      loadData();
    } catch (err) {
      alert('Error updating job: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Stats Cards */}
      {stats && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Total</h5>
                <h2 className="text-primary">{stats.total || 0}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Applied</h5>
                <h2 className="text-info">{stats.applied || 0}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Interviews</h5>
                <h2 className="text-warning">{stats.interview || 0}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Offers</h5>
                <h2 className="text-success">{stats.offer || 0}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Rejected</h5>
                <h2 className="text-danger">{stats.rejected || 0}</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Applications</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add Job
        </button>
      </div>

      {/* Job List */}
      {applications.length === 0 ? (
        <div className="alert alert-info text-center">
          <h5>No applications yet!</h5>
          <p>Click "Add Job" to track your first application.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Company</th>
                <th>Job Title</th>
                <th>Job Link</th>
                <th>Applied Date</th>
                <th>Source</th>
                <th>Type</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td><strong>{app.companyName}</strong></td>
                  <td>{app.jobTitle}</td>
                  <td>
                    <a 
                      href={app.jobLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Job
                    </a>
                  </td>
                  <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td><span className="badge bg-secondary">{app.source}</span></td>
                  <td><span className="badge bg-info">{app.jobType}</span></td>
                  <td>
                    <select 
                      className={`form-select form-select-sm badge bg-${statusColors[app.status]}`}
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      style={{ width: 'auto', color: 'white', border: 'none' }}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <small className="text-muted">
                      {app.note ? app.note.substring(0, 50) + (app.note.length > 50 ? '...' : '') : '-'}
                    </small>
                  </td>
                  <td>
                    {/* <button 
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEdit(app)}
                    >
                      Edit
                    </button> */}
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(app.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Job Application</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddJob}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Company Name *</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={newJob.companyName}
                        onChange={e => setNewJob({...newJob, companyName: e.target.value})}
                        required
                        minLength={2}
                        maxLength={100}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Job Title *</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={newJob.jobTitle}
                        onChange={e => setNewJob({...newJob, jobTitle: e.target.value})}
                        required
                        minLength={2}
                        maxLength={200}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Job Link *</label>
                    <input 
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={newJob.jobLink}
                      onChange={e => setNewJob({...newJob, jobLink: e.target.value})}
                      required
                    />
                    <small className="text-muted">Required - Must be a valid URL</small>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status *</label>
                      <select 
                        className="form-select"
                        value={newJob.status}
                        onChange={e => setNewJob({...newJob, status: e.target.value})}
                        required
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Source *</label>
                      <select 
                        className="form-select"
                        value={newJob.source}
                        onChange={e => setNewJob({...newJob, source: e.target.value})}
                        required
                      >
                        {sourceOptions.map(source => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Application Mode *</label>
                      <select 
                        className="form-select"
                        value={newJob.applicationMode}
                        onChange={e => setNewJob({...newJob, applicationMode: e.target.value})}
                        required
                      >
                        {applicationModeOptions.map(mode => (
                          <option key={mode} value={mode}>{mode}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Job Type *</label>
                      <select 
                        className="form-select"
                        value={newJob.jobType}
                        onChange={e => setNewJob({...newJob, jobType: e.target.value})}
                        required
                      >
                        {jobTypeOptions.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Notes (optional)</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      maxLength={1000}
                      value={newJob.note}
                      onChange={e => setNewJob({...newJob, note: e.target.value})}
                      placeholder="Any additional notes..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && editingJob && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Job Application</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingJob(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Company Name *</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={editingJob.companyName}
                        onChange={e => setEditingJob({...editingJob, companyName: e.target.value})}
                        required
                        minLength={2}
                        maxLength={100}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Job Title *</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={editingJob.jobTitle}
                        onChange={e => setEditingJob({...editingJob, jobTitle: e.target.value})}
                        required
                        minLength={2}
                        maxLength={200}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Job Link *</label>
                    <input 
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={editingJob.jobLink}
                      onChange={e => setEditingJob({...editingJob, jobLink: e.target.value})}
                      required
                    />
                    <small className="text-muted">Required - Must be a valid URL</small>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status *</label>
                      <select 
                        className="form-select"
                        value={editingJob.status}
                        onChange={e => setEditingJob({...editingJob, status: e.target.value})}
                        required
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Source *</label>
                      <select 
                        className="form-select"
                        value={editingJob.source}
                        onChange={e => setEditingJob({...editingJob, source: e.target.value})}
                        required
                      >
                        {sourceOptions.map(source => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Application Mode *</label>
                      <select 
                        className="form-select"
                        value={editingJob.applicationMode}
                        onChange={e => setEditingJob({...editingJob, applicationMode: e.target.value})}
                        required
                      >
                        {applicationModeOptions.map(mode => (
                          <option key={mode} value={mode}>{mode}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Job Type *</label>
                      <select 
                        className="form-select"
                        value={editingJob.jobType}
                        onChange={e => setEditingJob({...editingJob, jobType: e.target.value})}
                        required
                      >
                        {jobTypeOptions.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Notes (optional)</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      maxLength={1000}
                      value={editingJob.note}
                      onChange={e => setEditingJob({...editingJob, note: e.target.value})}
                      placeholder="Any additional notes..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingJob(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}