import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const PoliceDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/cases/status/${id}`, { status });
      fetchCases();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Police Investigation Panel</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading assigned cases...</p>
        ) : cases.length === 0 ? (
          <p>No cases assigned yet.</p>
        ) : (
          cases.map((c) => (
            <div key={c._id} className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-blue-500">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{c.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        c.status === 'filed' ? 'bg-red-100 text-red-800' : 
                        c.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                        {c.status}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-4 h-12 overflow-hidden">{c.description}</p>
                <div className="flex space-x-2">
                  {c.status === 'filed' && (
                    <button
                      onClick={() => updateStatus(c._id, 'investigating')}
                      className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Start Investigation
                    </button>
                  )}
                  {c.status === 'investigating' && (
                    <button
                      onClick={() => updateStatus(c._id, 'trial')}
                      className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Move to Trial
                    </button>
                  )}
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
