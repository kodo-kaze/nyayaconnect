import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Briefcase, UserPlus } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('users'); // 'users' or 'cases'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, casesRes] = await Promise.all([
        axios.get('http://localhost:5000/admin/users'),
        axios.get('http://localhost:5000/cases/my')
      ]);
      setUsers(usersRes.data);
      setCases(casesRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignPersonnel = async (caseId, type, userId) => {
    try {
      const payload = {};
      if (type === 'police') payload.assignedPolice = userId;
      if (type === 'judge') payload.assignedJudge = userId;
      
      await axios.put(`http://localhost:5000/cases/assign/${caseId}`, payload);
      fetchData();
    } catch (error) {
      console.error('Error assigning personnel:', error);
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
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <span className="text-sm font-medium text-gray-500">Status: {c.status}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assign Police</label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    onChange={(e) => assignPersonnel(c._id, 'police', e.target.value)}
                    value={c.assignedPolice?._id || ''}
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
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    onChange={(e) => assignPersonnel(c._id, 'judge', e.target.value)}
                    value={c.assignedJudge?._id || ''}
                  >
                    <option value="">Select Judge</option>
                    {users.filter(u => u.role === 'JUDGE').map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
