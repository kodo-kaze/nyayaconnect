import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, User, Mail, Phone, ShieldCheck, Briefcase, Gavel, UserCog, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('CITIZEN');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
    badgeID: '', barCouncilNo: '', idCardImage: ''
  });
  const [step, setStep] = useState('FORM'); // 'FORM' or 'SUCCESS'
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const type = role === 'CITIZEN' ? 'citizen' : 'official';
      const data = { ...formData, role };
      const res = await register(data, type);
      if (res.simulatedOTP) alert(`[DEMO ONLY] Registration OTP is: ${res.simulatedOTP}`);
      setStep('SUCCESS');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    { value: 'CITIZEN', label: 'Citizen', icon: User, desc: 'File complaints & track cases' },
    { value: 'POLICE', label: 'Police', icon: ShieldCheck, desc: 'Manage investigations' },
    { value: 'LAWYER', label: 'Lawyer', icon: Briefcase, desc: 'Legal representation' },
  ];

  if (step === 'SUCCESS') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="card max-w-md w-full p-8 text-center animate-in zoom-in duration-300">
          <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Submitted</h2>
          <p className="text-slate-500 mb-8">
            {role === 'CITIZEN' 
              ? 'Please proceed to login and verify your phone number via OTP.' 
              : 'Your official credentials have been sent for Admin verification. You will be notified once approved.'}
          </p>
          <Link to="/login" className="btn btn-primary w-full h-12">Return to Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Sidebar */}
      <div className="lg:w-1/3 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight">NyayaConnect</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-6">Join the Digital Justice Ecosystem</h1>
          <p className="text-slate-400 leading-relaxed mb-8">
            Securely register your profile to access specialized judicial tools and case management services.
          </p>
          
          <div className="space-y-4">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  role === r.value ? 'border-primary bg-primary/10 text-white' : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <r.icon className={`h-6 w-6 ${role === r.value ? 'text-primary' : 'text-slate-500'}`} />
                <div>
                  <p className="font-bold text-sm">{r.label}</p>
                  <p className="text-[10px] opacity-60 uppercase tracking-wider">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-xl space-y-8 py-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2">Registering as a <span className="font-bold text-primary">{role.toLowerCase()}</span></p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-lg flex gap-3 text-sm text-rose-800 font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Full Legal Name</label>
                <input name="name" type="text" required className="input-field h-12" value={formData.name} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Official Email</label>
                <input name="email" type="email" required className="input-field h-12" value={formData.email} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                <input name="phone" type="text" required className="input-field h-12" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="md:col-span-2 border-t border-slate-100 pt-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Security Password</label>
                <input name="password" type="password" required className="input-field h-12" value={formData.password} onChange={handleChange} />
              </div>

              {/* Conditional Role Fields */}
              {role === 'POLICE' && (
                <div className="md:col-span-2 bg-blue-50/50 p-6 rounded-xl border border-blue-100 space-y-4 animate-in slide-in-from-top-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest mb-1.5">Official Badge ID</label>
                    <input name="badgeID" type="text" required className="input-field h-12 bg-white" placeholder="e.g. POL-12345" value={formData.badgeID} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest mb-1.5">ID Card Image URL</label>
                    <div className="relative">
                      <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input name="idCardImage" type="text" required className="input-field h-12 bg-white" placeholder="https://path-to-image.com" value={formData.idCardImage} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              )}

              {role === 'LAWYER' && (
                <div className="md:col-span-2 bg-amber-50/50 p-6 rounded-xl border border-amber-100 animate-in slide-in-from-top-4">
                  <label className="block text-xs font-bold text-amber-700 uppercase tracking-widest mb-1.5">Bar Council Registration No.</label>
                  <input name="barCouncilNo" type="text" required className="input-field h-12 bg-white" placeholder="e.g. BAR/2024/001" value={formData.barCouncilNo} onChange={handleChange} />
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary h-12 text-base shadow-lg shadow-primary/20">
              {isSubmitting ? 'Processing...' : 'Submit Registration Request'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          <div className="pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
