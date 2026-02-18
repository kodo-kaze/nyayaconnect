import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Gavel, 
  Shield, 
  FileText, 
  User, 
  MapPin, 
  XCircle, 
  CheckCircle,
  ChevronRight,
  Scale,
  Sparkles,
  BookOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Badge from '../components/Badge';
import { API_BASE_URL } from '../api/config';

const JudgeDashboard = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectionMode, setRejectionMode] = useState(false);
  const [officialNotes, setOfficialNotes] = useState('');
  const [insights, setInsights] = useState({});
  const [summaries, setSummaries] = useState({});
  const [fetchingInsight, setFetchingInsight] = useState({});
  const [fetchingSummary, setFetchingSummary] = useState({});

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cases/my`);
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/cases/status/${id}`, { 
          status,
          officialNotes: officialNotes || `Judicial Decision: ${status}`
      });
      
      setRejectionMode(false);
      setOfficialNotes('');
      setSelectedCase(null);
      fetchCases();
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  const getLegalInsight = async (caseId, description) => {
    setFetchingInsight(prev => ({ ...prev, [caseId]: true }));
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/legalInsight`, { 
        complaint_text: description 
      });
      setInsights(prev => ({ ...prev, [caseId]: response.data.legal_insight }));
    } catch (error) {
      console.error('Error fetching insight:', error);
    } finally {
      setFetchingInsight(prev => ({ ...prev, [caseId]: false }));
    }
  };

  const summarizeCase = async (caseId, description) => {
    setFetchingSummary(prev => ({ ...prev, [caseId]: true }));
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/summarizeCase`, { 
        full_case_text: description 
      });
      setSummaries(prev => ({ ...prev, [caseId]: response.data.summary }));
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setFetchingSummary(prev => ({ ...prev, [caseId]: false }));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6">
      {/* Sidebar: Case Roster */}
      <div className="w-full lg:w-80 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden shrink-0">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-900">
            <Scale className="h-4 w-4 text-primary" />
            Judicial Bench
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center animate-pulse space-y-4">
              <div className="h-12 bg-slate-100 rounded-md"></div>
              <div className="h-12 bg-slate-100 rounded-md"></div>
              <div className="h-12 bg-slate-100 rounded-md"></div>
            </div>
          ) : cases.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-xs font-medium">No Active Trials</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {cases.map((c) => (
                <li 
                  key={c._id} 
                  className={`p-4 cursor-pointer transition-all hover:bg-slate-50 ${
                    selectedCase?._id === c._id ? 'bg-blue-50/50 border-r-4 border-primary' : ''
                  }`}
                  onClick={() => { setSelectedCase(c); setRejectionMode(false); }}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                      <p className={`text-sm font-bold truncate ${selectedCase?._id === c._id ? 'text-primary' : 'text-slate-900'}`}>
                        {c.title}
                      </p>
                      <Badge status={c.status}>{c.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {c.caseNumber || 'REG-PENDING'}
                    </span>
                    <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Content: Case Details */}
      <div className="flex-1 min-w-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto">
        {selectedCase ? (
          <div className="p-8 space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 pb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge status="trial">HIGH COURT REGISTRY</Badge>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Official Record No: {selectedCase.caseNumber}</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                  {selectedCase.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Filed on {new Date(selectedCase.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Scale className="h-4 w-4" />
                    Trial Phase: {selectedCase.status.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Urgency Index</p>
                <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-md">
                  <AlertCircle className={`h-4 w-4 ${selectedCase.aiUrgencyScore > 7 ? 'text-rose-400' : 'text-emerald-400'}`} />
                  <span className="text-sm font-bold">{selectedCase.aiUrgencyScore}/10</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card p-6 bg-slate-50 border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center tracking-widest">
                  <User size={14} className="mr-2 text-primary"/> Petitioner / Complainant
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{selectedCase.createdBy?.name || selectedCase.createdBy?.username || 'Verified Petitioner'}</p>
                    <p className="text-xs text-slate-500 mt-1">Status: Registered Citizen</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Registered Address</p>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {selectedCase.complainant?.address || 'Provided in sealed filing'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6 bg-slate-50 border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center tracking-widest">
                  <Shield size={14} className="mr-2 text-rose-600"/> Respondent / Accused
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-bold text-rose-900">
                      {selectedCase.accused?.isUnknown ? 'IDENTIFICATION PENDING' : selectedCase.accused?.name}
                    </p>
                    <p className="text-xs text-rose-600/70 mt-1">Status: Primary Suspect</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Identifiers / Remarks</p>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {selectedCase.accused?.identifiers || 'No identifying data provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-amber-50/50 border-amber-100">
              <h3 className="text-xs font-bold text-amber-800 uppercase mb-4 flex items-center tracking-widest">
                <MapPin size={14} className="mr-2"/> Incident Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-amber-700/60 uppercase">Incident Date</p>
                  <p className="text-sm font-semibold text-amber-900">
                    {selectedCase.incident?.date ? new Date(selectedCase.incident.date).toLocaleDateString() : (selectedCase.incidentDate ? new Date(selectedCase.incidentDate).toLocaleDateString() : 'N/A')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-700/60 uppercase">Incident Time</p>
                  <p className="text-sm font-semibold text-amber-900">{selectedCase.incident?.time || selectedCase.incidentTime || 'N/A'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[10px] font-bold text-amber-700/60 uppercase">Location</p>
                  <p className="text-sm font-semibold text-amber-900">{selectedCase.incident?.location || selectedCase.incidentLocation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-700/60 uppercase">Legal Severity</p>
                  <Badge status={selectedCase.legalClassification?.severityLevel || 'info'}>
                    {selectedCase.legalClassification?.severityLevel || 'PENDING'}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-700/60 uppercase">Bail Status</p>
                  <p className="text-sm font-bold text-amber-900">{selectedCase.legalClassification?.isBailable ? 'BAILABLE' : 'NON-BAILABLE'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center tracking-wide">
                <BookOpen className="mr-2 w-5 h-5 text-primary" /> Case Narrative & Evidence Summary
              </h3>
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-base text-slate-700 leading-relaxed italic indent-8">
                  "{selectedCase.description}"
                </p>
              </div>
            </div>

            {/* AI Assistant Section for Judge */}
            <div className="card p-8 border-primary/20 bg-primary/[0.02] ring-1 ring-primary/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">NyayaAI Decision Support</h4>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Neural Legal Engine</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!summaries[selectedCase._id] && (
                    <button
                      onClick={() => summarizeCase(selectedCase._id, selectedCase.description)}
                      disabled={fetchingSummary[selectedCase._id]}
                      className="btn btn-secondary text-xs"
                    >
                      {fetchingSummary[selectedCase._id] ? 'Summarizing...' : 'Summarize Case'}
                    </button>
                  )}
                  {!insights[selectedCase._id] && (
                    <button
                      onClick={() => getLegalInsight(selectedCase._id, selectedCase.description)}
                      disabled={fetchingInsight[selectedCase._id]}
                      className="btn btn-primary text-xs"
                    >
                      {fetchingInsight[selectedCase._id] ? 'Analyzing Jurisprudence...' : 'Review Case with AI'}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                {summaries[selectedCase._id] && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-100">
                      <h5 className="text-[10px] font-bold text-amber-800 uppercase mb-2">Executive Case Summary</h5>
                      <p className="text-sm text-slate-700 leading-relaxed italic">
                        {summaries[selectedCase._id]}
                      </p>
                    </div>
                  </div>
                )}
                {insights[selectedCase._id] && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="p-6 rounded-lg bg-white border border-primary/10 shadow-sm">
                      <h5 className="text-[10px] font-bold text-primary uppercase mb-2">Detailed Legal Insights</h5>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {insights[selectedCase._id]}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-4 text-center">
                      Note: AI insights are intended for judicial assistance only. Final decisions rests solely with the presiding judge.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-6">
              {rejectionMode ? (
                <div className="w-full space-y-4 bg-rose-50 p-6 rounded-xl border border-rose-100 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-2 text-rose-800">
                      <XCircle className="h-5 w-5" />
                      <h4 className="font-bold">Formal Dismissal Grounds</h4>
                    </div>
                    <textarea 
                        className="input-field bg-white" 
                        rows="4" 
                        placeholder="State the legal framework and specific reasons for dismissing this case from the docket..."
                        value={officialNotes}
                        onChange={(e) => setOfficialNotes(e.target.value)}
                    ></textarea>
                    <div className="flex gap-4">
                        <button onClick={() => setRejectionMode(false)} className="btn btn-secondary flex-1">Abort Dismissal</button>
                        <button 
                            onClick={() => handleStatusUpdate(selectedCase._id, 'CLOSED')}
                            disabled={!officialNotes}
                            className="btn btn-primary bg-rose-600 hover:bg-rose-700 flex-1"
                        >Execute Formal Dismissal</button>
                    </div>
                </div>
              ) : (
                <>
                  <button
                      className="btn btn-secondary text-rose-600 border-rose-200 hover:bg-rose-50"
                      onClick={() => setRejectionMode(true)}
                  >
                      <XCircle size={18} className="mr-2" /> Dismiss Case Filing
                  </button>
                  <div className="flex gap-4">
                    <button
                        className="btn btn-secondary"
                        onClick={() => alert('Order generation in progress...')}
                    >
                        <FileText size={18} className="mr-2" /> Issue Interim Order
                    </button>
                    <button
                        className="btn btn-primary bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleStatusUpdate(selectedCase._id, 'CLOSED')}
                    >
                        <CheckCircle size={18} className="mr-2" /> Pronounce Final Verdict
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 text-center">
            <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
              <Gavel className="w-12 h-12 opacity-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Judicial Review Portal</h3>
            <p className="text-sm max-w-xs mt-2">Please select an assigned case from the bench on the left to review documentation and pronounce decisions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgeDashboard;
