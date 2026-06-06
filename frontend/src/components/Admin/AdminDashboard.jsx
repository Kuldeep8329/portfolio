import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Briefcase, Award, GraduationCap, Award as CertificateIcon, 
  Settings, Mail, LogOut, Loader2, Plus, Trash2, Edit2, Check, X, ShieldAlert 
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    profile: null,
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    awards: []
  });
  const [leads, setLeads] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingItem, setEditingItem] = useState(null); // { type, item }
  
  // Settings Form State
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });

  // Add Item Modal/Form State
  const [showAddForm, setShowAddForm] = useState(null); // 'skills' | 'experience' | 'projects' | 'education' | 'certifications' | 'awards'
  const [formState, setFormState] = useState({});

  const navigate = useNavigate();

  // Show notification alert helper
  const triggerAlert = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Auth verification and initial load
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const loadData = async () => {
      try {
        // Verify token
        const verifyRes = await fetch(`${API_BASE_URL}/api/admin/verify`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!verifyRes.ok) {
          localStorage.removeItem('admin_token');
          navigate('/admin/login');
          return;
        }

        // Fetch portfolio data
        const dataRes = await fetch(`${API_BASE_URL}/api/admin/portfolio-data`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataJson = await dataRes.json();
        if (dataJson.success) {
          setData(dataJson.data);
        }

        // Fetch leads
        const leadsRes = await fetch(`${API_BASE_URL}/api/admin/leads`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const leadsJson = await leadsRes.json();
        if (leadsJson.success) {
          setLeads(leadsJson.data);
        }
      } catch (err) {
        console.error('Error loading admin dashboard:', err);
        triggerAlert('error', 'Failed to connect to the backend server.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  const token = localStorage.getItem('admin_token');

  // ----------------------------------------------------
  // CRUD Actions
  // ----------------------------------------------------

  // Update Profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...data.profile,
        languages: typeof data.profile.languages === 'string' 
          ? data.profile.languages.split(',').map(s => s.trim())
          : data.profile.languages
      };

      const res = await fetch(`${API_BASE_URL}/api/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setData(prev => ({ ...prev, profile: json.data }));
        triggerAlert('success', 'Profile updated successfully.');
      } else {
        triggerAlert('error', json.message || 'Profile update failed.');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'API request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Change Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      triggerAlert('error', 'Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      });
      const json = await res.json();
      if (json.success) {
        triggerAlert('success', 'Password updated successfully.');
        setPasswordForm({ oldPassword: '', newPassword: '' });
      } else {
        triggerAlert('error', json.message || 'Password update failed.');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'API request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete generic item
  const handleDeleteItem = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setData(prev => ({
          ...prev,
          [type]: prev[type].filter(item => item.id !== id)
        }));
        triggerAlert('success', 'Item deleted successfully.');
      } else {
        triggerAlert('error', json.message || 'Delete failed.');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Delete operation failed.');
    }
  };

  // Add Item Form Submit
  const handleAddItem = async (e, type) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...formState };
      // Format items array or highlights array or tech array
      if (type === 'skills') {
        payload.items = payload.items.split(',').map(s => s.trim());
      } else if (type === 'projects') {
        payload.tech = payload.tech.split(',').map(s => s.trim());
      } else if (type === 'experience') {
        payload.highlights = payload.highlights.split('\n').filter(s => s.trim() !== '');
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setData(prev => ({
          ...prev,
          [type]: [...prev[type], json.data]
        }));
        setShowAddForm(null);
        setFormState({});
        triggerAlert('success', 'Added successfully.');
      } else {
        triggerAlert('error', json.message || 'Add failed.');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Add operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Save Edit Item
  const handleSaveEdit = async (e, type) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...editingItem.item };
      // Format items/highlights/tech
      if (type === 'skills' && typeof payload.items === 'string') {
        payload.items = payload.items.split(',').map(s => s.trim());
      } else if (type === 'projects' && typeof payload.tech === 'string') {
        payload.tech = payload.tech.split(',').map(s => s.trim());
      } else if (type === 'experience' && typeof payload.highlights === 'string') {
        payload.highlights = payload.highlights.split('\n').filter(s => s.trim() !== '');
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/${type}/${payload.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setData(prev => ({
          ...prev,
          [type]: prev[type].map(item => item.id === payload.id ? json.data : item)
        }));
        setEditingItem(null);
        triggerAlert('success', 'Updated successfully.');
      } else {
        triggerAlert('error', json.message || 'Update failed.');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Update operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex flex-col items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary mb-4" />
        <span className="text-sm text-gray-500 uppercase tracking-widest">Loading Dashboard...</span>
      </div>
    );
  }

  const navTabs = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'skills', label: 'Skills', icon: <GraduationCap size={16} /> },
    { id: 'projects', label: 'Projects', icon: <Award size={16} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={16} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={16} /> },
    { id: 'certifications', label: 'Certifications', icon: <CertificateIcon size={16} /> },
    { id: 'awards', label: 'Awards', icon: <Award size={16} /> },
    { id: 'leads', label: `Leads (${leads.length})`, icon: <Mail size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col lg:flex-row relative overflow-hidden">
      {/* Sidebar decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Sidebar Nav */}
      <aside className="w-full lg:w-64 bg-[#030014]/60 border-b lg:border-b-0 lg:border-r border-white/5 p-6 flex flex-col justify-between shrink-0 z-20 backdrop-blur-md">
        <div>
          {/* User Profile Card */}
          <div className="flex flex-col items-center text-center pb-8 border-b border-white/5 mb-6">
            <div className="relative w-20 h-20 mb-3 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <img src="/kuldeep.jpg" alt="Kuldeep" className="w-full h-full object-cover rounded-full border border-[#030014]" />
              <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#030014] animate-pulse" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white block leading-tight">Kuldeep Mahajan</span>
            <span className="text-[9px] uppercase tracking-widest text-primary font-bold mt-1 block">Administrator</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setEditingItem(null);
                  setShowAddForm(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all text-left ${
                  activeTab === tab.id
                    ? 'text-white bg-primary/20 border-l-2 border-primary shadow-sm font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Action button */}
        <div className="pt-6 border-t border-white/5 mt-6 lg:mt-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Dashboard Workspace */}
      <main className="flex-grow p-6 lg:p-10 z-10 overflow-y-auto max-h-screen">
        
        {/* Floating status alert popup */}
        {message.text && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm shadow-2xl animate-slideIn ${
            message.type === 'success' 
              ? 'bg-green-500/15 border-green-500/30 text-green-400' 
              : 'bg-red-500/15 border-red-500/30 text-red-400'
          }`}>
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab Title Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <h2 className="text-2xl font-extrabold capitalize text-white flex items-center gap-2">
            {activeTab.replace('-', ' ')} Manager
          </h2>
          <a
            href="/"
            className="text-xs text-primary font-bold hover:text-white transition-colors"
          >
            Visit Live Site &rarr;
          </a>
        </div>

        {/* Tab Content Components */}
        
        {/* A. Profile Tab */}
        {activeTab === 'profile' && data.profile && (
          <form onSubmit={handleProfileSubmit} className="glass-panel border border-white/10 p-6 sm:p-8 rounded-2xl space-y-6 max-w-4xl shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-white/5">
              <div className="w-20 h-20 rounded-2xl border border-white/10 overflow-hidden shadow-lg shrink-0">
                <img src="/kuldeep.jpg" alt="Kuldeep" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Edit Basic Profile Details</h3>
                <p className="text-xs text-gray-500 font-light mt-1">Manage public landing page details and personal contact channels.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase block">Name</label>
                <input
                  type="text"
                  value={data.profile.name || ''}
                  onChange={e => setData({ ...data, profile: { ...data.profile, name: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase block">Role Title</label>
                <input
                  type="text"
                  value={data.profile.role || ''}
                  onChange={e => setData({ ...data, profile: { ...data.profile, role: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase block">Location</label>
                <input
                  type="text"
                  value={data.profile.location || ''}
                  onChange={e => setData({ ...data, profile: { ...data.profile, location: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase block">Email Address</label>
                <input
                  type="email"
                  value={data.profile.email || ''}
                  onChange={e => setData({ ...data, profile: { ...data.profile, email: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase block">Phone Number</label>
                <input
                  type="text"
                  value={data.profile.phone || ''}
                  onChange={e => setData({ ...data, profile: { ...data.profile, phone: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase block">Languages (Comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(data.profile.languages) ? data.profile.languages.join(', ') : data.profile.languages || ''}
                  onChange={e => setData({ ...data, profile: { ...data.profile, languages: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase block">Resume Link</label>
              <input
                type="url"
                value={data.profile.resumeLink || ''}
                onChange={e => setData({ ...data, profile: { ...data.profile, resumeLink: e.target.value } })}
                placeholder="https://drive.google.com/..."
                className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase block">Professional Summary</label>
              <textarea
                rows={5}
                value={data.profile.summary || ''}
                onChange={e => setData({ ...data, profile: { ...data.profile, summary: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={14} />}
              <span>Save Changes</span>
            </button>
          </form>
        )}

        {/* B. Settings Tab */}
        {activeTab === 'settings' && (
          <form onSubmit={handlePasswordSubmit} className="glass-panel border border-white/10 p-6 sm:p-8 rounded-2xl space-y-5 max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              Security Settings <Settings size={18} className="text-primary" />
            </h3>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase block">Old Password</label>
              <input
                type="password"
                value={passwordForm.oldPassword}
                onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase block">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm hover:opacity-90 transition-all cursor-pointer mt-2"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={14} />}
              <span>Update Password</span>
            </button>
          </form>
        )}

        {/* C. Leads (Form Submissions) Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {leads.length === 0 ? (
              <div className="glass-panel border border-white/5 p-10 text-center rounded-2xl">
                <Mail size={32} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No lead submissions found yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {leads.map(lead => (
                  <div key={lead.id} className="glass-panel border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="space-y-2.5 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h4 className="text-base font-bold text-white">{lead.name}</h4>
                        <span className="text-xs text-gray-500 font-light">
                          {new Date(lead.submitted_at || lead.submittedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-primary font-bold">
                        <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                        {lead.phone && <a href={`tel:${lead.phone}`} className="text-secondary hover:underline">{lead.phone}</a>}
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed font-light">{lead.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* D. CRUD Tabs (Skills, Projects, Experience, Education, Certifications, Awards) */}
        {['skills', 'projects', 'experience', 'education', 'certifications', 'awards'].includes(activeTab) && (
          <div className="space-y-6">
            
            {/* Add Button Row */}
            {!showAddForm && !editingItem && (
              <button
                onClick={() => {
                  setShowAddForm(activeTab);
                  setFormState({});
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/80 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add New {activeTab.slice(0, -1)}</span>
              </button>
            )}

            {/* Form 1: Add Item Panel */}
            {showAddForm === activeTab && (
              <form onSubmit={(e) => handleAddItem(e, activeTab)} className="glass-panel border border-white/10 p-6 sm:p-8 rounded-2xl space-y-5 max-w-2xl shadow-2xl animate-fadeIn">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <h3 className="text-lg font-bold text-white">Add New {activeTab.slice(0, -1)}</h3>
                  <button type="button" onClick={() => setShowAddForm(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
                </div>

                {/* Dynamic Input Fields based on Category */}
                {activeTab === 'skills' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Skill Category</label>
                      <input type="text" placeholder="e.g. Languages" onChange={e => setFormState({ ...formState, category: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Skills List (Comma separated)</label>
                      <input type="text" placeholder="e.g. Python, JavaScript, SQL" onChange={e => setFormState({ ...formState, items: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" required />
                    </div>
                  </>
                )}

                {activeTab === 'projects' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Project Title</label>
                      <input type="text" placeholder="e.g. Portfolio Builder" onChange={e => setFormState({ ...formState, title: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Description</label>
                      <textarea rows={4} placeholder="Description details..." onChange={e => setFormState({ ...formState, description: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 resize-none" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Technologies (Comma separated)</label>
                      <input type="text" placeholder="e.g. React, PostgreSQL, Node.js" onChange={e => setFormState({ ...formState, tech: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Live Demo Link</label>
                        <input type="text" placeholder="e.g. https://example.com" onChange={e => setFormState({ ...formState, link: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">GitHub Link</label>
                        <input type="text" placeholder="e.g. https://github.com" onChange={e => setFormState({ ...formState, github: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'experience' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Role Title</label>
                        <input type="text" placeholder="e.g. Power Platform Intern" onChange={e => setFormState({ ...formState, role: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Company</label>
                        <input type="text" placeholder="e.g. Microsoft" onChange={e => setFormState({ ...formState, company: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Location</label>
                        <input type="text" placeholder="e.g. Pune, India" onChange={e => setFormState({ ...formState, location: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Period</label>
                        <input type="text" placeholder="e.g. Jan 2024 - Present" onChange={e => setFormState({ ...formState, period: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Highlights Bullet Points (One per line)</label>
                      <textarea rows={5} placeholder="Highlight item 1&#10;Highlight item 2" onChange={e => setFormState({ ...formState, highlights: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none resize-none" required />
                    </div>
                  </>
                )}

                {activeTab === 'education' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Degree / Certification</label>
                        <input type="text" placeholder="e.g. MCA" onChange={e => setFormState({ ...formState, degree: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Institution</label>
                        <input type="text" placeholder="e.g. Pune University" onChange={e => setFormState({ ...formState, institution: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Location</label>
                        <input type="text" placeholder="e.g. Pune, India" onChange={e => setFormState({ ...formState, location: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Period</label>
                        <input type="text" placeholder="e.g. 2022 - 2024" onChange={e => setFormState({ ...formState, period: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Details</label>
                      <textarea rows={3} placeholder="Specialized in Web Application Development..." onChange={e => setFormState({ ...formState, details: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none resize-none" required />
                    </div>
                  </>
                )}

                {activeTab === 'certifications' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Certification Name</label>
                      <input type="text" placeholder="e.g. Power Platform App Maker" onChange={e => setFormState({ ...formState, name: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Issuer</label>
                        <input type="text" placeholder="e.g. Microsoft" onChange={e => setFormState({ ...formState, issuer: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Date</label>
                        <input type="text" placeholder="e.g. 2024" onChange={e => setFormState({ ...formState, date: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Description</label>
                      <textarea rows={3} placeholder="Course highlights..." onChange={e => setFormState({ ...formState, description: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none resize-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Credential Link</label>
                      <input type="text" placeholder="e.g. https://creds.com" onChange={e => setFormState({ ...formState, link: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" />
                    </div>
                  </>
                )}

                {activeTab === 'awards' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Award Title</label>
                      <input type="text" placeholder="e.g. Best Developer" onChange={e => setFormState({ ...formState, title: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Organization</label>
                        <input type="text" placeholder="e.g. CSI Club" onChange={e => setFormState({ ...formState, organization: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Date Received</label>
                        <input type="text" placeholder="e.g. 2023" onChange={e => setFormState({ ...formState, date: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Description</label>
                      <textarea rows={3} placeholder="Award details..." onChange={e => setFormState({ ...formState, description: e.target.value })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none resize-none" />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={14} />}
                  <span>Save Record</span>
                </button>
              </form>
            )}

            {/* Form 2: Edit Item Panel */}
            {editingItem && editingItem.type === activeTab && (
              <form onSubmit={(e) => handleSaveEdit(e, activeTab)} className="glass-panel border border-white/10 p-6 sm:p-8 rounded-2xl space-y-5 max-w-2xl shadow-2xl animate-fadeIn">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <h3 className="text-lg font-bold text-white">Edit {activeTab.slice(0, -1)}</h3>
                  <button type="button" onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
                </div>

                {activeTab === 'skills' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Skill Category</label>
                      <input type="text" value={editingItem.item.category} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, category: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Skills List (Comma separated)</label>
                      <input type="text" value={Array.isArray(editingItem.item.items) ? editingItem.item.items.join(', ') : editingItem.item.items} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, items: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                    </div>
                  </>
                )}

                {activeTab === 'projects' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Project Title</label>
                      <input type="text" value={editingItem.item.title} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, title: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Description</label>
                      <textarea rows={4} value={editingItem.item.description} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, description: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none resize-none" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Technologies (Comma separated)</label>
                      <input type="text" value={Array.isArray(editingItem.item.tech) ? editingItem.item.tech.join(', ') : editingItem.item.tech} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, tech: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Live Demo Link</label>
                        <input type="text" value={editingItem.item.link || ''} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, link: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">GitHub Link</label>
                        <input type="text" value={editingItem.item.github || ''} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, github: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'experience' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Role Title</label>
                        <input type="text" value={editingItem.item.role} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, role: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Company</label>
                        <input type="text" value={editingItem.item.company} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, company: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Location</label>
                        <input type="text" value={editingItem.item.location} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, location: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Period</label>
                        <input type="text" value={editingItem.item.period} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, period: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Highlights (One per line)</label>
                      <textarea rows={5} value={Array.isArray(editingItem.item.highlights) ? editingItem.item.highlights.join('\n') : editingItem.item.highlights} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, highlights: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white resize-none" required />
                    </div>
                  </>
                )}

                {activeTab === 'education' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Degree</label>
                        <input type="text" value={editingItem.item.degree} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, degree: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Institution</label>
                        <input type="text" value={editingItem.item.institution} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, institution: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Location</label>
                        <input type="text" value={editingItem.item.location} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, location: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Period</label>
                        <input type="text" value={editingItem.item.period} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, period: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Details</label>
                      <textarea rows={3} value={editingItem.item.details || ''} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, details: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white resize-none" required />
                    </div>
                  </>
                )}

                {activeTab === 'certifications' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Certification Name</label>
                      <input type="text" value={editingItem.item.name} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, name: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Issuer</label>
                        <input type="text" value={editingItem.item.issuer} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, issuer: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Date</label>
                        <input type="text" value={editingItem.item.date} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, date: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Description</label>
                      <textarea rows={3} value={editingItem.item.description || ''} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, description: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white resize-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Credential Link</label>
                      <input type="text" value={editingItem.item.link || ''} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, link: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" />
                    </div>
                  </>
                )}

                {activeTab === 'awards' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Award Title</label>
                      <input type="text" value={editingItem.item.title} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, title: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Organization</label>
                        <input type="text" value={editingItem.item.organization} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, organization: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">Date</label>
                        <input type="text" value={editingItem.item.date} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, date: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">Description</label>
                      <textarea rows={3} value={editingItem.item.description || ''} onChange={e => setEditingItem({ ...editingItem, item: { ...editingItem.item, description: e.target.value } })} className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white resize-none" />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={14} />}
                  <span>Save Updates</span>
                </button>
              </form>
            )}

            {/* List Table of Items */}
            {!showAddForm && !editingItem && (
              <div className="grid grid-cols-1 gap-4">
                {data[activeTab] && data[activeTab].length === 0 ? (
                  <div className="glass-panel border border-white/5 p-10 text-center rounded-2xl">
                    <ShieldAlert size={28} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No items configured in {activeTab}.</p>
                  </div>
                ) : (
                  data[activeTab].map(item => (
                    <div key={item.id} className="glass-panel border border-white/10 p-5 rounded-2xl flex justify-between items-center gap-4 hover:border-white/20 transition-all">
                      <div>
                        {activeTab === 'skills' && (
                          <>
                            <h4 className="text-base font-bold text-white mb-1">{item.category}</h4>
                            <p className="text-xs text-gray-400 font-light">{item.items.join(', ')}</p>
                          </>
                        )}
                        {activeTab === 'projects' && (
                          <>
                            <h4 className="text-base font-bold text-white mb-1">{item.title}</h4>
                            <p className="text-xs text-secondary font-bold mb-1.5">{item.tech.join(', ')}</p>
                            <p className="text-xs text-gray-400 font-light line-clamp-2">{item.description}</p>
                          </>
                        )}
                        {activeTab === 'experience' && (
                          <>
                            <h4 className="text-base font-bold text-white mb-1">{item.role}</h4>
                            <p className="text-xs text-primary font-bold mb-1">{item.company} | {item.period}</p>
                            <p className="text-xs text-gray-400 font-light line-clamp-1">{item.highlights[0]}</p>
                          </>
                        )}
                        {activeTab === 'education' && (
                          <>
                            <h4 className="text-base font-bold text-white mb-1">{item.degree}</h4>
                            <p className="text-xs text-secondary font-bold mb-1">{item.institution} ({item.period})</p>
                            <p className="text-xs text-gray-400 font-light">{item.details}</p>
                          </>
                        )}
                        {activeTab === 'certifications' && (
                          <>
                            <h4 className="text-base font-bold text-white mb-1">{item.name}</h4>
                            <p className="text-xs text-primary font-bold">{item.issuer} | {item.date}</p>
                          </>
                        )}
                        {activeTab === 'awards' && (
                          <>
                            <h4 className="text-base font-bold text-white mb-1">{item.title}</h4>
                            <p className="text-xs text-secondary font-bold">{item.organization} | {item.date}</p>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          onClick={() => setEditingItem({ type: activeTab, item: { ...item } })}
                          className="p-2 bg-white/5 border border-white/10 hover:border-primary/50 text-gray-400 hover:text-primary rounded-lg transition-all cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(activeTab, item.id)}
                          className="p-2 bg-white/5 border border-white/10 hover:border-red-500/50 text-gray-400 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
