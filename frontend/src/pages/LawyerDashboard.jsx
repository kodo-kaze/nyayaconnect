import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, FileText, Send } from 'lucide-react';

const LawyerDashboard = () => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <Briefcase className="mr-4 w-10 h-10 text-blue-700" /> Lawyer Case Management
      </h1>
      
      <div className="space-y-6">
        {loading ? (
          <p>Loading cases...</p>
        ) : cases.length === 0 ? (
          <p className="text-gray-500 italic">No cases currently assigned to you.</p>
        ) : (
          cases.map((c) => (
            <div key={c._id} className="bg-white shadow rounded-lg p-6 border-t-4 border-blue-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{c.title}</h3>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">{c.status}</span>
              </div>
              <p className="text-gray-600 mb-6">{c.description}</p>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center">
                    <FileText className="mr-2 w-4 h-4" /> Evidence & Documents
                </h4>
                <div className="flex items-center space-x-4">
                    <button className="text-sm text-blue-600 hover:underline">View Evidence Locker</button>
                    <button className="text-sm text-blue-600 hover:underline">Download Case File</button>
                </div>
              </div>

              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800">
                    <Send className="mr-2 w-4 h-4" /> Submit Legal Argument
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LawyerDashboard;
