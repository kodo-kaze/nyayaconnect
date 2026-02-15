import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, User, Mail, Phone, ShieldCheck, Briefcase, Gavel, UserCog } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CITIZEN',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await register(formData);
      navigate('/citizen');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    { value: 'CITIZEN', label: 'Citizen', icon: User },
    { value: 'POLICE', label: 'Law Enforcement', icon: ShieldCheck },
    { value: 'LAWYER', label: 'Legal Counsel', icon: Briefcase },
    { value: 'JUDGE', label: 'Judiciary', icon: Gavel },
    { value: 'ADMIN', label: 'Administrator', icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side: Branding (Smaller for Register) */}
      <div className="hidden lg:flex lg:w-1/3 bg-slate-900 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <Scale className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">NyayaConnect</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight mb-4 italic">Join the Justice Portal</h1>
          <p className="text-slate-400 leading-relaxed">
            Create your digital identity to access legal services, manage cases, and interact with judicial authorities.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-medium text-slate-300">Identity verification required for official access.</p>
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-xl space-y-8 py-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Account Registration</h2>
            <p className="text-slate-500 mt-2 font-medium">Register your profile within the National Law & Justice Management Platform.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-lg flex gap-3">
                <p className="text-sm text-rose-800 font-medium">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Full Legal Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="input-field pl-10 h-12"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="input-field pl-10 h-12"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    name="phone"
                    type="text"
                    required
                    placeholder="+91 00000 00000"
                    className="input-field pl-10 h-12"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Security Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  className="input-field h-12"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">Select Your Official Role</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.value })}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        formData.role === role.value 
                          ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      <role.icon className={`h-5 w-5 mb-2 ${formData.role === role.value ? 'text-primary' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary h-12 text-base shadow-lg shadow-primary/20 bg-primary"
            >
              {isSubmitting ? 'Processing Registration...' : 'Create Official Profile'}
            </button>
          </form>

          <div className="pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already registered with NyayaConnect?{' '}
              <Link to="/login" className="font-bold text-primary hover:underline">
                Sign In to Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
