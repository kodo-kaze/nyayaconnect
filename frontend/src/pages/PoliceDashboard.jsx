import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, 
  FileText, 
  BookOpen, 
  Search, 
  Users, 
  UploadCloud, 
  Clock, 
  PlusCircle, 
  CheckCircle2, 
  ChevronLeft,
  Scale,
  AlertCircle,
  Paperclip
} from 'lucide-react';
import Badge from '../components/Badge';
import { API_BASE_URL } from '../api/config';

const PoliceDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeTab, setActiveTab] = useState('DIARY'); // 'DIARY', 'EVIDENCE', 'SUSPECTS'
  const [diaryNote, setDiaryNote] = useState('');
  const [suspect, setSuspect] = useState({ name: '', details: '' });
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  useEffect(() => {
    fetchAssignedCases();
  }, []);

  const fetchAssignedCases = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/cases/my`);
      setCases(res.data);
    } catch (err) { console.error('Roster fetch error:', err); }
    finally { setLoading(false); }
  };

  const fetchCaseDetails = async (caseId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/cases/${caseId}`);
      setSelectedCase(res.data);
      const evRes = await axios.get(`${API_BASE_URL}/evidence/${caseId}`);
      setEvidenceFiles(evRes.data);
    } catch (err) { console.error('Detail fetch error:', err); }
  };

  const addDiaryEntry = async () => {
    if (!diaryNote.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/police/${selectedCase._id}/diary`, { note: diaryNote });
      setDiaryNote('');
      fetchCaseDetails(selectedCase._id);
    } catch (err) { alert('Failed to record diary entry'); }
  };

  const addSuspect = async () => {
    if (!suspect.name.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/police/${selectedCase._id}/suspects`, suspect);
      setSuspect({ name: '', details: '' });
      fetchCaseDetails(selectedCase._id);
    } catch (err) { alert('Failed to add suspect'); }
  };

  const updateStatus = async (newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/police/${selectedCase._id}/status`, { status: newStatus });
      fetchCaseDetails(selectedCase._id);
      fetchAssignedCases();
    } catch (err) { alert('Status update failed'); }
  };

  const updateEvidenceRelevance = async (evidenceId, relevance) => {
    try {
      await axios.put(`${API_BASE_URL}/police/${selectedCase._id}/evidence/${evidenceId}`, { relevance });
      fetchCaseDetails(selectedCase._id);
    } catch (err) { alert('Relevance update failed'); }
  };

  if (selectedCase) {
    const c = selectedCase;
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedCase(null)} className="btn btn-secondary px-3">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Assigned Roster
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{c.title}</h1>
              <p className="text-xs text-slate-500 font-mono tracking-widest">{c.caseNumber || 'REG-PENDING'}</p>
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
          {/* Detailed Context */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6 border-l-4 border-l-primary">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Original Filing Narrative
              </h2>
              <p className="text-slate-700 leading-relaxed italic">"{c.description}"</p>
            </div>

            {/* Investigation Tabs */}
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
                  <div className="card p-6 bg-slate-50 border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Append Investigation Note</label>
                    <textarea
                      className="input-field bg-white mb-4"
                      rows="3"
                      placeholder="Detail current actions, witness statements, or findings..."
                      value={diaryNote}
                      onChange={(e) => setDiaryNote(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button onClick={addDiaryEntry} className="btn btn-primary h-10 px-6">Record Entry</button>
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
                              Recorded by {entry.officerId === c.assignedPolice ? 'Assigned Officer' : 'System Authority'}
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
                  <div className="card p-8 border-dashed border-2 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                    <UploadCloud className="h-10 w-10 mb-2 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest mb-1 text-slate-500">TAMPER-PROOF UPLOAD</p>
                    <p className="text-[10px] max-w-xs text-center">Files are hashed and recorded on the legal ledger. Action is irreversible.</p>
                    <button className="mt-6 btn btn-secondary h-10 px-8 text-xs font-bold uppercase">Initiate Secured Transfer</button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {evidenceFiles.map(ev => (
                      <div key={ev._id} className="card p-4 flex flex-col gap-4 border border-slate-100 shadow-sm hover:border-primary/20 transition-all">
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
                        <div className="pt-4 border-t border-slate-50 flex gap-2">
                          <select 
                            className="flex-1 text-[10px] font-bold uppercase tracking-tighter border rounded px-2 bg-slate-50"
                            value={ev.relevance}
                            onChange={(e) => updateEvidenceRelevance(ev._id, e.target.value)}
                          >
                            <option value="UNSPECIFIED">Set Relevance</option>
                            <option value="CRITICAL">Critical</option>
                            <option value="SUPPORTING">Supporting</option>
                            <option value="BACKGROUND">Background</option>
                          </select>
                          <button className="p-2 rounded-md hover:bg-slate-100 text-slate-400"><Paperclip className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'SUSPECTS' && (
                <div className="space-y-6 animate-in slide-in-from-top-2">
                  <div className="card p-6 bg-slate-50 border-slate-200 grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2"><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enroll New Suspect</h3></div>
                    <input className="input-field bg-white" placeholder="Full Legal Name" value={suspect.name} onChange={(e) => setSuspect({...suspect, name: e.target.value})} />
                    <input className="input-field bg-white" placeholder="Contact / Identification" value={suspect.details} onChange={(e) => setSuspect({...suspect, details: e.target.value})} />
                    <div className="sm:col-span-2 flex justify-end"><button onClick={addSuspect} className="btn btn-primary h-10 px-8">Add to File</button></div>
                  </div>

                  <div className="grid gap-4">
                    {c.suspects?.map((s, idx) => (
                      <div key={idx} className="card p-5 flex items-center justify-between border-slate-100 hover:border-rose-200 transition-colors group">
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

          {/* Action Sidebar */}
          <div className="space-y-6">
            <div className="card bg-slate-900 text-white p-6 sticky top-24 shadow-2xl">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> Case Sovereignty
              </h3>
              
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Assignment Phase</label>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xl font-bold tracking-tight">{c.status}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-white/5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Investigator</span>
                    <span className="font-bold">Officer Verified</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Bench Assigned</span>
                    <Badge status="trial">District Bench</Badge>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-3">
                  <button className="w-full btn btn-secondary bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs py-3">
                    <AlertCircle className="h-4 w-4 mr-2" /> Request Legal Reclassification
                  </button>
                  <button className="w-full btn btn-secondary bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs py-3">
                    <Users className="h-4 w-4 mr-2" /> Summon Complainant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase tracking-[0.1em]">Investigation Roster</h1>
          <p className="text-slate-500">Secure access to active case files and judicial instructions.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Filter assigned cases..." className="input-field pl-10 md:w-80 h-11" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="card h-48 animate-pulse bg-slate-50" />)
        ) : cases.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Shield className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Zero Assignments</h3>
            <p className="text-sm text-slate-500">Currently no active cases assigned by the Registry.</p>
          </div>
        ) : (
          cases.map(c => (
            <div 
              key={c._id} 
              onClick={() => fetchCaseDetails(c._id)}
              className="card group hover:border-primary cursor-pointer transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge status={c.status}>{c.status}</Badge>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{c.caseNumber || 'REG-PENDING'}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">{c.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6 italic">"{c.description}"</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                      {c.createdBy?.name?.charAt(0) || 'C'}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{c.createdBy?.name || 'Citizen'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Clock className="h-3 w-3" /> {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PoliceDashboard;
