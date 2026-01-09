
import React from 'react';
import { 
  Sprout, 
  GraduationCap, 
  HeartPulse, 
  Briefcase, 
  Baby, 
  Store,
  Home,
  Wallet,
  Zap,
  Hammer
} from 'lucide-react';
import { Scheme, SchemeCategory } from './types';

export const INDIAN_STATES_UTS = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", 
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const OCCUPATIONS = [
  "Farmer",
  "Student",
  "Self-employed / Small Business",
  "Salaried Employee (Private)",
  "Government Employee",
  "Unemployed",
  "Retired / Senior Citizen",
  "Homemaker",
  "Daily Wage Laborer",
  "Artisan / Handicraft Worker",
  "Other"
];

export const CATEGORIES: { label: SchemeCategory | 'Energy'; icon: React.ReactNode; color: string }[] = [
  { label: 'Agriculture', icon: <Sprout size={24} />, color: 'bg-green-100 text-green-700' },
  { label: 'Education', icon: <GraduationCap size={24} />, color: 'bg-blue-100 text-blue-700' },
  { label: 'Health', icon: <HeartPulse size={24} />, color: 'bg-red-100 text-red-700' },
  { label: 'Employment', icon: <Briefcase size={24} />, color: 'bg-purple-100 text-purple-700' },
  { label: 'Women & Child', icon: <Baby size={24} />, color: 'bg-pink-100 text-pink-700' },
  { label: 'Business', icon: <Store size={24} />, color: 'bg-indigo-100 text-indigo-700' },
  { label: 'Housing', icon: <Home size={24} />, color: 'bg-orange-100 text-orange-700' },
  { label: 'Finance', icon: <Wallet size={24} />, color: 'bg-teal-100 text-teal-700' },
];

export const MOCK_SCHEMES: Scheme[] = [
  {
    id: 'pm-surya-ghar',
    title: 'PM Surya Ghar: Muft Bijli Yojana (2025)',
    description: 'Providing free electricity up to 300 units per month to 1 crore households through rooftop solar installations with massive subsidies.',
    category: 'Housing',
    level: 'Central',
    ministry: 'Ministry of New and Renewable Energy',
    updatedAt: '15 Jan 2025',
    objectives: ['Provide free electricity up to 300 units.', 'Promote sustainable energy.', 'Reduce utility bills.'],
    benefits: ['Subsidy up to ₹78,000.', 'Free power units.', 'Income from surplus power.'],
    eligibility: ['Indian citizen.', 'Roof ownership.', 'Valid electricity connection.', 'Income usually below 10 Lakhs (preferred).'],
    documents: ['Aadhaar', 'Electricity Bill', 'Bank Passbook'],
    howToApply: ['Register on National Portal for Rooftop Solar.', 'Apply for feasibility.', 'Install through vendor.'],
    faqs: [{ question: 'What is the limit?', answer: '300 units per month.' }]
  },
  {
    id: 'pm-vidyalaxmi',
    title: 'PM-Vidyalaxmi Education Loan',
    description: 'Collateral-free, guarantor-free loans for students admitted to top-tier higher education institutions in India.',
    category: 'Education',
    level: 'Central',
    ministry: 'Ministry of Education',
    updatedAt: '05 Jan 2025',
    objectives: ['Financial support for higher ed.', 'No student left behind.'],
    benefits: ['Loans up to ₹7.5 Lakh with 75% credit guarantee.', '3% interest subvention.'],
    eligibility: ['Students in top 860 institutions.', 'Merit based admission.', 'Family income < ₹8 Lakh for subvention.'],
    documents: ['Admission Letter', 'Aadhaar', 'Income Certificate'],
    howToApply: ['Apply via PM-Vidyalaxmi portal.', 'Digital loan processing.'],
    faqs: [{ question: 'Need guarantor?', answer: 'No.' }]
  },
  {
    id: 'ayushman-bharat',
    title: 'Ayushman Bharat (PM-JAY)',
    description: 'The world\'s largest health insurance scheme providing ₹5 Lakh per family per year for secondary and tertiary care hospitalization.',
    category: 'Health',
    level: 'Central',
    ministry: 'National Health Authority',
    updatedAt: '20 Dec 2024',
    objectives: ['Health cover for bottom 40% of population.', 'Reduce out-of-pocket medical spend.'],
    benefits: ['₹5 Lakh annual cover.', 'Cashless treatment.', 'Covers pre-existing diseases.'],
    eligibility: ['Based on SECC 2011 data.', 'Low income families.', 'Rural and urban poor.', 'Senior citizens 70+ (new universal expansion).'],
    documents: ['Aadhaar', 'Ration Card'],
    howToApply: ['Check name in beneficiary list.', 'Visit PMAM counter at hospital.'],
    faqs: [{ question: 'Is it free?', answer: 'Yes, fully government funded.' }]
  },
  {
    id: 'pm-kisan',
    title: 'PM-KISAN Samman Nidhi',
    description: 'Income support scheme for all landholding farmers to supplement their financial needs for procuring various agricultural inputs.',
    category: 'Agriculture',
    level: 'Central',
    ministry: 'Ministry of Agriculture',
    updatedAt: '01 Jan 2025',
    objectives: ['Direct income support of ₹6,000 per year.'],
    benefits: ['₹2,000 every 4 months.', 'Direct bank transfer.'],
    eligibility: ['Landholding farmer families.', 'Land record in applicant name.', 'Not an institutional landholder.'],
    documents: ['Land Records', 'Aadhaar', 'Bank Details'],
    howToApply: ['Self-registration on PM-KISAN portal.', 'CSC registration.'],
    faqs: [{ question: 'How many installments?', answer: '3 installments of ₹2000 each.' }]
  },
  {
    id: 'mgnrega',
    title: 'MGNREGA Employment Guarantee',
    description: 'Guarantees at least 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work.',
    category: 'Employment',
    level: 'Central',
    ministry: 'Ministry of Rural Development',
    updatedAt: '15 Dec 2024',
    objectives: ['Enhance livelihood security in rural areas.'],
    benefits: ['100 days guaranteed work.', 'Unemployment allowance if work not provided.', 'Minimum wage payment.'],
    eligibility: ['Adult members of rural households.', 'Willing to do unskilled manual labor.'],
    documents: ['Job Card', 'Aadhaar'],
    howToApply: ['Apply to Gram Panchayat.', 'Get Job Card issued.'],
    faqs: [{ question: 'Who pays wages?', answer: 'Central government funds wages.' }]
  },
  {
    id: 'pm-mudra',
    title: 'PM Mudra Yojana',
    description: 'Loans up to ₹20 Lakh (Tarun Plus) provided to non-corporate, non-farm small/micro enterprises to start or expand businesses.',
    category: 'Business',
    level: 'Central',
    ministry: 'Ministry of Finance',
    updatedAt: '12 Nov 2024',
    objectives: ['Funding the unfunded.', 'Generating employment through micro-units.'],
    benefits: ['Collateral free loans.', 'Three categories: Shishu, Kishore, Tarun.'],
    eligibility: ['Small business owners.', 'Startups.', 'Micro enterprises.'],
    documents: ['Business Plan', 'Aadhaar/PAN', 'KYC'],
    howToApply: ['Apply at any commercial bank.', 'Online via Udyamimitra.'],
    faqs: [{ question: 'Maximum loan?', answer: 'Now up to ₹20 Lakh for successful borrowers.' }]
  },
  {
    id: 'pm-awas-yojana',
    title: 'Pradhan Mantri Awas Yojana (PMAY-U)',
    description: 'Provides central assistance to implementing agencies for providing houses to all eligible families/ beneficiaries by 2024-25.',
    category: 'Housing',
    level: 'Central',
    ministry: 'Ministry of Housing and Urban Affairs',
    updatedAt: '10 Jan 2025',
    objectives: ['Housing for all.', 'Slum rehabilitation.'],
    benefits: ['Interest subsidy on home loans.', 'Financial assistance for construction.'],
    eligibility: ['EWS/LIG families.', 'Should not own a pucca house.', 'Household income criteria apply.'],
    documents: ['Income Proof', 'Aadhaar', 'Affidavit of no pucca house'],
    howToApply: ['Online through PMAY portal.', 'Visit Common Service Centre.'],
    faqs: [{ question: 'Is it for rural?', answer: 'PMAY-G is for rural, PMAY-U is for urban.' }]
  },
  {
    id: 'lakhpati-didi',
    title: 'Lakhpati Didi (Women Empowerment)',
    description: 'Initiative to train and empower 3 crore rural women to earn an annual income of at least ₹1 Lakh per household.',
    category: 'Women & Child',
    level: 'Central',
    ministry: 'Ministry of Rural Development',
    updatedAt: '15 Jan 2025',
    objectives: ['Financial independence of SHG women.'],
    benefits: ['Skill training (Drone operation, plumbing, etc).', 'Business capital support.'],
    eligibility: ['Members of Self Help Groups (SHGs).', 'Rural resident women.'],
    documents: ['SHG ID Card', 'Aadhaar'],
    howToApply: ['Register through SHG federations.', 'Contact local BDO office.'],
    faqs: [{ question: 'What skills are provided?', answer: 'Technical, vocational, and digital skills.' }]
  },
  {
    id: 'sukanya-samriddhi',
    title: 'Sukanya Samriddhi Yojana',
    description: 'A small deposit scheme for the girl child launched as a part of the \'Beti Bachao Beti Padhao\' campaign.',
    category: 'Finance',
    level: 'Central',
    ministry: 'Ministry of Finance',
    updatedAt: '01 Jan 2025',
    objectives: ['Savings for girl child education and marriage.'],
    benefits: ['High interest rate.', 'Income tax benefits (80C).', 'Maturity after 21 years.'],
    eligibility: ['Parent/Guardian of girl child.', 'Age of girl < 10 years.', 'Max 2 accounts per family.'],
    documents: ['Birth Certificate of girl', 'Aadhaar of parent'],
    howToApply: ['Open account in Post Office or Banks.'],
    faqs: [{ question: 'Min deposit?', answer: '₹250 per year.' }]
  }
];
