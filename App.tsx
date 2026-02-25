import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { extractJobDetails } from './services/geminiService';
import type { JobDetails, SavedJob } from './types';
import { JobCard } from './components/JobCard';
import { LoadingSpinner } from './components/icons/LoadingSpinner';
import { LogoIcon } from './components/icons/LogoIcon';
import { SavedJobsList } from './components/SavedJobsList';
import { SaveIcon } from './components/icons/SaveIcon';
import { CheckIcon } from './components/icons/CheckIcon';

const JOB_PLATFORMS = [
  'linkedin.com', 'indeed.com', 'glassdoor.com', 'seek.com.au', 
  'iworkfor.nsw.gov.au', 'vic.gov.au', 'apsjobs.gov.au', 'ethicaljobs.com.au'
];

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isDeep, setIsDeep] = useState<boolean>(false);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  useEffect(() => {
    try {
      const storedJobs = localStorage.getItem('savedJobs');
      if (storedJobs) setSavedJobs(JSON.parse(storedJobs));
    } catch (err) {
      console.error("Failed to load history", err);
    }
  }, []);
  
  const isJobSaved = useMemo(() => {
    if (!url) return false;
    return savedJobs.some(job => job.url === url);
  }, [savedJobs, url]);

  const isKnownPlatform = useMemo(() => {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      return JOB_PLATFORMS.some(platform => hostname.includes(platform));
    } catch {
      return false;
    }
  }, [url]);

  const validateUrl = (input: string): string | null => {
    if (!input.trim()) return 'Please enter a URL.';
    try {
      new URL(input);
    } catch {
      return 'Please enter a valid URL.';
    }
    return null;
  };

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateUrl(url);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setJobDetails(null);

    try {
      const details = await extractJobDetails(url, isDeep);
      setJobDetails(details);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [url, isDeep]);
  
  const handleSaveJob = useCallback(() => {
    if (!jobDetails || !url || isJobSaved) return;
    const newSavedJob: SavedJob = { id: Date.now().toString(), url, ...jobDetails };
    const updatedJobs = [newSavedJob, ...savedJobs];
    setSavedJobs(updatedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
  }, [jobDetails, url, savedJobs, isJobSaved]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-10 mt-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <LogoIcon className="h-12 w-12 text-indigo-400" />
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
              Job Extractor
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Australian Sector Intelligence & Selection Criteria Discovery</p>
        </header>

        <main className="space-y-6">
          <section className="bg-slate-800/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20">1</span>
                Source Discovery
              </h2>
              {isKnownPlatform && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
                  <CheckIcon className="h-3 w-3" /> VERIFIED SECTOR PLATFORM
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Job URL (APS, SEEK, NSW Government...)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-5 py-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isDeep} onChange={(e) => setIsDeep(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-sm font-medium text-slate-300">Deep Analysis (Thinking Mode)</span>
                  </label>
                  <div className="group relative">
                    <span className="cursor-help text-slate-500 hover:text-indigo-400">ⓘ</span>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-slate-950 border border-slate-700 rounded-lg text-[10px] text-slate-400 shadow-2xl z-10">
                      Uses Gemini 3 Pro with high reasoning budget to map criteria to Australian Capability Frameworks.
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
                >
                  {isLoading ? <LoadingSpinner className="h-5 w-5" /> : 'Start Extraction'}
                </button>
              </div>
            </form>
          </section>

          <section className="min-h-[200px]">
            {error && (
              <div className="bg-red-950/20 border border-red-500/30 text-red-400 p-6 rounded-2xl mb-6">
                <p className="font-bold flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                  Extraction Error
                </p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            )}
            
            {jobDetails && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20">2</span>
                    Intelligence Dashboard
                  </h2>
                  <button
                    onClick={handleSaveJob}
                    disabled={isJobSaved}
                    className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-full border transition-all ${
                        isJobSaved ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    {isJobSaved ? <><CheckIcon className="h-3 w-3" /> SAVED</> : <><SaveIcon className="h-3 w-3" /> SAVE ROLE</>}
                  </button>
                </div>
                <JobCard details={jobDetails} />
              </div>
            )}

            {!isLoading && !jobDetails && (
                <div className="text-center py-16 px-4 bg-slate-800/10 border border-slate-800 border-dashed rounded-3xl opacity-40">
                    <p className="text-slate-500 text-sm">Waiting for valid job listing source...</p>
                </div>
            )}
          </section>
        </main>
        
        <SavedJobsList jobs={savedJobs} onLoad={(j) => { setUrl(j.url); setJobDetails(j); }} onDelete={(id) => setSavedJobs(prev => prev.filter(j => j.id !== id))} />
      </div>
    </div>
  );
};

export default App;