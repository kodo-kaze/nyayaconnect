import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Home, ArrowLeft, AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
        <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-8 border border-slate-200 shadow-sm">
          <Scale className="h-12 w-12 text-slate-300" />
        </div>
        
        <h1 className="text-9xl font-black text-primary/10 leading-none mb-4">404</h1>
        
        <div className="space-y-2 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Resource Not Found</h2>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            The requested legal docket or administrative portal could not be located within the NyayaConnect registry.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-secondary px-8 h-12"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary px-8 h-12 bg-primary shadow-lg shadow-primary/20"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Portal
          </button>
        </div>

        <div className="mt-16 flex items-center gap-2 text-slate-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Official System Error • Code 0x404</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
