import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect to admin dashboard
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('Login request error:', err);
      setError('Failed to connect to the authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md glass-panel border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10 animate-fadeIn">
        
        {/* Brand/Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(139,92,246,0.15)] glow-primary">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
            Admin Panel <Shield size={18} className="text-primary" />
          </h1>
          <p className="text-xs text-gray-500 mt-1.5 font-light">
            Secure login for Kuldeep Mahajan
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6 animate-fadeIn">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                placeholder="Enter your username"
                className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:opacity-90 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:shadow-none transition-all cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            &larr; Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
