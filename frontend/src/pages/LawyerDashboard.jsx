import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, 
  FileText, 
  Send, 
  Search, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  MessageSquare,
  Scale,
  Paperclip,
  ExternalLink
} from 'lucide-react';
import Badge from '../components/Badge';

const LawyerDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCase, setActiveCase] = useState(null);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cases/my');
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Legal Counsel Workspace</h1>
          <p className="text-slate-500">Managing active litigation and document preparation.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Case List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search my cases..." className="input-field pl-10 h-10" />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="card h-24 animate-pulse bg-slate-50"></div>)}
            </div>
          ) : cases.length === 0 ? (
            <div className="card p-12 text-center text-slate-400">
              <p className="text-sm italic">No active representations</p>
            </div>
          ) : (
            cases.map((c) => (
              <div 
                key={c._id} 
                onClick={() => setActiveCase(c)}
                className={`card p-5 cursor-pointer transition-all hover:shadow-md ${
                  activeCase?._id === c._id ? 'ring-2 ring-primary border-transparent' : 'hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge status={c.status}>{c.status}</Badge>
                  <span className="text-[10px] font-bold text-slate-400">{c.caseNumber || 'PENDING'}</span>
                </div>
                <h3 className="font-bold text-slate-900 line-clamp-1">{c.title}</h3>
                <div className="flex items-center gap-3 mt-4 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {c.createdBy?.name || c.createdBy?.username || 'Client'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Detailed View */}
        <div className="lg:col-span-8">
          {activeCase ? (
            <div className="card overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-8 border-b border-slate-100">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{activeCase.title}</h2>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-md hover:bg-slate-100 text-slate-500 transition-colors">
                      <MessageSquare className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-md hover:bg-slate-100 text-slate-500 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</p>
                    <p className="text-sm font-semibold">{activeCase.createdBy?.name || activeCase.createdBy?.username || 'Verified Client'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case Category</p>
                    <p className="text-sm font-semibold">{activeCase.category || 'Unclassified'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Judge</p>
                    <p className="text-sm font-semibold">{activeCase.assignedJudge?.name || 'Pending Bench'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Investigator</p>
                    <p className="text-sm font-semibold">{activeCase.assignedPolice?.name || 'Pending Agency'}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Filing Summary
                  </h4>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 italic text-slate-700 leading-relaxed">
                    "{activeCase.description}"
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Document Locker
                    </h4>
                    <div className="space-y-2">
                      {[1, 2].map(i => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-primary/30 transition-colors bg-white group shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold">Exhibit_{i}_Filing.pdf</p>
                              <p className="text-[10px] text-slate-400">PDF • 2.4 MB</p>
                            </div>
                          </div>
                          <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center">
                      <Scale className="h-4 w-4 mr-2" />
                      Legal Actions
                    </h4>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center gap-2 btn btn-primary py-3">
                        <Send className="h-4 w-4" />
                        Submit Formal Argument
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 btn btn-secondary py-3">
                        <FileText className="h-4 w-4" />
                        Draft Affidavits
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 py-40 text-slate-400">
              <Briefcase className="h-16 w-16 mb-4 opacity-10" />
              <p className="font-medium text-slate-900">Case Document Repository</p>
              <p className="text-sm mt-1">Select an active representation to view full case files and submit arguments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerDashboard;
