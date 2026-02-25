
import React from 'react';
import { CheckIcon } from './icons/CheckIcon';

interface CriteriaListProps {
  title: string;
  criteria: string[];
}

export const CriteriaList: React.FC<CriteriaListProps> = ({ title, criteria }) => {
  const highlightClass = title.includes('Essential') ? 'border-cyan-500/50' : 'border-purple-500/50';

  return (
    <div className={`bg-slate-900/50 p-6 rounded-xl border ${highlightClass}`}>
      <h3 className="text-lg font-semibold text-slate-200 mb-4">{title}</h3>
      {criteria.length > 0 ? (
        <ul className="space-y-3">
          {criteria.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 italic">No {title.toLowerCase()} found in the job description.</p>
      )}
    </div>
  );
};
