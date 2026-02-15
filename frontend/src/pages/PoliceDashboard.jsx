import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AlertCircle, 
  Clock, 
  User, 
  MapPin, 
  XCircle, 
  Check, 
  ChevronLeft, 
  Search, 
  FileText, 
  Shield, 
  Scale,
  MessageSquare,
  ClipboardList
} from 'lucide-react';
import Badge from '../components/Badge';

const PoliceDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [rejectionMode, setRejectionMode] = useState(false);
  const [officialNotes, setOfficialNotes] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${storedUser.token}` } };
      const response = await axios.get('http://localhost:5000/cases/my', config);
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${storedUser.token}` } };
      await axios.put(`http://localhost:5000/cases/status/${id}`, { 
          status,
          officialNotes: status === 'REJECTED' ? officialNotes : 'Started Investigation'
      }, config);
      setRejectionMode(false);
      setOfficialNotes('');
      setSelectedCase(null);
      fetchCases();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (selectedCase) {
    const c = selectedCase;
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedCase(null)}
            className="btn btn-secondary px-3"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Roster
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{c.title}</h1>
            <p className="text-sm text-slate-500">Case ID: {c._id.substring(c._id.length - 12).toUpperCase()}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Case Overview Card */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">Investigation Details</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 italic text-slate-700 text-sm leading-relaxed">
                  "{c.description}"
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-slate-100 rounded-md">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classification</p>
                    <p className="text-sm font-semibold">{c.category || 'PENDING CLASSIFICATION'}</p>
                  </div>
                  <div className="p-3 border border-slate-100 rounded-md">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bail Status</p>
                    <p className="text-sm font-semibold text-amber-700">NON-BAILABLE (PROVISIONAL)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parties Card */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="card p-6 border-l-4 border-l-blue-500">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold">Complainant</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Full Name</span>
                    <span className="text-xs font-bold">{c.createdBy?.name || c.createdBy?.username || 'Verified User'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">ID Verification</span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Aadhar Verified</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Current Address</p>
                    <p className="text-xs text-slate-600">{c.complainant?.address || 'Provided in official filing'}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6 border-l-4 border-l-rose-500">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                  <h2 className="text-lg font-bold">Accused Entity</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Identity</span>
                    <span className="text-xs font-bold text-rose-700">{c.accused?.isUnknown ? 'UNKNOWN' : c.accused?.name}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Identifiers / Details</p>
                    <p className="text-xs text-slate-600">{c.accused?.identifiers || 'None provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-slate-400" />
                <h2 className="text-lg font-bold">Occurrence Logistics</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Reported Date</p>
                  <p className="text-sm font-semibold">
                    {c.incident?.date ? new Date(c.incident.date).toLocaleDateString() : (c.incidentDate ? new Date(c.incidentDate).toLocaleDateString() : 'N/A')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Incident Time</p>
                  <p className="text-sm font-semibold">{c.incident?.time || c.incidentTime || 'N/A'}</p>
                </div>
                <div className="sm:col-span-3 pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Exact Location</p>
                  <p className="text-sm font-semibold text-slate-700">{c.incident?.location || c.incidentLocation || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Status & Actions Card */}
            <div className="card bg-slate-900 text-white p-6 sticky top-24 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Execution Panel</h3>
              
              <div className="mb-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Current Case Status</p>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-lg font-bold tracking-tight">{c.status.toUpperCase()}</span>
                </div>
              </div>

              {rejectionMode ? (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                  <div>
                    <label className="block text-xs font-bold text-rose-400 mb-2">REASON FOR REFUSAL</label>
                    <textarea 
                      className="w-full rounded-md bg-slate-800 border-slate-700 text-white p-3 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500" 
                      rows="4" 
                      placeholder="Specify grounds for declining the case (insufficient evidence, jurisdictional error, etc.)"
                      value={officialNotes}
                      onChange={(e) => setOfficialNotes(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setRejectionMode(false)}
                      className="flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => updateStatus(c._id, 'REJECTED')}
                      disabled={!officialNotes}
                      className="flex-1 py-2 rounded bg-rose-600 text-xs font-bold hover:bg-rose-700 disabled:opacity-50 transition-colors"
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {(c.status === 'PENDING_VERIFICATION' || c.status === 'ASSIGNED' || c.status === 'REGISTERED') && (
                    <>
                      <button 
                        onClick={() => updateStatus(c._id, 'INVESTIGATING')}
                        className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 py-3 text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50"
                      >
                        <Shield className="h-4 w-4" />
                        Initiate Investigation
                      </button>
                      <button 
                        onClick={() => setRejectionMode(true)}
                        className="w-full py-3 text-sm font-bold text-rose-400 hover:bg-rose-950/30 rounded-md transition-all border border-rose-900/50"
                      >
                        Decline Case Assignment
                      </button>
                    </>
                  )}
                  {c.status === 'INVESTIGATING' && (
                    <button 
                      onClick={() => updateStatus(c._id, 'TRIAL')}
                      className="w-full flex items-center justify-center gap-2 rounded-md bg-emerald-600 py-3 text-sm font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/50"
                    >
                      <Scale className="h-4 w-4" />
                      Commit to Trial
                    </button>
                  )}
                  {(c.status === 'TRIAL' || c.status === 'CLOSED') && (
                    <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 text-center">
                      <p className="text-xs text-slate-400">Case is currently under {c.status.toLowerCase()} phase.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
                <button className="w-full flex items-center gap-3 text-xs text-slate-400 hover:text-white transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  Request Clarification from Citizen
                </button>
                <button className="w-full flex items-center gap-3 text-xs text-slate-400 hover:text-white transition-colors">
                  <FileText className="h-4 w-4" />
                  Generate Interim Report (Form 15)
                </button>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Investigation Roster</h1>
          <p className="text-slate-500">Oversee and update current criminal and civil investigations.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Case ID or Title..." 
            className="input-field pl-10 md:w-80"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="card h-48 animate-pulse bg-slate-50"></div>
          ))
        ) : cases.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <Shield className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Pending Assignments</h3>
            <p className="text-slate-500">New cases assigned by administration will appear here.</p>
          </div>
        ) : (
          cases.map((c) => (
            <div 
              key={c._id} 
              onClick={() => setSelectedCase(c)}
              className="card group hover:border-primary/50 cursor-pointer transition-all duration-300"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <Badge status={c.status}>{c.status}</Badge>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {c.caseNumber || 'UNASSIGNED'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
                  {c.title}
                </h3>
                
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {c.description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{c.createdBy?.name || c.createdBy?.username || 'Citizen'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Clock className="h-3 w-3" />
                    {new Date(c.createdAt).toLocaleDateString()}
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
