import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${import.meta.env.VITE_FRONTEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        if (data.devOtp) {
          alert(`[DEVELOPMENT MODE] Your OTP is: ${data.devOtp}\n\n(This appears because email credentials are not configured in your .env file)`);
        }
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${import.meta.env.VITE_FRONTEND_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setStep(3);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${import.meta.env.VITE_FRONTEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset successful. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[80px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/10 blur-[80px] -z-10 rounded-full"></div>
        
        <h2 className="text-3xl font-light text-center text-stone-900 dark:text-white mb-2 uppercase tracking-widest">
          Reset <span className="font-serif italic text-yellow-500 lowercase">Password</span>
        </h2>
        
        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-center text-sm font-medium">{error}</div>}
        {message && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-center text-sm font-medium">{message}</div>}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6 mt-8">
            <p className="text-stone-600 dark:text-gray-400 text-sm font-light text-center">Enter your registered email to receive an OTP.</p>
            <div>
              <label className="block text-sm font-medium text-stone-600 dark:text-gray-300 mb-2 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-black/50 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all text-stone-900 dark:text-white font-light placeholder-gray-600"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-yellow-500 hover:bg-black hover:text-white dark:hover:bg-yellow-500 dark:hover:text-black text-black font-bold uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <div className="text-center mt-4">
              <Link to="/login" className="text-stone-600 dark:text-gray-400 hover:text-black dark:hover:text-yellow-500 text-sm font-light transition-colors">Back to Login</Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6 mt-8">
             <p className="text-stone-600 dark:text-gray-400 text-sm font-light text-center">Enter the 6-digit OTP sent to {email}</p>
            <div>
              <label className="block text-sm font-medium text-stone-600 dark:text-gray-300 mb-2 uppercase tracking-wider">One-Time Password (OTP)</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-black/50 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all text-stone-900 dark:text-white font-light text-center tracking-[0.5em] text-xl"
                placeholder="000000"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-yellow-500 hover:bg-black hover:text-white dark:hover:bg-yellow-500 dark:hover:text-black text-black font-bold uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6 mt-8">
             <p className="text-stone-600 dark:text-gray-400 text-sm font-light text-center">Create a new password for your account.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 dark:text-gray-300 mb-2 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all text-stone-900 dark:text-white font-light placeholder-gray-600 pr-12"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 dark:text-gray-300 mb-2 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all text-stone-900 dark:text-white font-light placeholder-gray-600 pr-12"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-yellow-500 hover:bg-black hover:text-white dark:hover:bg-yellow-500 dark:hover:text-black text-black font-bold uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
