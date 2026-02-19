import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Check, 
  X, 
  Gavel, 
  Paperclip, 
  Cpu, 
  FileText, 
  LayoutDashboard,
  Filter,
  Download,
  Activity,
  UserCheck,
  Briefcase,
  History,
  Lock
} from 'lucide-react';
import Badge from '../components/Badge';
import { API_BASE_URL } from '../api/config';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [cases, setCases] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('verification');
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchEvidence = useCallback(async (caseId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${storedUser.token}` } };
      await axios.get(`${API_BASE_URL}/evidence/${caseId}`, config);
    } catch (error) {
      console.error('Error fetching evidence:', error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${storedUser.token}` } };
      
      const [usersRes, casesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/users`, config),
        axios.get(`${API_BASE_URL}/cases/my`, config)
      ]);
      setUsers(usersRes.data);
      setCases(casesRes.data);
      
      casesRes.data.forEach(c => fetchEvidence(c._id));
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchEvidence]);

  const fetchLogs = useCallback(async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${storedUser.token}` } };
      const res = await axios.get(`${API_BASE_URL}/admin/logs`, config);
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  }, []);

  const fetchWorkload = useCallback(async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${storedUser.token}` } };
      const res = await axios.get(`${API_BASE_URL}/admin/workload`, config);
      setWorkload(res.data);
    } catch (error) {
      console.error('Error fetching workload:', error);
    }
  }, []);

  useEffect(() => {
    // Set active tab based on path
    const path = location.pathname;
    if (path.includes('/admin/assign')) setActiveTab('assign');
    else if (path.includes('/admin/workload')) setActiveTab('workload');
    else if (path.includes('/admin/users')) setActiveTab('users');
    else if (path.includes('/admin/logs')) setActiveTab('logs');
    else setActiveTab('verification');
  }, [location]);

  useEffect(() => {
    fetchData();
    fetchWorkload();
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab, fetchData, fetchWorkload, fetchLogs]);

  const handleCaseAction = async (caseId, action, data = {}) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${storedUser.token}` } };
      
      if (action === 'VERIFY') {
        await axios.put(`${API_BASE_URL}/admin/verifyCase/${caseId}`, data, config);
      } else if (action === 'ASSIGN') {
        await axios.put(`${API_BASE_URL}/admin/assign/${caseId}`, data, config);
      } else if (action === 'AUTO_ASSIGN') {
        await axios.put(`${API_BASE_URL}/admin/autoAssign/${caseId}`, {}, config);
      } else if (action === 'USER_STATUS') {
        await axios.put(`${API_BASE_URL}/admin/users/status/${caseId}`, data, config);
      }

      setModalType(null);
      setSelectedCase(null);
      setFormData({});
      fetchData();
      fetchWorkload();
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const handleDownloadReport = async (caseId, caseNumber) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${API_BASE_URL}/admin/report/${caseId}`, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Case_Report_${caseNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Report download error:', error);
    }
  };

  const tabs = [
    { id: 'verification', label: 'Verification Queue', icon: UserCheck },
    { id: 'assign', label: 'Assign Authorities', icon: Briefcase },
    { id: 'workload', label: 'Agency Workload', icon: Activity },
    { id: 'users', label: 'Authority Management', icon: ShieldCheck },
    { id: 'logs', label: 'Audit Logs', icon: History },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Court Registry Administration</h1>
          <p className="text-slate-500">Managing global case verification, agency assignment, and judicial scheduling.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'verification') navigate('/admin');
              else navigate(`/admin/${tab.id}`);
            }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id 
                ? 'text-primary' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"></div>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          {activeTab === 'verification' && (
            <div className="grid gap-6">
              {cases.filter(c => c.status === 'PENDING_VERIFICATION').length === 0 ? (
                <div className="card p-12 text-center bg-slate-50 border-dashed">
                  <Check className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold">Verification Queue Clear</h3>
                  <p className="text-slate-500">All filed complaints have been processed.</p>
                </div>
              ) : (
                cases.filter(c => c.status === 'PENDING_VERIFICATION').map(c => (
                  <div key={c._id} className="card overflow-hidden hover:border-amber-300 transition-all">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge status="pending">NEW FILING</Badge>
                          <span className="text-xs text-slate-400">Received {new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{c.title}</h3>
                        <p className="text-sm text-slate-600 mb-6 line-clamp-2">{c.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-xs">
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
                            <Cpu className="h-3 w-3" />
                            AI Category: {c.category || 'Calculating...'}
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-100">
                            <Activity className="h-3 w-3" />
                            Urgency: {c.aiUrgencyScore}/10
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-64 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 p-6 flex flex-col justify-center gap-3">
                        <button 
                          onClick={() => { setSelectedCase(c); setModalType('approve'); }}
                          className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 w-full"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Verify & Register
                        </button>
                        <button 
                          onClick={() => { setSelectedCase(c); setModalType('aiOverride'); }}
                          className="btn btn-secondary w-full"
                        >
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          Modify Class
                        </button>
                        <button className="btn btn-secondary text-rose-600 border-rose-100 hover:bg-rose-50 w-full">
                          <X className="h-4 w-4 mr-2" />
                          Reject Filing
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'assign' && (
            <div className="grid gap-6">
              {cases.filter(c => ['REGISTERED', 'INVESTIGATING', 'ASSIGNED', 'TRIAL', 'SCHEDULED'].includes(c.status)).map(c => (
                <div key={c._id} className="card p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge status={c.status}>{c.status}</Badge>
                        <span className="text-xs font-mono text-slate-400">ID: {c.caseNumber || c._id.substring(0,8).toUpperCase()}</span>
                      </div>
                      <h3 className="text-lg font-bold">{c.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => handleDownloadReport(c._id, c.caseNumber || 'CASE')}
                        className="btn btn-secondary text-xs"
                      >
                        <Download className="h-3.5 w-3.5 mr-2" />
                        Official Report
                      </button>
                      <button 
                        onClick={() => handleCaseAction(c._id, 'AUTO_ASSIGN')}
                        className="btn btn-secondary text-xs text-primary bg-primary/5 border-primary/20"
                      >
                        <Cpu className="h-3.5 w-3.5 mr-2" />
                        AI Auto-Assign
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Investigating Authority</label>
                      <select 
                        className="input-field bg-white"
                        onChange={(e) => setFormData({...formData, [c._id]: {...(formData[c._id]||{}), police: e.target.value}})}
                        value={formData[c._id]?.police || c.assignedPolice?._id || ''}
                      >
                        <option value="">Select Officer</option>
                        {users.filter(u => u.role === 'POLICE').map(u => (
                          <option key={u._id} value={u._id}>
                            {u.name || u.username} (Cases: {workload.find(w => w.id === u._id)?.caseCount || 0})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Presiding Judge</label>
                      <select 
                        className="input-field bg-white"
                        onChange={(e) => setFormData({...formData, [c._id]: {...(formData[c._id]||{}), judge: e.target.value}})}
                        value={formData[c._id]?.judge || c.assignedJudge?._id || ''}
                      >
                        <option value="">Select Judge</option>
                        {users.filter(u => u.role === 'JUDGE').map(u => (
                          <option key={u._id} value={u._id}>
                            {u.name || u.username} (Cases: {workload.find(w => w.id === u._id)?.caseCount || 0})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={() => handleCaseAction(c._id, 'ASSIGN', { 
                          assignedPolice: formData[c._id]?.police, 
                          assignedJudge: formData[c._id]?.judge 
                        })}
                        className="btn btn-primary w-full shadow-lg shadow-primary/10"
                      >
                        Update Deployment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'workload' && (
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    Law Enforcement Agencies
                  </h3>
                  <Badge status="info">{workload.filter(w => w.role === 'POLICE').length} Units</Badge>
                </div>
                <div className="grid gap-4">
                  {workload.filter(w => w.role === 'POLICE').map(w => (
                    <div key={w.id} className="card p-5 bg-white border border-slate-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                            {w.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{w.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Active Inspector</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">{w.caseCount}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Active Cases</p>
                        </div>
                      </div>
                      
                      {w.cases && w.cases.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {w.cases.slice(0, 3).map(c => (
                            <div key={c.id} className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                              <span className="font-medium text-slate-700 truncate max-w-[180px]">{c.title}</span>
                              <span className="font-mono text-slate-400">{c.caseNumber || 'N/A'}</span>
                            </div>
                          ))}
                          {w.cases.length > 3 && (
                            <p className="text-[10px] text-center text-slate-400 font-medium italic">+{w.cases.length - 3} more active cases</p>
                          )}
                        </div>
                      ) : (
                        <div className="py-3 mb-4 text-center border border-dashed border-slate-200 rounded text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                          Zero Active Assignments
                        </div>
                      )}

                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${Math.min(w.caseCount * 10, 100)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-purple-600" />
                    Judicial Benches
                  </h3>
                  <Badge status="trial">{workload.filter(w => w.role === 'JUDGE').length} Benches</Badge>
                </div>
                <div className="grid gap-4">
                  {workload.filter(w => w.role === 'JUDGE').map(w => (
                    <div key={w.id} className="card p-5 bg-white border border-slate-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200">
                            {w.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{w.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Presiding Justice</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-purple-600">{w.caseCount}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Total Docket</p>
                        </div>
                      </div>

                      {w.cases && w.cases.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {w.cases.slice(0, 3).map(c => (
                            <div key={c.id} className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                              <span className="font-medium text-slate-700 truncate max-w-[180px]">{c.title}</span>
                              <span className="font-mono text-slate-400">{c.caseNumber || 'N/A'}</span>
                            </div>
                          ))}
                          {w.cases.length > 3 && (
                            <p className="text-[10px] text-center text-slate-400 font-medium italic">+{w.cases.length - 3} more assigned trials</p>
                          )}
                        </div>
                      ) : (
                        <div className="py-3 mb-4 text-center border border-dashed border-slate-200 rounded text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                          Registry Empty
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2 px-1">
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                            {w.upcomingHearings || 0} UPCOMING HEARINGS
                          </div>
                        </div>
                        <Badge status={w.upcomingHearings > 5 ? 'danger' : 'success'}>
                          {w.upcomingHearings > 5 ? 'High Load' : 'Available'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search authorities..." className="input-field pl-10 h-9 text-xs" />
                  </div>
                  <button className="btn btn-secondary text-xs h-9">
                    <Filter className="h-3.5 w-3.5 mr-2" />
                    Filter Roles
                  </button>
                </div>
                <button 
                  onClick={() => setModalType('createJudge')}
                  className="btn btn-primary text-xs h-9 bg-primary"
                >
                  <Gavel className="h-3.5 w-3.5 mr-2" />
                  Appoint New Judge
                </button>
              </div>
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authority Name</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Designation</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status</th>
                    <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Registry Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {users.filter(u => u.role !== 'CITIZEN').map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => setSelectedUser(u)}
                          className="flex items-center gap-3 text-left group"
                        >
                          <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                            {(u.name || u.username || 'U').substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{u.name || u.username || 'Anonymous'}</div>
                            <div className="text-[10px] text-slate-500">{u.email}</div>
                          </div>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge status={u.role}>{u.role}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge status={u.status}>{u.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={() => handleCaseAction(u._id, 'USER_STATUS', { status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
                          className={`text-xs font-bold ${u.status === 'ACTIVE' ? 'text-rose-600 hover:text-rose-700' : 'text-emerald-600 hover:text-emerald-700'}`}
                        >
                          {u.status === 'ACTIVE' ? 'Revoke Access' : 'Restore Access'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="card overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  System Audit Trail
                </h3>
                <div className="flex items-center gap-2">
                   <button onClick={fetchLogs} className="btn btn-secondary text-xs h-8">
                     <Activity className="h-3 w-3 mr-1" /> Refresh
                   </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Timestamp</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authority</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[11px] text-slate-500 font-medium">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                              {(log.userId?.name || log.userId?.email || 'S').substring(0,1).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-slate-900">{log.userId?.name || 'System'}</div>
                              <div className="text-[9px] text-slate-400 font-bold uppercase">{log.userId?.role || 'Guest'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge status={log.status === 'SUCCESS' ? 'success' : 'danger'}>
                            {log.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[10px] text-slate-400 font-mono">
                          {log.ipAddress} | {log.userAgent?.substring(0, 20)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Verification Modal */}
      {modalType === 'approve' && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="bg-primary text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Official Case Registration</h2>
                <p className="text-blue-200 text-xs mt-1">Submitting this form creates a permanent record in the Judicial Registry.</p>
              </div>
              <button onClick={() => setModalType(null)} className="text-white/70 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50">
                <div className="space-y-6">
                    <h3 className="font-bold text-primary flex items-center gap-2 border-b border-slate-200 pb-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Administrative Data
                    </h3>
                    <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Court Jurisdiction</label>
                          <input type="text" className="input-field bg-white" placeholder="e.g. Delhi High Court" 
                              onChange={(e) => setFormData({...formData, jurisdiction: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Courtroom Assignment</label>
                          <input type="text" className="input-field bg-white" placeholder="e.g. Courtroom 12A" 
                              onChange={(e) => setFormData({...formData, courtroomName: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Priority Classification</label>
                          <select className="input-field bg-white" 
                              onChange={(e) => setFormData({...formData, priorityLevel: e.target.value})}>
                              <option value="Normal">Normal</option>
                              <option value="Urgent">Urgent</option>
                              <option value="Emergency">Emergency</option>
                          </select>
                      </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="font-bold text-rose-700 flex items-center gap-2 border-b border-slate-200 pb-2">
                      <AlertTriangle className="h-4 w-4" />
                      Verified Accused Entity
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded border-slate-300" onChange={(e) => setFormData({...formData, accused: {...(formData.accused||{}), isUnknown: e.target.checked}})} />
                        <span className="text-sm font-medium">Unknown/Anonymous Accused</span>
                      </label>
                      {!formData.accused?.isUnknown && (
                          <div className="space-y-3">
                            <input type="text" className="input-field bg-white" placeholder="Accused Legal Name" 
                                onChange={(e) => setFormData({...formData, accused: {...(formData.accused||{}), name: e.target.value}})} />
                            <input type="text" className="input-field bg-white" placeholder="Contact/Identifiers" 
                                onChange={(e) => setFormData({...formData, accused: {...(formData.accused||{}), identifiers: e.target.value}})} />
                          </div>
                      )}
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <h3 className="font-bold text-emerald-700 flex items-center gap-2 border-b border-slate-200 pb-2">
                      <Gavel className="h-4 w-4" />
                      Legal Categorization (IPC/CRPC)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Relevant Sections</label>
                          <input type="text" className="input-field bg-white" placeholder="e.g. 302, 307 IPC" 
                              onChange={(e) => setFormData({...formData, legalClassification: {...(formData.legalClassification||{}), approvedSections: e.target.value.split(',')}})} />
                      </div>
                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Severity</label>
                          <select className="input-field bg-white" onChange={(e) => setFormData({...formData, legalClassification: {...(formData.legalClassification||{}), severityLevel: e.target.value}})}>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                          </select>
                        </div>
                        <label className="flex h-11 items-center gap-2 px-4 rounded-md border border-slate-200 bg-white cursor-pointer">
                            <input type="checkbox" className="h-4 w-4" defaultChecked onChange={(e) => setFormData({...formData, legalClassification: {...(formData.legalClassification||{}), isBailable: e.target.checked}})} />
                            <span className="text-sm font-medium">Bailable</span>
                        </label>
                      </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-slate-100 border-t border-slate-200 flex gap-4">
                <button onClick={() => setModalType(null)} className="btn btn-secondary flex-1">Abort Registration</button>
                <button 
                    onClick={() => handleCaseAction(selectedCase._id, 'VERIFY', { 
                        action: 'APPROVE', 
                        ...formData,
                        complainant: {
                            address: 'Provided by Citizen',
                            idProofType: 'Aadhar',
                            idProofNumber: 'REDACTED'
                        }
                    })}
                    className="btn btn-primary flex-[2] bg-primary"
                >
                  Confirm Registration & Issue Case Number
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Appoint Judge Modal */}
      {modalType === 'createJudge' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl p-8 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Appoint High Court Judge</h2>
              <button onClick={() => setModalType(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              try {
                const config = { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` } };
                await axios.post(`${API_BASE_URL}/admin/users/create-judge`, formData, config);
                alert('Judicial appointment successful');
                setModalType(null);
                setFormData({});
                fetchData();
              } catch (err) { alert(err.response?.data?.message || 'Appointment failed'); }
            }}>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Legal Name</label>
                <input type="text" required className="input-field" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Official Email</label>
                <input type="email" required className="input-field" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Secure Phone</label>
                <input type="text" required className="input-field" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Temporary Password</label>
                <input type="password" required className="input-field" onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
              <button type="submit" className="w-full btn btn-primary h-12 mt-4 bg-primary">Confirm Appointment</button>
            </form>
          </div>
        </div>
      )}

      {/* AI Override Modal */}
      {modalType === 'aiOverride' && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl p-8 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Classify Case Manually</h2>
            <p className="text-sm text-slate-500 mb-8">Override the automated AI classification with professional human judgment.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Correct Legal Category</label>
                <select 
                    className="input-field"
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    defaultValue={selectedCase.category}
                >
                    <option value="Criminal">Criminal</option>
                    <option value="Civil">Civil</option>
                    <option value="Family">Family</option>
                    <option value="Public Interest">Public Interest</option>
                    <option value="Cyber Crime">Cyber Crime</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Reason for Override</label>
                <textarea 
                    className="input-field" 
                    rows="4"
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Specify why the automated classification was inaccurate..."
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setModalType(null)} className="btn btn-secondary flex-1">Cancel</button>
                <button 
                    onClick={() => handleCaseAction(selectedCase._id, 'AI_OVERRIDE', { 
                        category: formData.category || selectedCase.category, 
                        urgencyScore: 3, 
                        reason: formData.reason 
                    })}
                    className="btn btn-primary flex-1"
                >Update Class</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Authority Profile</h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-4 ring-4 ring-primary/5">
                  {(selectedUser.name || 'U').substring(0,2).toUpperCase()}
                </div>
                <h4 className="text-xl font-bold text-slate-900">{selectedUser.name}</h4>
                <div className="mt-2 flex items-center gap-2">
                  <Badge status={selectedUser.role}>{selectedUser.role}</Badge>
                  <Badge status={selectedUser.status}>{selectedUser.status}</Badge>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Official Email</p>
                    <p className="text-sm font-medium text-slate-700 truncate">{selectedUser.email}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                    <p className="text-sm font-medium text-slate-700">{selectedUser.phone}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">System ID</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{selectedUser._id}</span>
                  </div>
                  
                  {selectedUser.role === 'POLICE' && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Badge ID</span>
                      <span className="text-sm font-bold text-blue-600">{selectedUser.badgeID || 'Not provided'}</span>
                    </div>
                  )}

                  {selectedUser.role === 'LAWYER' && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Bar Council No.</span>
                      <span className="text-sm font-bold text-amber-600">{selectedUser.barCouncilNo || 'Not provided'}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Registration Date</span>
                    <span className="text-xs font-bold text-slate-700">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Security Audit</span>
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase">
                      <ShieldCheck className="h-3 w-3" />
                      Encrypted Identity
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setSelectedUser(null)}
                className="flex-1 btn btn-secondary h-11"
              >
                Close Profile
              </button>
              <button 
                onClick={() => {
                  handleCaseAction(selectedUser._id, 'USER_STATUS', { status: selectedUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' });
                  setSelectedUser(null);
                }}
                className={`flex-1 btn h-11 text-white font-bold ${
                  selectedUser.status === 'ACTIVE' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {selectedUser.status === 'ACTIVE' ? 'Revoke Access' : 'Restore Access'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
