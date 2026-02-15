import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, List, Clock, CheckCircle, FileText } from 'lucide-react';

const CitizenDashboard = () => {
  const [cases, setCases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get AI Analysis first
      const aiRes = await axios.post('http://localhost:5000/ai/analyzeComplaint', { 
        complaint_text: formData.description 
      });
      
      await axios.post('http://localhost:5000/cases/create', {
        ...formData,
        category: aiRes.data.category,
        aiUrgencyScore: aiRes.data.urgency_score
      });
      
      setFormData({ title: '', description: '' });
      setShowForm(false);
      fetchCases();
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'filed': return <FileText className="text-blue-500" />;
      case 'investigating': return <Clock className="text-yellow-500" />;
      case 'trial': return <Clock className="text-purple-500" />;
      case 'closed': return <CheckCircle className="text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Legal Cases</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Complaint
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow sm:rounded-lg mb-8 p-6">
          <h2 className="text-lg font-medium mb-4">File New Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Complaint
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {loading ? (
            <p className="p-4 text-center">Loading cases...</p>
          ) : cases.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No cases found.</p>
          ) : (
            cases.map((c) => (
              <li key={c._id}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4">{getStatusIcon(c.status)}</div>
                    <div>
                      <p className="text-sm font-medium text-blue-600 truncate">{c.title}</p>
                      <p className="text-sm text-gray-500">{c.description.substring(0, 100)}...</p>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${c.status === 'closed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {c.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default CitizenDashboard;
