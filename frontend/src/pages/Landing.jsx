import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  // eslint-disable-next-line no-unused-vars
  motion, 
  useScroll 
} from 'motion/react';
import { 
  Scale, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Gavel, 
  Building2, 
  UserCircle2, 
  Lock,
  ChevronRight,
  Database,
  Search,
  CheckCircle2,
  LockKeyhole,
  ExternalLink,
  Globe
} from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollY.on('change', (latest) => {
            setIsScrolled(latest > 50);
        });
        return () => unsubscribe();
    }, [scrollY]);

    const handleAction = () => {
        if (user) {
            const role = user.role;
            if (role === 'ADMIN') navigate('/admin');
            else if (role === 'JUDGE') navigate('/judge');
            else if (role === 'POLICE') navigate('/police');
            else if (role === 'LAWYER') navigate('/lawyer');
            else navigate('/citizen');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-primary selection:text-white">
            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-lg border-b border-slate-100' : 'bg-transparent py-5'
            }`}>
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                    <div className="flex justify-between items-center">
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-2.5 group cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <div className="bg-primary rounded-xl p-1.5 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                <Scale className="h-6 w-6 text-white" />
                            </div>
                            <span className={`text-2xl font-black tracking-tight transition-colors ${
                                isScrolled ? 'text-slate-900' : 'text-white'
                            }`}>NyayaConnect</span>
                        </motion.div>
                        
                        <div className="hidden md:flex items-center gap-8">
                            {['Features', 'Security', 'About'].map((item) => (
                                <a 
                                    key={item} 
                                    href={`#${item.toLowerCase()}`}
                                    className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-primary ${
                                        isScrolled ? 'text-slate-600' : 'text-slate-300'
                                    }`}
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-4"
                        >
                            {user ? (
                                <button 
                                    onClick={handleAction}
                                    className="bg-primary hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl shadow-primary/20 flex items-center gap-2 active:scale-95"
                                >
                                    Dashboard <ArrowRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <>
                                    <Link to="/login" className={`text-sm font-bold transition-colors ${
                                        isScrolled ? 'text-slate-700 hover:text-primary' : 'text-white hover:text-blue-200'
                                    }`}>Sign In</Link>
                                    <Link 
                                        to="/register"
                                        className="bg-white text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl hover:bg-blue-50 active:scale-95"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden bg-[#0a0f1d] text-white">
                    {/* Dynamic Background */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/30 blur-[150px] rounded-full animate-pulse"></div>
                        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full"></div>
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10 text-center">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10"
                        >
                            <ShieldCheck className="h-4 w-4 text-blue-500" /> Next-Gen Judicial Portal
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-6xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.9] lg:leading-[0.85]"
                        >
                            REDEFINING <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">JUDICIAL TRUST</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="max-w-3xl mx-auto text-lg lg:text-2xl text-slate-400 font-medium leading-relaxed mb-16 opacity-90"
                        >
                            A unified, high-security ecosystem connecting citizens, law enforcement, and courts through tamper-proof digital infrastructure.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <button 
                                onClick={handleAction}
                                className="group relative w-full sm:w-auto px-10 py-5 bg-primary hover:bg-blue-800 text-white rounded-2xl font-black text-xl transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95"
                            >
                                START INVESTIGATION <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <a 
                                href="#features"
                                className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xl transition-all border border-white/10 backdrop-blur-sm flex items-center justify-center gap-3 active:scale-95"
                            >
                                SYSTEM ARCHITECTURE
                            </a>
                        </motion.div>
                    </div>

                    {/* Stats Section */}
                    <div className="max-w-7xl mx-auto px-6 mt-32 relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-white/10">
                            {[
                                { label: 'Cases Resolved', val: '24k+' },
                                { label: 'Secure Uploads', val: '1.2M' },
                                { label: 'Active Agencies', val: '450+' },
                                { label: 'Uptime', val: '99.9%' }
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-3xl lg:text-4xl font-black text-white mb-1">{stat.val}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Role Cards - Bento Style */}
                <section className="py-32 bg-white" id="features">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                            <div className="max-w-2xl">
                                <div className="text-primary font-black uppercase tracking-widest text-sm mb-4">Unified Ecosystem</div>
                                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-none">BUILT FOR EVERY <br />PARTICIPANT</h2>
                            </div>
                            <p className="text-slate-500 font-medium text-lg max-w-sm">
                                Specialized dashboards designed to streamline complex legal workflows with precision and speed.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            {/* Police Card - Large */}
                            <motion.div 
                                whileHover={{ y: -10 }}
                                className="md:col-span-2 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between overflow-hidden relative group"
                            >
                                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                    <ShieldCheck className="h-64 w-64" />
                                </div>
                                <div className="relative z-10">
                                    <div className="bg-primary/10 text-primary p-3 rounded-2xl w-fit mb-8">
                                        <ShieldCheck className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">Law Enforcement</h3>
                                    <p className="text-slate-500 text-lg max-w-md leading-relaxed">
                                        Field-optimized evidence submission with automated chain-of-custody logging and instant agency verification.
                                    </p>
                                </div>
                                <div className="mt-12 flex items-center gap-4 text-primary font-black text-sm uppercase tracking-widest cursor-pointer group-hover:gap-6 transition-all">
                                    Learn More <ArrowRight className="h-5 w-5" />
                                </div>
                            </motion.div>

                            {/* Judge Card */}
                            <motion.div 
                                whileHover={{ y: -10 }}
                                className="p-10 bg-[#0a0f1d] text-white rounded-[2.5rem] flex flex-col justify-between"
                            >
                                <div>
                                    <div className="bg-white/10 p-3 rounded-2xl w-fit mb-8">
                                        <Gavel className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">Judiciary</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Accelerated case review with AI-assisted document summarization and verified evidence timelines.
                                    </p>
                                </div>
                                <div className="mt-12 text-blue-400 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                    Dashboard <ExternalLink className="h-4 w-4" />
                                </div>
                            </motion.div>

                            {/* Lawyer Card */}
                            <motion.div 
                                whileHover={{ y: -10 }}
                                className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl w-fit mb-8">
                                        <Building2 className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">Legal Counsel</h3>
                                    <p className="text-slate-500 leading-relaxed">
                                        Simplified e-filing, secure case discovery, and collaborative tools for modern legal practices.
                                    </p>
                                </div>
                                <div className="mt-12 text-emerald-600 font-black text-sm uppercase tracking-widest">
                                    Request Access
                                </div>
                            </motion.div>

                            {/* Citizen Card - Large */}
                            <motion.div 
                                whileHover={{ y: -10 }}
                                className="md:col-span-2 p-10 bg-primary rounded-[2.5rem] text-white relative overflow-hidden group"
                            >
                                <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <Users className="h-48 w-48" />
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between h-full gap-8">
                                    <div className="max-w-md">
                                        <div className="bg-white/20 p-3 rounded-2xl w-fit mb-8">
                                            <UserCircle2 className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-3xl font-black mb-4 text-white">Public Justice</h3>
                                        <p className="text-blue-100 text-lg leading-relaxed">
                                            Transparent case tracking, online petition filing, and instant access to public records for every citizen.
                                        </p>
                                    </div>
                                    <button className="bg-white text-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-50 transition-colors shadow-xl">
                                        Register Profile
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Core Tech Detail */}
                <section className="py-32 bg-slate-50" id="security">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="bg-[#0a0f1d] rounded-[3.5rem] p-10 lg:p-20 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-primary/20 blur-[150px] rounded-full"></div>
                            
                            <div className="flex flex-col lg:flex-row gap-20 relative z-10">
                                <div className="lg:w-1/2">
                                    <div className="text-blue-400 font-black uppercase tracking-widest text-xs mb-6">Security & Integrity</div>
                                    <h2 className="text-4xl lg:text-6xl font-black text-white mb-10 leading-none">TAMPER-PROOF <br />BY ARCHITECTURE</h2>
                                    
                                    <div className="space-y-10">
                                        {[
                                            { icon: LockKeyhole, title: 'SHA-256 Hashing', desc: 'Every file receives a unique cryptographic signature, making alterations detectable instantly.' },
                                            { icon: Database, title: 'Immutable Logs', desc: 'System-wide audit trails that cannot be modified, even by system administrators.' },
                                            { icon: Globe, title: 'Geographic Redundancy', desc: 'Data mirrored across multiple secure nodes to prevent loss or censorship.' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-6 group">
                                                <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-primary/20 transition-colors border border-white/10 shrink-0 h-fit">
                                                    <item.icon className="h-6 w-6 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-black text-white mb-2">{item.title}</h4>
                                                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:w-1/2 flex items-center justify-center">
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        className="w-full max-w-lg aspect-square bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center relative"
                                    >
                                        <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
                                        <div className="absolute inset-8 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                        <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl relative z-10 w-[80%]">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="h-3 w-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50"></div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Core</div>
                                            </div>
                                            <div className="space-y-3 font-mono text-[11px]">
                                                <p className="text-blue-400">$ integrity_check --file case_EVD_01.pdf</p>
                                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                                    <p className="text-slate-400">HASH: 8f92b...e301a</p>
                                                    <p className="text-slate-400">STATUS: VERIFIED</p>
                                                </div>
                                                <p className="text-emerald-400 flex items-center gap-2">
                                                    <CheckCircle2 className="h-3 w-3" /> Chain of Custody Locked
                                                </p>
                                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        animate={{ x: ['-100%', '100%'] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className="h-full w-1/2 bg-blue-500"
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-40 bg-white overflow-hidden">
                    <div className="max-w-5xl mx-auto px-6 text-center relative">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-none">JOIN THE FUTURE <br />OF JUSTICE</h2>
                            <p className="text-xl text-slate-500 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
                                Accelerate institutional efficiency and provide transparent judicial access with NyayaConnect.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <button 
                                    onClick={handleAction}
                                    className="w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-[2rem] font-black text-xl hover:bg-blue-800 transition-all shadow-2xl shadow-primary/30 active:scale-95"
                                >
                                    GET STARTED
                                </button>
                                <Link to="/register" className="w-full sm:w-auto px-12 py-6 bg-slate-50 text-slate-900 rounded-[2rem] font-black text-xl hover:bg-slate-100 transition-all border border-slate-200 active:scale-95">
                                    CREATE ACCOUNT
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <footer className="bg-[#0a0f1d] text-slate-500 py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-20">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2.5 mb-8">
                                <div className="bg-primary rounded-xl p-1.5 shadow-lg shadow-primary/20">
                                    <Scale className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-2xl font-black tracking-tight text-white">NyayaConnect</span>
                            </div>
                            <p className="text-lg font-medium leading-relaxed max-w-sm mb-10">
                                Bridging the gap in fragmented judicial systems through unified, secure, and intelligent digital infrastructure.
                            </p>
                            <div className="flex gap-4">
                                {[1,2,3].map(i => (
                                    <div key={i} className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                                        <Globe className="h-5 w-5 text-white" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Navigation</h4>
                            <ul className="space-y-4 font-bold">
                                <li><a href="#" className="hover:text-primary transition-colors">Case Vault</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Digital Evidence</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Legal AI</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Court API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Institutional</h4>
                            <ul className="space-y-4 font-bold">
                                <li><a href="#" className="hover:text-primary transition-colors">Security Specs</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">System Status</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Contact Gov</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-bold uppercase tracking-[0.2em]">
                        <p>© 2026 NyayaConnect. Secure Institutional Infrastructure.</p>
                        <div className="flex gap-8">
                            <span className="flex items-center gap-2 text-emerald-500"><ShieldCheck className="h-4 w-4" /> Agency Verified</span>
                            <span className="text-slate-600">v2.4.0-Stable</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
