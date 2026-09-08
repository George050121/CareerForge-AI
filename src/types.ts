export type Status = 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
export interface Application { id: string; company: string; role: string; status: Status; fitScore: number; date: string; location: string; }
export interface Analysis { fitScore: number; verdict: string; strengths: string[]; gaps: string[]; missingKeywords: string[]; resumeRewrite: string[]; coverLetter: string; interviewQuestions: { question: string; strategy: string }[]; }
export interface AnalyzeRequest { resume: string; jobDescription: string; company?: string; role?: string; }
