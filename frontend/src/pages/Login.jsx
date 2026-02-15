import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, KeyRound, Smartphone } from 'lucide-react';

const Login = () => {
  const [step, setStep] = useState('LOGIN'); // 'LOGIN', 'OTP', 'PWD_RESET'
  const [credentials, setCredentials] = useState({ email: '', password: '', otp: '', newPassword: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const res = await login(credentials);
      
      if (res.step === 'OTP_REQUIRED' || res.step === 'VERIFICATION_REQUIRED') {
        setStep('OTP');
      } else if (res.step === 'PWD_RESET') {
        setStep('PWD_RESET');
      } else if (res.token) {
        // Redirect based on role
        const role = res.user?.role || res.role;
        if (role === 'ADMIN') navigate('/admin');
        else if (role === 'JUDGE') navigate('/judge');
        else if (role === 'POLICE') navigate('/police');
        else if (role === 'LAWYER') navigate('/lawyer');
        else navigate('/citizen');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-primary p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Scale className="h-10 w-10 text-white" />
            <span className="text-2xl font-bold tracking-tight">NyayaConnect</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">Access the Judicial Dashboard</h1>
          <p className="text-xl text-blue-100 opacity-80 max-w-md">Secure portal for citizens, law enforcement, and judicial authorities.</p>
        </div>
        <div className="relative z-10 flex gap-8">
          <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-400" /><span className="text-sm font-medium opacity-80">Encrypted Session</span></div>
          <div className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-emerald-400" /><span className="text-sm font-medium opacity-80">Multi-Factor Auth</span></div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {step === 'LOGIN' && 'Secure Sign In'}
              {step === 'OTP' && 'Verify Identity'}
              {step === 'PWD_RESET' && 'Set New Password'}
            </h2>
            <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-[10px]">
              {step === 'LOGIN' && 'Official Digital Gateway'}
              {step === 'OTP' && 'Multi-Factor Authentication Required'}
              {step === 'PWD_RESET' && 'Judicial Mandatory Credential Update'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-lg flex gap-3 text-sm text-rose-800 font-medium animate-in fade-in">
                <AlertCircle className="h-5 w-5 shrink-0" /> {error}
              </div>
            )}

            <div className="space-y-4">
              {step === 'LOGIN' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Official Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input name="email" type="email" required placeholder="name@agency.gov" className="input-field pl-10 h-12" value={credentials.email} onChange={handleChange} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input name="password" type="password" required placeholder="••••••••" className="input-field pl-10 h-12" value={credentials.password} onChange={handleChange} />
                    </div>
                  </div>
                </>
              )}

              {step === 'OTP' && (
                <div className="animate-in slide-in-from-right-4">
                  <p className="text-sm text-slate-600 mb-4 bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    Enter the 6-digit security code sent to your registered mobile device.
                  </p>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Secure OTP Code</label>
                  <input name="otp" type="text" required placeholder="000000" className="input-field h-14 text-center text-2xl tracking-[0.5em] font-bold" maxLength="6" value={credentials.otp} onChange={handleChange} />
                </div>
              )}

              {step === 'PWD_RESET' && (
                <div className="animate-in slide-in-from-right-4 space-y-4">
                  <p className="text-sm text-slate-600 mb-4 bg-amber-50 p-4 rounded-lg border border-amber-100 flex gap-2">
                    <KeyRound className="h-5 w-5 text-amber-600" />
                    First-time login detected. You must establish a new secure password.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">New Secure Password</label>
                    <input name="newPassword" type="password" required className="input-field h-12" value={credentials.newPassword} onChange={handleChange} />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary h-12 text-base shadow-lg shadow-primary/20">
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
              ) : (
                <span className="flex items-center">
                  {step === 'LOGIN' ? 'Access Dashboard' : 'Verify & Proceed'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>

            {step !== 'LOGIN' && (
              <button type="button" onClick={() => setStep('LOGIN')} className="w-full text-xs font-bold text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">
                Back to credentials
              </button>
            )}
          </form>

          {step === 'LOGIN' && (
            <div className="pt-8 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">New to NyayaConnect? <Link to="/register" className="font-bold text-primary hover:underline">Register Official Profile</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
