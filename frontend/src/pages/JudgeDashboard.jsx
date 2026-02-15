import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Gavel, Shield, Info, FileText } from 'lucide-react';

const JudgeDashboard = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
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

  const closeCase = async (id) => {
    try {
      await axios.put(`http://localhost:5000/cases/status/${id}`, { status: 'closed' });
      fetchCases();
      setSelectedCase(null);
    } catch (error) {
      console.error('Error closing case:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-6">
      <div className="w-1/3 bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-bold flex items-center">
            <Gavel className="mr-2" /> Pending Trials
          </h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {loading ? (
            <p className="p-4">Loading...</p>
          ) : cases.length === 0 ? (
            <p className="p-4 text-gray-500">No trials assigned.</p>
          ) : (
            cases.map((c) => (
              <li 
                key={c._id} 
                className={`p-4 cursor-pointer hover:bg-blue-50 ${selectedCase?._id === c._id ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedCase(c)}
              >
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-gray-500">Filed on: {new Date(c.createdAt).toLocaleDateString()}</p>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="w-2/3">
        {selectedCase ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">{selectedCase.title}</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold uppercase">
                {selectedCase.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold flex items-center mb-2 text-blue-800">
                  <Info className="mr-2 w-4 h-4" /> AI Insight
                </h3>
                <p className="text-sm text-blue-900">
                  <strong>Predicted Category:</strong> {selectedCase.category || 'N/A'}<br/>
                  <strong>Urgency Score:</strong> {selectedCase.aiUrgencyScore || 'N/A'}/5
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold flex items-center mb-2">
                  <Shield className="mr-2 w-4 h-4" /> Personnel
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Police:</strong> {selectedCase.assignedPolice?.name || 'Unassigned'}<br/>
                  <strong>Filer:</strong> {selectedCase.createdBy?.name}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold mb-2 flex items-center">
                <FileText className="mr-2 w-5 h-5" /> Case Description
              </h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded border">
                {selectedCase.description}
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setSelectedCase(null)}
              >
                Close View
              </button>
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold"
                onClick={() => closeCase(selectedCase._id)}
              >
                Issue Verdict & Close Case
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500">
            <Gavel className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a case from the list to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgeDashboard;
