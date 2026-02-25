export interface GroundingSource {
  title: string;
  uri: string;
}

export interface JobDetails {
  dueDate: string | null;
  companyName: string | null;
  roleTitle: string | null;
  hiringManager: string | null;
  managerContact: string | null;
  essentialCriteria: string[];
  desirableCriteria: string[];
  sectorInsights?: string;
  sources?: GroundingSource[];
}

export interface SavedJob extends JobDetails {
  id: string;
  url: string;
}