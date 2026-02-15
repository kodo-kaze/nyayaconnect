import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Shield, Clock, ArrowRight, User, AlertCircle, FileStack } from 'lucide-react';
import Badge from '../components/Badge';
import { API_BASE_URL } from '../api/config';

const InvestigationPanel = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveInvestigations();
  }, []);

  const fetchActiveInvestigations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/cases/my`);
      // Filter for cases that actually need active investigation work
      const active = res.data.filter(c => ['REGISTERED', 'INVESTIGATING', 'NEED_MORE_INFO'].includes(c.status));
      setCases(active);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Investigation Control</h1>
        <p className="text-slate-500">Manage procedural steps, immutable diaries, and evidence for assigned dockets.</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="card h-24 animate-pulse bg-slate-50" />)
        ) : cases.length === 0 ? (
          <div className="card p-12 text-center bg-slate-50 border-dashed border-2">
            <FileStack className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Pending Investigations</h3>
            <p className="text-sm text-slate-500">All assigned cases have either been reported or are in trial.</p>
          </div>
        ) : (
          cases.map(c => (
            <div 
              key={c._id}
              onClick={() => navigate(`/police/investigation/${c._id}`)}
              className="card group hover:border-primary transition-all cursor-pointer bg-white"
            >
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge status={c.status}>{c.status}</Badge>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{c.caseNumber || 'REG-PENDING'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{c.title}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-slate-400" />
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter truncate">{c.createdBy?.name || 'Citizen'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter">Urgency: {c.aiUrgencyScore}/10</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-48 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 p-6 flex flex-col justify-center gap-2">
                  <button className="btn btn-primary w-full text-xs font-bold uppercase tracking-widest bg-primary group-hover:scale-[1.02] transition-transform">
                    Enter Workspace
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InvestigationPanel;
