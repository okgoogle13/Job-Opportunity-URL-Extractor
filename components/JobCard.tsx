import React from 'react';
import type { JobDetails } from '../types';
import { CriteriaList } from './CriteriaList';

interface JobCardProps {
  details: JobDetails;
}

const InfoItem: React.FC<{ label: string; value: string | null }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-slate-200">{value}</p>
    </div>
  );
};

export const JobCard: React.FC<JobCardProps> = ({ details }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-3xl shadow-2xl p-6 sm:p-10 space-y-10">
      <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-slate-700/50 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{details.roleTitle || 'Untitled Role'}</h2>
          <p className="text-indigo-400 font-medium text-lg mt-1">{details.companyName || 'Unknown Organization'}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 md:text-right">
          <InfoItem label="Closing Date" value={details.dueDate} />
          <InfoItem label="Contact Person" value={details.hiringManager} />
        </div>
      </div>

      {details.sectorInsights && (
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6">
          <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Sector Deep Analysis</h3>
          <p className="text-sm text-slate-300 leading-relaxed italic">{details.sectorInsights}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CriteriaList title="Essential Criteria" criteria={details.essentialCriteria} />
        <CriteriaList title="Desirable Criteria" criteria={details.desirableCriteria} />
      </div>

      {details.sources && details.sources.length > 0 && (
        <div className="border-t border-slate-700/50 pt-8">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Verified Sources (Search Grounding)</h3>
          <div className="flex flex-wrap gap-3">
            {details.sources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-medium bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all flex items-center gap-2"
              >
                <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                {source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};