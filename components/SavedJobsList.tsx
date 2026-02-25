import React from 'react';
import type { SavedJob } from '../types';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SavedJobsListProps {
  jobs: SavedJob[];
  onLoad: (job: SavedJob) => void;
  onDelete: (id: string) => void;
}

export const SavedJobsList: React.FC<SavedJobsListProps> = ({ jobs, onLoad, onDelete }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-slate-200 mb-4">Saved Jobs</h2>
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700 min-h-[10rem]">
        {jobs.length > 0 ? (
          <ul className="divide-y divide-slate-700">
            {jobs.map((job) => (
              <li key={job.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-grow overflow-hidden">
                  <p className="font-semibold text-indigo-400 truncate">{job.roleTitle || 'Untitled Role'}</p>
                  <p className="text-sm text-slate-400">{job.companyName || 'Unknown Company'}</p>
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-slate-500 hover:text-cyan-400 truncate block max-w-xs sm:max-w-sm md:max-w-md"
                    title={job.url}
                  >
                    {job.url}
                  </a>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onLoad(job)}
                    title="Load Job Details"
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <DocumentTextIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(job.id)}
                    title="Delete Job"
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-red-400 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full">
             <p className="text-slate-500 italic text-center py-4">Jobs you save will appear here for easy access.</p>
          </div>
        )}
      </div>
    </div>
  );
};
