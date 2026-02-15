import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'JUDGE') navigate('/judge');
      else if (user.role === 'POLICE') navigate('/police');
      else if (user.role === 'LAWYER') navigate('/lawyer');
      else navigate('/citizen');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left Side: Branding/Information */}
      <div className="hidden md:flex md:w-1/2 bg-primary p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-blue-800 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-blue-800 opacity-20 blur-3xl"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">NyayaConnect</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Intelligent Law & <br />Justice Management
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed opacity-80">
            A secure digital gateway for citizens, law enforcement, and the judiciary to interact with the legal system efficiently and transparently.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium opacity-80">Government Grade Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium opacity-80">End-to-End Encryption</span>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Secure Access</h2>
            <p className="text-slate-500 mt-2 font-medium">Please enter your authorized credentials to proceed.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-lg flex gap-3 animate-in fade-in duration-200">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                <p className="text-sm text-rose-800 leading-tight font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Official Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@agency.gov"
                    className="input-field pl-10 h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Authentication Password</label>
                  <a href="#" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Forgot Password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="input-field pl-10 h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary h-12 text-base shadow-lg shadow-primary/20 bg-primary"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <div className="pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              New to NyayaConnect?{' '}
              <Link to="/register" className="font-bold text-primary hover:underline">
                Register for an Account
              </Link>
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 pt-12">
            <div className="flex items-center gap-6 opacity-40">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Digital Justice Initiative</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
