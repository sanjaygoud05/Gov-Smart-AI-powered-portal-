
export interface Scheme {
  id: string;
  title: string;
  description: string;
  category: SchemeCategory;
  level: 'Central' | 'State';
  departmentName: string; // User requested "Department Name"
  ministry: string;
  updatedAt: string;
  startDate: string; // User requested "Start Date"
  expiryDate: string; // User requested "End Date"
  objectives: string[];
  benefits: string[]; // User requested "Benefits Provided"
  eligibility: string[]; // User requested "Eligibility Criteria"
  documents: string[]; // User requested "Required Documents"
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
