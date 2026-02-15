import React from 'react';
import { CheckCircle2, Circle, Clock, Gavel, Search, FileText } from 'lucide-react';

const CaseTimeline = ({ status }) => {
  const steps = [
    { id: 'filed', label: 'Filed', icon: FileText },
    { id: 'registered', label: 'Registered', icon: CheckCircle2 },
    { id: 'investigating', label: 'Investigating', icon: Search },
    { id: 'trial', label: 'Trial', icon: Gavel },
    { id: 'closed', label: 'Closed', icon: CheckCircle2 },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === status?.toLowerCase());
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="relative flex flex-col gap-4 py-4">
      <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-200 lg:left-1/2 lg:-ml-px lg:hidden"></div>
      
      <div className="space-y-8">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="relative flex items-center gap-4 lg:gap-6">
              <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                isCompleted ? 'bg-primary border-primary text-white' : 
                isCurrent ? 'bg-white border-primary text-primary' : 
                'bg-white border-slate-200 text-slate-400'
              }`}>
                <step.icon className="h-4 w-4" />
              </div>
              
              <div className="flex flex-col">
                <span className={`text-sm font-semibold ${isCurrent ? 'text-primary' : isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                  {step.label}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-medium uppercase text-primary animate-pulse">Current Stage</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaseTimeline;
