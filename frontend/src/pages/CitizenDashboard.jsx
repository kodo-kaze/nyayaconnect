import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PlusCircle, 
  FileText, 
  Paperclip, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle,
  Clock,
  ExternalLink,
  Sparkles,
  UploadCloud,
  ShieldCheck
} from 'lucide-react';
import Badge from '../components/Badge';
import CaseTimeline from '../components/CaseTimeline';
import { API_BASE_URL } from '../api/config';

const CitizenDashboard = () => {
  const [cases, setCases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '',
    incident: { date: '', time: '', location: '', peopleCount: 1, hasInjury: false },
    accused: { name: '', address: '', identifiers: '', isUnknown: false },
    complainant: { address: '', idProofType: 'Aadhar', idProofNumber: '', relationship: 'Victim' }
  });
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState({});
  const [fetchingInsight, setFetchingInsight] = useState({});
  const [caseEvidence, setCaseEvidence] = useState({});
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchEvidence = async (caseId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${storedUser.token}` } };
      const response = await axios.get(`${API_BASE_URL}/evidence/${caseId}`, config);
      setCaseEvidence(prev => ({ ...prev, [caseId]: response.data }));
    } catch (error) {
      console.error('Error fetching evidence:', error);
    }
  };

  const handleFileUpload = async (caseId, file) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [caseId]: true }));
    
    const fd = new FormData();
    fd.append('file', file);
    fd.append('caseId', caseId);

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storedUser.token}` 
        }
      };
      await axios.post(`${API_BASE_URL}/evidence/upload`, fd, config);
      fetchEvidence(caseId);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(prev => ({ ...prev, [caseId]: false }));
    }
  };

  const getLegalInsight = async (caseId, description) => {
    setFetchingInsight(prev => ({ ...prev, [caseId]: true }));
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${storedUser.token}` } };
      const response = await axios.post(`${API_BASE_URL}/ai/legalInsight`, { 
        complaint_text: description 
      }, config);
      setInsights(prev => ({ ...prev, [caseId]: response.data.legal_insight }));
    } catch (error) {
      console.error('Error fetching insight:', error);
    } finally {
      setFetchingInsight(prev => ({ ...prev, [caseId]: false }));
    }
  };

  const fetchCases = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cases/my`);
      setCases(response.data);
      // Fetch evidence for all cases
      response.data.forEach(c => fetchEvidence(c._id));
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const aiRes = await axios.post(`${API_BASE_URL}/ai/analyzeComplaint`, { 
        complaint_text: formData.description 
      });
      
      await axios.post(`${API_BASE_URL}/cases/create`, {
        ...formData,
        category: aiRes.data.category,
        aiUrgencyScore: aiRes.data.urgency_score
      });
      
      resetForm();
      fetchCases();
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '',
      incident: { date: '', time: '', location: '', peopleCount: 1, hasInjury: false },
      accused: { name: '', address: '', identifiers: '', isUnknown: false },
      complainant: { address: '', idProofType: 'Aadhar', idProofNumber: '', relationship: 'Victim' }
    });
    setShowForm(false);
    setFormStep(1);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Legal Case Portfolio</h1>
          <p className="text-slate-500">Manage your filed complaints and track their progress in real-time.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary shadow-lg shadow-primary/20"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          File New Complaint
        </button>
      </div>

      {showForm && (
        <div className="card border-primary/20 bg-white ring-1 ring-primary/5">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Complaint Filing Wizard</h2>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(step => (
                  <div 
                    key={step} 
                    className={`h-2 w-8 rounded-full transition-all ${
                      formStep >= step ? 'bg-primary' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {formStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Step 1: Case Overview</h3>
                  <p className="text-sm text-slate-500">Provide a clear title and detailed account of the incident.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Complaint Title</label>
                    <input 
                      type="text" 
                      required 
                      className="input-field"
                      placeholder="e.g., Unauthorized access to property"
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Detailed Description</label>
                    <textarea 
                      required 
                      rows="5" 
                      className="input-field"
                      placeholder="Provide a chronological and factual description of what happened..."
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {formStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Step 2: Incident Logistics</h3>
                  <p className="text-sm text-slate-500">Where and when did this occur?</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Date of Incident</label>
                    <input 
                      type="date" 
                      required 
                      className="input-field"
                      value={formData.incident.date} 
                      onChange={(e) => setFormData({...formData, incident: {...formData.incident, date: e.target.value}})} 
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Time (Approximate)</label>
                    <input 
                      type="time" 
                      required 
                      className="input-field"
                      value={formData.incident.time} 
                      onChange={(e) => setFormData({...formData, incident: {...formData.incident, time: e.target.value}})} 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">Precise Location</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Building name, street, landmarks..."
                      className="input-field"
                      value={formData.incident.location} 
                      onChange={(e) => setFormData({...formData, incident: {...formData.incident, location: e.target.value}})} 
                    />
                  </div>
                </div>
              </div>
            )}

            {formStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Step 3: Involved Parties</h3>
                  <p className="text-sm text-slate-500">Identify the accused if known.</p>
                </div>
                <div className="space-y-6">
                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      checked={formData.accused.isUnknown}
                      onChange={(e) => setFormData({...formData, accused: {...formData.accused, isUnknown: e.target.checked}})} 
                    />
                    <div>
                      <p className="text-sm font-semibold">Accused is unknown</p>
                      <p className="text-xs text-slate-500">Check this if you cannot identify the person(s) involved.</p>
                    </div>
                  </label>

                  {!formData.accused.isUnknown && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium">Full Name (if known)</label>
                        <input type="text" className="input-field"
                          value={formData.accused.name} onChange={(e) => setFormData({...formData, accused: {...formData.accused, name: e.target.value}})} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium">Last Known Address</label>
                        <input type="text" className="input-field"
                          value={formData.accused.address} onChange={(e) => setFormData({...formData, accused: {...formData.accused, address: e.target.value}})} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium">Other Identifying Details</label>
                        <input type="text" placeholder="Phone, vehicle number, physical description..." className="input-field"
                          value={formData.accused.identifiers} onChange={(e) => setFormData({...formData, accused: {...formData.accused, identifiers: e.target.value}})} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {formStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Step 4: Complainant Verification</h3>
                  <p className="text-sm text-slate-500">Finalize your identification details.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">ID Proof Type</label>
                    <select className="input-field" value={formData.complainant.idProofType}
                        onChange={(e) => setFormData({...formData, complainant: {...formData.complainant, idProofType: e.target.value}})}>
                        <option>Aadhar</option>
                        <option>PAN Card</option>
                        <option>Voter ID</option>
                        <option>Passport</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">ID Number</label>
                    <input type="text" required className="input-field"
                        value={formData.complainant.idProofNumber} onChange={(e) => setFormData({...formData, complainant: {...formData.complainant, idProofNumber: e.target.value}})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">Current Address</label>
                    <input type="text" className="input-field"
                        value={formData.complainant.address} onChange={(e) => setFormData({...formData, complainant: {...formData.complainant, address: e.target.value}})} />
                  </div>
                </div>
                
                <div className="rounded-lg bg-amber-50 p-4 border border-amber-100 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    By submitting this complaint, you certify that the information provided is true and accurate to the best of your knowledge. 
                    Filing a false police report is a punishable offense under Section 182/211 of the IPC.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">
              <button 
                type="button"
                onClick={() => formStep > 1 ? setFormStep(formStep - 1) : resetForm()}
                className="btn btn-secondary"
              >
                {formStep === 1 ? 'Cancel' : 'Previous Step'}
              </button>
              
              {formStep < 4 ? (
                <button 
                  type="button"
                  onClick={() => setFormStep(formStep + 1)}
                  className="btn btn-primary"
                >
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button type="submit" className="btn btn-primary bg-primary">
                  Submit Official Complaint
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm font-medium text-slate-500">Retrieving case records...</p>
            </div>
          </div>
        ) : cases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No Cases Found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">You haven't filed any legal complaints yet. Your active cases will appear here.</p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-6 text-sm font-bold text-primary hover:underline"
            >
              File your first complaint
            </button>
          </div>
        ) : (
          cases.map((c) => (
            <div key={c._id} className="card group hover:border-primary/30 transition-all duration-300">
              <div className="flex flex-col lg:flex-row">
                {/* Main Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge status={c.status}>{c.status}</Badge>
                        <Badge status={c.approvalStatus || 'pending'}>
                          {c.approvalStatus ? c.approvalStatus : 'VERIFICATION PENDING'}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Case ID: {c._id.substring(c._id.length - 8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Urgency</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`h-2 w-12 rounded-full ${
                          c.aiUrgencyScore > 7 ? 'bg-rose-500' : c.aiUrgencyScore > 4 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}></div>
                        <span className="text-xs font-bold">{c.aiUrgencyScore}/10</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
                    {c.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">Incident Date</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {c.incident?.date ? new Date(c.incident.date).toLocaleDateString() : (c.incidentDate ? new Date(c.incidentDate).toLocaleDateString() : 'N/A')}
                          </p>
                        </div>
                      </div>
                    {c.assignedPolice && (
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">Investigator</p>
                          <p className="text-sm font-semibold text-slate-700">{c.assignedPolice.name || c.assignedPolice.username}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded bg-amber-50 flex items-center justify-center text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Category</p>
                        <p className="text-sm font-semibold text-slate-700 capitalize">{c.category || 'Unclassified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights Section */}
                  <div className="mt-8">
                    {insights[c._id] ? (
                      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 ring-1 ring-blue-200/50">
                        <div className="flex items-center gap-2 mb-3 text-blue-900">
                          <Sparkles className="h-4 w-4" />
                          <h4 className="text-sm font-bold">AI Legal Assistant Analysis</h4>
                        </div>
                        <p className="text-sm text-blue-800 leading-relaxed italic">
                          "{insights[c._id]}"
                        </p>
                        <p className="text-[10px] text-blue-500 mt-4 font-medium uppercase tracking-wider">
                          Generated by NyayaAI • Strictly for informational purposes
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => getLegalInsight(c._id, c.description)}
                        disabled={fetchingInsight[c._id]}
                        className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                      >
                        <Sparkles className={`h-3.5 w-3.5 ${fetchingInsight[c._id] ? 'animate-pulse' : ''}`} />
                        {fetchingInsight[c._id] ? 'Analyzing Legal Context...' : 'Generate Legal Insight'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Sidebar of the Card (Timeline & Evidence) */}
                <div className="w-full lg:w-72 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">Case Progress</h4>
                  <CaseTimeline status={c.status} />

                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Evidence</h4>
                      <label className="text-[10px] font-bold text-primary hover:underline cursor-pointer uppercase flex items-center">
                        <UploadCloud className="h-3 w-3 mr-1" />
                        {uploading[c._id] ? '...' : 'Upload'}
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(c._id, e.target.files[0])}
                          disabled={uploading[c._id]}
                        />
                      </label>
                    </div>
                    
                    <div className="space-y-2">
                      {caseEvidence[c._id] && caseEvidence[c._id].length > 0 ? (
                        caseEvidence[c._id].map((ev) => (
                          <div key={ev._id} className="flex items-center gap-2 rounded-md bg-white p-2 border border-slate-200 shadow-sm overflow-hidden">
                            <Paperclip className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="text-[11px] font-medium text-slate-700 truncate flex-1">{ev.filePath.split('/').pop()}</span>
                            <ExternalLink className="h-3 w-3 text-slate-400 hover:text-primary cursor-pointer shrink-0" />
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">No evidence uploaded</p>
                      )}
                    </div>
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

export default CitizenDashboard;
