
export interface Scheme {
  id: string;
  title: string;
  description: string;
  category: SchemeCategory;
  level: 'Central' | 'State';
  ministry: string;
  updatedAt: string;
  objectives: string[];
  benefits: string[];
  eligibility: string[];
  documents: string[];
  howToApply: string[];
  applicationUrl: string;
  faqs: { question: string; answer: string }[];
}

export type SchemeCategory = 
  | 'Agriculture' 
  | 'Education' 
  | 'Health' 
  | 'Employment' 
  | 'Women & Child' 
  | 'Business'
  | 'Finance'
  | 'Housing';

export interface UserProfile {
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  state?: string;
  occupation?: string;
  income?: string;
  category?: string;
}
