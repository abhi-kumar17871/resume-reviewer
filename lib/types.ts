export type Resume = {
  id: string;
  created_at: string;
  user_id: string;
  file_path: string;
  status: 'In Review' | 'Approved' | 'Rejected' | 'Needs Revision';
  notes: string | null;
  score: number | null;
};