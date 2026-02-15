import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Shield, FileText, BookOpen, Search, Users, UploadCloud, 
  Clock, PlusCircle, CheckCircle2, ChevronLeft, Scale, AlertCircle, Paperclip
} from 'lucide-react';
import Badge from '../components/Badge';
import { API_BASE_URL } from '../api/config';

const CaseInvestigation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseItem, setCaseItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('DIARY');
  const [diaryNote, setDiaryNote] = useState('');
  const [suspect, setSuspect] = useState({ name: '', details: '' });
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [caseRes, evRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/cases/${id}`),
        axios.get(`${API_BASE_URL}/evidence/${id}`)
      ]);
      setCaseItem(caseRes.data);
      setEvidenceFiles(evRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (endpoint, data, successMsg) => {
    try {
      await axios.post(`${API_BASE_URL}/police/${id}/${endpoint}`, data);
      fetchData();
      if (successMsg) alert(successMsg);
    } catch (err) { alert(err.response?.data?.message || 'Action failed'); }
  };

  const updateStatus = async (status) => {
    try {
      await axios.put(`${API_BASE_URL}/police/${id}/status`, { status });
      fetchData();
    } catch (err) { alert('Status update failed'); }
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400">Loading Official Workspace...</div>;
  if (!caseItem) return <div>Case not found or unauthorized.</div>;

  const c = caseItem;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/police/investigation')} className="btn btn-secondary px-3">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Roster
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{c.title}</h1>
            <p className="text-xs text-slate-500 font-mono tracking-widest">{c.caseNumber}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {c.status === 'REGISTERED' && (
            <button onClick={() => updateStatus('INVESTIGATING')} className="btn btn-primary bg-blue-600">
              <Search className="h-4 w-4 mr-2" /> Start Investigation
            </button>
          )}
          {c.status === 'INVESTIGATING' && (
            <button onClick={() => updateStatus('REPORT_SUBMITTED')} className="btn btn-primary bg-emerald-600">
              <CheckCircle2 className="h-4 w-4 mr-2" /> Submit Final Report
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-6 border-l-4 border-l-primary bg-white">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Original Filing Narrative
            </h2>
            <p className="text-slate-700 leading-relaxed italic">"{c.description}"</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200">
              {[
                { id: 'DIARY', label: 'Investigation Diary', icon: BookOpen },
                { id: 'EVIDENCE', label: 'Evidence Locker', icon: Paperclip },
                { id: 'SUSPECTS', label: 'Suspect Roster', icon: Users },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all relative ${
                    activeTab === t.id ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <t.icon className="h-4 w-4" /> {t.label}
                  {activeTab === t.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
                </button>
              ))}
            </div>

            {activeTab === 'DIARY' && (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div className="card p-6 bg-slate-50 border-slate-200 shadow-sm">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Append Investigation Note (IMMUTABLE)</label>
                  <textarea
                    className="input-field bg-white mb-4"
                    rows="3"
                    placeholder="Detail current actions, witness statements, or findings..."
                    value={diaryNote}
                    onChange={(e) => setDiaryNote(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button onClick={() => { handleAction('diary', { note: diaryNote }); setDiaryNote(''); }} className="btn btn-primary h-10 px-6">Record Entry</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {c.investigationDiary?.slice().reverse().map((entry, idx) => (
                    <div key={idx} className="card p-5 bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute left-0 top-0 w-1 h-full bg-slate-200 group-hover:bg-primary transition-all" />
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Badge status="info">Official Entry</Badge>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            Recorded by Authority
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{entry.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'EVIDENCE' && (
              <div className="grid gap-4 animate-in slide-in-from-top-2">
                <div className="grid sm:grid-cols-2 gap-4">
                  {evidenceFiles.map(ev => (
                    <div key={ev._id} className="card p-4 flex flex-col gap-4 border border-slate-100 bg-white shadow-sm hover:border-primary/20 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <Badge status={ev.relevance}>{ev.relevance}</Badge>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate mb-1">{ev.filePath}</p>
                        <p className="text-[9px] font-mono text-slate-400">HASH: {ev.fileHash.substring(0, 24)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'SUSPECTS' && (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div className="card p-6 bg-slate-50 border-slate-200 grid sm:grid-cols-2 gap-4 shadow-sm">
                  <div className="sm:col-span-2"><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enroll New Suspect</h3></div>
                  <input className="input-field bg-white" placeholder="Full Legal Name" value={suspect.name} onChange={(e) => setSuspect({...suspect, name: e.target.value})} />
                  <input className="input-field bg-white" placeholder="Contact / Identification" value={suspect.details} onChange={(e) => setSuspect({...suspect, details: e.target.value})} />
                  <div className="sm:col-span-2 flex justify-end">
                    <button onClick={() => { handleAction('suspects', suspect); setSuspect({ name: '', details: '' }); }} className="btn btn-primary h-10 px-8">Add to File</button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {c.suspects?.map((s, idx) => (
                    <div key={idx} className="card p-5 flex items-center justify-between border-slate-100 bg-white hover:border-rose-200 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 font-bold border border-rose-100 group-hover:bg-rose-600 group-hover:text-white transition-all">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Added On</p>
                        <p className="text-xs font-medium text-slate-600">{new Date(s.addedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-slate-900 text-white p-6 sticky top-24 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2 relative z-10">
              <Shield className="h-4 w-4 text-primary" /> System Sovereignty
            </h3>
            
            <div className="space-y-8 relative z-10">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Assignment Phase</label>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xl font-bold tracking-tight uppercase">{c.status}</span>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium text-xs">Petitioner</span>
                  <span className="font-bold text-xs truncate max-w-[120px]">{c.createdBy?.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium text-xs">Registry Bench</span>
                  <Badge status="trial">District Court</Badge>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-3">
                <button className="w-full btn btn-secondary bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs py-3 uppercase tracking-widest font-bold">
                  <AlertCircle className="h-4 w-4 mr-2" /> Request Aid
                </button>
                <button className="w-full btn btn-secondary bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs py-3 uppercase tracking-widest font-bold">
                  <Scale className="h-4 w-4 mr-2" /> View Laws
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseInvestigation;
