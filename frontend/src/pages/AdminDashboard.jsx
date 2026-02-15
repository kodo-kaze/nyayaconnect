import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Briefcase, UserPlus } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('users'); // 'users' or 'cases'
  const [assigning, setAssigning] = useState({}); // { caseId: true }
  const [pendingAssignments, setPendingAssignments] = useState({}); // { caseId: { policeId, judgeId } }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: { Authorization: `Bearer ${storedUser.token}` }
      };
      
      const [usersRes, casesRes] = await Promise.all([
        axios.get('http://localhost:5000/admin/users', config),
        axios.get('http://localhost:5000/cases/my', config)
      ]);
      setUsers(usersRes.data);
      setCases(casesRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (caseId, type, userId) => {
    setPendingAssignments(prev => ({
      ...prev,
      [caseId]: {
        ...(prev[caseId] || { 
          policeId: cases.find(c => c._id === caseId)?.assignedPolice?._id || '', 
          judgeId: cases.find(c => c._id === caseId)?.assignedJudge?._id || '' 
        }),
        [type === 'police' ? 'policeId' : 'judgeId']: userId
      }
    }));
  };

  const handleSaveAssignments = async (caseId) => {
    const assignment = pendingAssignments[caseId];
    if (!assignment) return;

    setAssigning(prev => ({ ...prev, [caseId]: true }));
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: { Authorization: `Bearer ${storedUser.token}` }
      };
      
      await axios.put(`http://localhost:5000/cases/assign/${caseId}`, {
        assignedPolice: assignment.policeId,
        assignedJudge: assignment.judgeId
      }, config);
      
      alert('Personnel assigned successfully!');
      fetchData();
      // Clear pending state for this case
      const newPending = { ...pendingAssignments };
      delete newPending[caseId];
      setPendingAssignments(newPending);
    } catch (error) {
      console.error('Error assigning personnel:', error);
      alert('Failed to save assignments.');
    } finally {
      setAssigning(prev => ({ ...prev, [caseId]: false }));
    }
  };

  const handleApproval = async (caseId, status) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: { Authorization: `Bearer ${storedUser.token}` }
      };
      await axios.put(`http://localhost:5000/admin/approveCase/${caseId}`, { approvalStatus: status }, config);
      fetchData();
    } catch (error) {
      console.error('Error updating case approval status:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setView('users')}
            className={`px-4 py-2 rounded-md ${view === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <Users className="inline-block mr-2 w-5 h-5" />
            Users
          </button>
          <button
            onClick={() => setView('cases')}
            className={`px-4 py-2 rounded-md ${view === 'cases' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <Briefcase className="inline-block mr-2 w-5 h-5" />
            Cases
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : view === 'users' ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {user.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
          {cases.map((c) => (
            <div key={c._id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{c.title}</h3>
                  <div className="flex space-x-2 mt-1">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Status: {c.status}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      c.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                      c.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      Approval: {c.approvalStatus || 'pending'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {c.approvalStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproval(c._id, 'approved')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(c._id, 'rejected')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assign Police</label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                    onChange={(e) => handleSelectChange(c._id, 'police', e.target.value)}
                    value={pendingAssignments[c._id]?.policeId ?? c.assignedPolice?._id ?? ''}
                    disabled={assigning[c._id]}
                  >
                    <option value="">Select Police</option>
                    {users.filter(u => u.role === 'POLICE').map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assign Judge</label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                    onChange={(e) => handleSelectChange(c._id, 'judge', e.target.value)}
                    value={pendingAssignments[c._id]?.judgeId ?? c.assignedJudge?._id ?? ''}
                    disabled={assigning[c._id]}
                  >
                    <option value="">Select Judge</option>
                    {users.filter(u => u.role === 'JUDGE').map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {pendingAssignments[c._id] && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleSaveAssignments(c._id)}
                    disabled={assigning[c._id]}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {assigning[c._id] ? 'Saving...' : 'Save Assignments'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
